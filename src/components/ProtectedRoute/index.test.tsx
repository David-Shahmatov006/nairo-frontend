import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigationType,
} from "react-router-dom";
import { useAuthStore } from "../../stores/auth";
import type { User } from "../../types/user";
import { ProtectedRoute } from ".";

const initialState = useAuthStore.getState();

const user: User = {
  id: "user-1",
  email: "a@b.com",
  username: "nairo",
  firstName: "Ada",
  lastName: "Lovelace",
  nairoBalance: 0,
  isPremium: false,
  preferredLanguage: "en",
  interests: [],
  followers: [],
  followings: [],
  referralCode: "CODE",
  inviteRewards: 0,
};

// Exposes how the router got here, so the <Navigate replace /> can be asserted
// without reaching into router internals.
const LoginScreen = () => {
  const navigationType = useNavigationType();

  return <p data-navigation-type={navigationType}>login screen</p>;
};

const renderRoute = () =>
  render(
    <MemoryRouter initialEntries={["/feed"]}>
      <Routes>
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <p>feed screen</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  useAuthStore.setState(initialState, true);
  localStorage.clear();
});

describe("ProtectedRoute", () => {
  it("renders the children for an authenticated user", () => {
    useAuthStore.setState({ token: "jwt-123", user });

    renderRoute();

    expect(screen.getByText("feed screen")).toBeInTheDocument();
    expect(screen.queryByText("login screen")).not.toBeInTheDocument();
  });

  it("redirects to the login screen when nothing is stored", () => {
    renderRoute();

    expect(screen.getByText("login screen")).toBeInTheDocument();
    expect(screen.queryByText("feed screen")).not.toBeInTheDocument();
  });

  it("redirects when there is a token but no user", () => {
    useAuthStore.setState({ token: "jwt-123", user: null });

    renderRoute();

    expect(screen.getByText("login screen")).toBeInTheDocument();
  });

  it("redirects when there is a user but no token", () => {
    useAuthStore.setState({ token: null, user });

    renderRoute();

    expect(screen.getByText("login screen")).toBeInTheDocument();
  });

  it("replaces the guarded entry so back does not return to it", () => {
    renderRoute();

    expect(screen.getByText("login screen")).toHaveAttribute(
      "data-navigation-type",
      "REPLACE",
    );
  });
});
