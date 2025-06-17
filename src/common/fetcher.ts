import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

/**
 * Fetch raw Medium RSS feed XML
 */
export const fetchMediumFeed = async (
  username: string
): Promise<string | null> => {
  try {
    const url = `https://medium.com/feed/@${username}`;
    const res = await axios.get(url, {
      headers: {
        Accept: "application/rss+xml",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Accept-Encoding": "gzip, deflate, br",
      },
      timeout: 5000,
    });
    return res.status === 200 ? res.data : null;
  } catch (error) {
    return null;
  }
};

/**
 * Strip HTML tags from content
 */
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

/**
 * Create a short description (max 60 chars)
 */
const createShortDescription = (html: string): string => {
  const clean = stripHtmlTags(html);
  return clean.length > 60 ? clean.slice(0, 60) + "..." : clean;
};

/**
 * Parse RSS XML into usable Medium data
 */
export type MediumParsedData = {
  username: string;
  title: string;
  category: string;
  description: string;
  pubDate: string;
};

export const parseMediumXml = (xml: string): MediumParsedData | null => {
  try {
    const result = parser.parse(xml);

    const channel = result?.rss?.channel;
    const item = Array.isArray(channel.item) ? channel.item[0] : channel.item;

    const username = (channel.title ?? "")
      .replace("Stories by ", "")
      .replace(" on Medium", "");

    const title = item.title || "";
    const category = Array.isArray(item.category)
      ? item.category[0]
      : item.category || "Uncategorized";
    const rawDescription = item["content:encoded"] || item.description || "";
    const description = createShortDescription(rawDescription);
    const pubDate =
      item.pubDate?.split(",")[1]?.trim().split(" ").slice(1, 3).join(" ") ??
      "";

    return { username, title, category, description, pubDate };
  } catch (error) {
    return null;
  }
};
