import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
import { authorized, json } from "../../../server/state-service.mjs";
export const dynamic = "force-dynamic";
export async function GET() {
  const user = await getChatGPTUser();
  return json({
    authenticated: !!user,
    canEdit: authorized(user, env.OWNER_EMAIL),
    userId: user?.userId || null,
    displayName: user?.displayName || null,
    configured: !!env.DB && !!env.OWNER_EMAIL,
  });
}
