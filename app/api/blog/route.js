import { blog_data } from "@/Assets/assets";

export async function GET(request) {
  return Response.json({ blogs: blog_data });
}
