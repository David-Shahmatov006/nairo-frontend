import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { trackLocationHref } from "../test/location";
import type { TrackedLocation } from "../test/location";
import { $api } from "./interceptor";

// $api has to be an axios instance the module can register interceptors on and
// call again for the retry, so the mocked create() returns a callable jest.fn.
jest.mock("axios", () => {
  const instance = jest.fn();

  Object.assign(instance, {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  });

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => instance),
      post: jest.fn(),
    },
  };
});

const API_URL = import.meta.env.VITE_API_URL;

type RequestConfig = {
  url: string;
  headers: Record<string, string>;
  _retry?: boolean;
};

type RequestHandler = (config: RequestConfig) => RequestConfig;
type ResponseHandler = (response: unknown) => unknown;
type ResponseErrorHandler = (error: unknown) => Promise<unknown>;

const refreshMock = axios.post as unknown as jest.Mock;
const apiMock = $api as unknown as jest.Mock;

// clearMocks wipes recorded calls before every test, so the interceptors
// registered at import time are captured here, while the module is evaluated.
const createOptions = (axios.create as unknown as jest.Mock).mock.calls[0][0];
const requestCalls = (
  $api.interceptors.request.use as unknown as jest.Mock
).mock.calls;
const responseCalls = (
  $api.interceptors.response.use as unknown as jest.Mock
).mock.calls;

const attachToken = requestCalls[0][0] as RequestHandler;
const onResponse = responseCalls[0][0] as ResponseHandler;
const onResponseError = responseCalls[0][1] as ResponseErrorHandler;

const initialAuthState = useAuthStore.getState();

const makeConfig = (overrides: Partial<RequestConfig> = {}): RequestConfig => ({
  url: "/posts",
  headers: {},
  ...overrides,
});

const makeError = (config: RequestConfig, status = 401) => ({
  config,
  response: { status },
});

const makeNetworkError = (config: RequestConfig) => ({ config });

let tracked: TrackedLocation;

beforeEach(() => {
  useAuthStore.setState(initialAuthState, true);
  localStorage.clear();
  refreshMock.mockReset();
  apiMock.mockReset();
  tracked = trackLocationHref();
});

afterEach(() => {
  tracked.restore();
});

describe("$api", () => {
  it("is created against the api url and sends cookies", () => {
    expect(createOptions).toEqual({
      baseURL: API_URL,
      withCredentials: true,
    });
  });

  it("passes successful responses through untouched", () => {
    const response = { status: 200, data: { id: "post-1" } };

    expect(onResponse(response)).toBe(response);
  });
});

describe("request interceptor", () => {
  it("attaches the token held by the auth store", () => {
    useAuthStore.getState().setToken("store-token");

    const config = attachToken(makeConfig());

    expect(config.headers.Authorization).toBe("Bearer store-token");
  });

  it("falls back to the token in localStorage", () => {
    localStorage.setItem("token", "stored-token");

    const config = attachToken(makeConfig());

    expect(config.headers.Authorization).toBe("Bearer stored-token");
  });

  it("prefers the store over localStorage", () => {
    localStorage.setItem("token", "stale-token");
    useAuthStore.getState().setToken("fresh-token");

    const config = attachToken(makeConfig());

    expect(config.headers.Authorization).toBe("Bearer fresh-token");
  });

  it("sends no Authorization header when there is no token anywhere", () => {
    const config = attachToken(makeConfig());

    expect(config.headers).toEqual({});
  });
});

describe("response interceptor on 401", () => {
  it("refreshes the session and replays the original request", async () => {
    refreshMock.mockResolvedValue({ data: { accessToken: "new-token" } });
    apiMock.mockResolvedValue({ status: 200, data: "replayed" });

    const config = makeConfig();
    const result = await onResponseError(makeError(config));

    expect(refreshMock).toHaveBeenCalledWith(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    expect(apiMock).toHaveBeenCalledWith(config);
    expect(result).toEqual({ status: 200, data: "replayed" });
  });

  it("stores the refreshed token in the auth store and localStorage", async () => {
    refreshMock.mockResolvedValue({ data: { accessToken: "new-token" } });
    apiMock.mockResolvedValue({ status: 200 });

    await onResponseError(makeError(makeConfig()));

    expect(useAuthStore.getState().token).toBe("new-token");
    expect(localStorage.getItem("token")).toBe("new-token");
  });

  it("replays the request with the refreshed Authorization header", async () => {
    refreshMock.mockResolvedValue({ data: { accessToken: "new-token" } });
    apiMock.mockResolvedValue({ status: 200 });

    const config = makeConfig({ headers: { Authorization: "Bearer expired" } });
    await onResponseError(makeError(config));

    expect(config.headers.Authorization).toBe("Bearer new-token");
    expect(config._retry).toBe(true);
  });

  it("does not redirect when the refresh succeeds", async () => {
    refreshMock.mockResolvedValue({ data: { accessToken: "new-token" } });
    apiMock.mockResolvedValue({ status: 200 });

    await onResponseError(makeError(makeConfig()));

    expect(tracked.hrefs).toEqual([]);
  });
});

describe("response interceptor when the refresh fails", () => {
  const expiredError = new Error("refresh rejected");

  beforeEach(() => {
    refreshMock.mockRejectedValue(expiredError);
    useAuthStore.setState({ token: "expired-token" });
    localStorage.setItem("token", "expired-token");
  });

  it("logs the user out", async () => {
    await expect(onResponseError(makeError(makeConfig()))).rejects.toBeDefined();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("removes the stored token", async () => {
    await expect(onResponseError(makeError(makeConfig()))).rejects.toBeDefined();

    expect(localStorage.getItem("token")).toBeNull();
  });

  it("redirects to the login page", async () => {
    await expect(onResponseError(makeError(makeConfig()))).rejects.toBeDefined();

    // Two entries: logout() redirects as well, then the interceptor does it again.
    expect(tracked.hrefs).toEqual(["/login", "/login"]);
  });

  it("rejects with the original error rather than the refresh error", async () => {
    const originalError = makeError(makeConfig());

    await expect(onResponseError(originalError)).rejects.toBe(originalError);
  });

  it("never replays the original request", async () => {
    await expect(onResponseError(makeError(makeConfig()))).rejects.toBeDefined();

    expect(apiMock).not.toHaveBeenCalled();
  });
});

describe("response interceptor loop guards", () => {
  it("does not try to refresh when the refresh call itself gets a 401", async () => {
    const config = makeConfig({ url: `${API_URL}/auth/refresh` });
    const error = makeError(config);

    await expect(onResponseError(error)).rejects.toBe(error);

    expect(refreshMock).not.toHaveBeenCalled();
    expect(apiMock).not.toHaveBeenCalled();
    expect(tracked.hrefs).toEqual([]);
  });

  it("ignores an already retried request", async () => {
    const error = makeError(makeConfig({ _retry: true }));

    await expect(onResponseError(error)).rejects.toBe(error);

    expect(refreshMock).not.toHaveBeenCalled();
    expect(apiMock).not.toHaveBeenCalled();
  });

  it("refreshes only once when the replayed request is rejected again", async () => {
    refreshMock.mockResolvedValue({ data: { accessToken: "new-token" } });
    apiMock.mockResolvedValue({ status: 200 });

    const config = makeConfig();
    await onResponseError(makeError(config));

    // The replay came back 401 too: same config object, now flagged as retried.
    const secondError = makeError(config);
    await expect(onResponseError(secondError)).rejects.toBe(secondError);

    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(apiMock).toHaveBeenCalledTimes(1);
  });
});

describe("response interceptor on other failures", () => {
  it("passes a 500 through without refreshing", async () => {
    const error = makeError(makeConfig(), 500);

    await expect(onResponseError(error)).rejects.toBe(error);

    expect(refreshMock).not.toHaveBeenCalled();
    expect(apiMock).not.toHaveBeenCalled();
  });

  it("passes a request that never got a response through without refreshing", async () => {
    const error = makeNetworkError(makeConfig());

    await expect(onResponseError(error)).rejects.toBe(error);

    expect(refreshMock).not.toHaveBeenCalled();
    expect(tracked.hrefs).toEqual([]);
  });
});
