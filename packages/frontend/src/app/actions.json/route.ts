import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/**",
        apiPath: "https://api.blinkord.com/blinks/**",
      },
    ],
  };

  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
};

export const OPTIONS = GET;
