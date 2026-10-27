import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
import { stateService, json } from "../../../server/state-service.mjs";
export const dynamic = "force-dynamic";
async function handle(request: Request) {
  try {
    return await stateService(
      request,
      env.DB,
      await getChatGPTUser(),
      env.OWNER_EMAIL,
    );
  } catch (e) {
    console.error("state_api_failure", e);
    return json(
      {
        error: "Không thể truy cập database. Thay đổi chưa được xác nhận lưu.",
        code: "database_error",
      },
      503,
    );
  }
}
export const GET = handle;
export const PUT = handle;
