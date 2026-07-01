import { ConnectDB } from "@/lib/config/db"
import BlogModel from "@/lib/models/BlogModel";
import UserModel from "@/lib/models/UserModel";
import { notifySubscribersOfNewPost } from "@/lib/services/emailService";
import { verifyToken } from "@/lib/utils/auth";
import { cookies } from 'next/headers';
import { after, NextResponse } from "next/server";
import { writeFile } from 'fs/promises'
const fs = require('fs')
import { blog_data } from "@/Assets/assets";

const LoadDB = async () => {
  await ConnectDB();
  try {
    const count = await BlogModel.countDocuments();
    if (count === 0) {
      console.log("Database is empty. Seeding default blog data...");
      const seededBlogs = blog_data.map(item => ({
        title: item.title,
        description: item.description,
        category: item.category,
        author: item.author,
        image: typeof item.image === 'object' ? item.image.src : item.image,
        authorImg: typeof item.author_img === 'object' ? item.author_img.src : (item.author_img || "/author_img.png"),
        date: item.date || Date.now()
      }));
      await BlogModel.insertMany(seededBlogs);
      console.log("Database seeded successfully with", seededBlogs.length, "blogs.");
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

LoadDB();


// API Endpoint to get all blogs
export async function GET(request) {

  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    return NextResponse.json(blog);
  }
  else {
    const blogs = await BlogModel.find({});
    return NextResponse.json({ blogs })
  }
}


// API Endpoint For Uploading Blogs
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const token = tokenCookie ? tokenCookie.value : null;

    if (!token) {
      return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 });
    }

    await ConnectDB();

    // Fetch user details to get avatar and actual name
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, msg: "User profile not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    if (!image) {
      return NextResponse.json({ success: false, msg: "Image is required" }, { status: 400 });
    }

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: `${formData.get('title')}`,
      description: `${formData.get('description')}`,
      category: `${formData.get('category')}`,
      author: user.name,
      image: `${imgUrl}`,
      authorImg: user.avatar || "/author_img.png",
      date: Date.now()
    }

    const createdBlog = await BlogModel.create(blogData);
    console.log("Blog Saved:", createdBlog._id);

    after(async () => {
      await notifySubscribersOfNewPost({
        blogId: createdBlog._id.toString(),
        title: createdBlog.title,
        description: createdBlog.description,
        author: createdBlog.author,
        image: createdBlog.image,
        category: createdBlog.category
      });
    });

    return NextResponse.json({ success: true, msg: "Blog Added", blogId: createdBlog._id })
  } catch (error) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}

// Creating API Endpoint to delete Blog

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get('id');
  const blog = await BlogModel.findById(id);
  fs.unlink(`./public${blog.image}`, () => { });
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ msg: "Blog Deleted" });
}
