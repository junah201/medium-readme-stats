import { describe, it, expect } from "vitest";
import { fetchMediumFeed, parseMediumXml } from "@/common/fetcher";

describe("Integration: Medium Feed", () => {
  it("should fetch and parse actual Medium feed", async () => {
    const username = "junah201";
    const feedXml = await fetchMediumFeed(username);
    expect(feedXml).toBeTruthy();

    const parsed = feedXml ? parseMediumXml(feedXml) : null;

    expect(parsed).toBeTruthy();
    expect(parsed?.username.toLowerCase()).toContain(username);
    expect(parsed?.title.length).toBeGreaterThan(0);
    expect(parsed?.description.length).toBeGreaterThan(0);
    expect(parsed?.pubDate).toMatch(/\d{1,2} \w+/);
  }, 10_000);
});
