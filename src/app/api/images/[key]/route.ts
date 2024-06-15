import type { NextRequest } from "next/server";
import { GetSignedUrl } from "~/lib/server/file_upload";
import axios from "axios";

export async function GET(_: NextRequest, params: {
  params: {
    key: string;
  }
}) {
  const url = await GetSignedUrl(params.params.key);

  const data = await axios.get<ArrayBuffer>(url, {
    responseType: "arraybuffer"
  });

  return new Response(data.data, {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": data.data.byteLength.toString()
    },
  });
}
