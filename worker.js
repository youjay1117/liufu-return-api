
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/health" || request.method !== "GET") {
      return new Response("Not Found", { status: 404 });
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
      return Response.json({
        status: "configuration_error",
        message: "Cloudflare 連線設定尚未完成"
      }, { status: 503 });
    }

    try {
      const response = await fetch(
        env.SUPABASE_URL.replace(/\/$/, "") +
          "/rest/v1/return_items?select=id&limit=0",
        {
          headers: {
            apikey: env.SUPABASE_SECRET_KEY,
            Authorization: "Bearer " + env.SUPABASE_SECRET_KEY
          }
        }
      );

      return Response.json({
        status: response.ok ? "ok" : "connection_error",
        database: response.ok ? "connected" : "not_connected"
      }, {
        status: response.ok ? 200 : 503
      });
    } catch {
      return Response.json({
        status: "connection_error",
        message: "無法連線至 Supabase"
      }, { status: 503 });
    }
  }
};
