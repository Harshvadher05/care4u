import axios from "axios";
import { InternalServerError } from "../handlers/error.handlers.js";

export const generateZoomAccessToken = async (): Promise<string> => {
  try {
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    const accountId = process.env.ZOOM_ACCOUNT_ID;

    if (!clientId || !clientSecret || !accountId) {
      throw new InternalServerError('Zoom credentials not configured');
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await axios.post(
      `https://zoom.us/oauth/token`,
      null,
      {
        params: {
          grant_type: "account_credentials",
          account_id: accountId
        },
        headers: {
          Authorization: `Basic ${credentials}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Error while generating access token');
  }
};
