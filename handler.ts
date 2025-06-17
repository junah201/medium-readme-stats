import { APIGatewayProxyHandler } from "aws-lambda";
import { createRecentPostCard } from "@/v1/renderer";

export const handler: APIGatewayProxyHandler = async (event) => {
  const version = event.path?.includes("/v2") ? "v2" : "v1";
  const username = event.queryStringParameters?.username;

  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Username is required" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  const svg = await createRecentPostCard(username);
  return {
    statusCode: 200,
    headers: { "Content-Type": "image/svg+xml" },
    body: svg,
  };
};
