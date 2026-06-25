import { blog_data } from "@/Assets/assets";

export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = blog_data.find((item) => String(item.id) === String(blogId));
    if (blog) {
      return Response.json(blog);
    }
    return Response.json({ success: false, msg: "Blog not found" }, { status: 404 });
  }
  return Response.json({ blogs: blog_data });
}
