import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import { NextResponse } from "next/server";

const LoadDB = async () => {
  await ConnectDB();
}

LoadDB();

export async function GET(request) {
  try {
    const emails = await EmailModel.find({});
    return NextResponse.json({ emails });
  } catch (error) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    
    if (!email) {
      return NextResponse.json({ success: false, msg: "Email is required" }, { status: 400 });
    }
    
    const emailExist = await EmailModel.findOne({ email });
    if (emailExist) {
      return NextResponse.json({ success: false, msg: "Email already subscribed" });
    }
    
    await EmailModel.create({ email });
    
    return NextResponse.json({ success: true, msg: "Subscription Successful" });
  } catch (error) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, msg: "ID is required" }, { status: 400 });
    }
    
    await EmailModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, msg: "Email Deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}

