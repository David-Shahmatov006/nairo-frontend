import { resolveAgentLink } from "./resolveAgentLink";

const id = "701fc757-cdf1-4e45-8104-c186f37454f6";

it.each(["http://localhost:5173", "https://nairo-frontend-production.up.railway.app"])(
  "resolves post links to %s regardless of the generated domain", (origin) => {
    for (const host of ["https://nairo.app", "https://nairo.com.ua", "https://invented-domain.example", ""]) {
      for (const route of ["post", "posts"]) {
        expect(resolveAgentLink(`${host}/${route}/${id}`, origin)).toBe(`${origin}/post/${id}`);
        expect(resolveAgentLink(`${host}/${route}/${id}?from=agent#comments`, origin))
          .toBe(`${origin}/post/${id}?from=agent#comments`);
      }
    }
  },
);

it("keeps ordinary external URLs unchanged", () => {
  expect(resolveAgentLink("https://example.com/posts/article", "http://localhost:5173"))
    .toBe("https://example.com/posts/article");
});
