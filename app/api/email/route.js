export async function POST(request) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    
    if (!email) {
      return Response.json({ success: false, msg: "Email is required" }, { status: 400 });
    }
    
    // Simulate successful subscription storage/processing
    console.log(`Subscribed email: ${email}`);
    
    return Response.json({ success: true, msg: "Subscription Successful" });
  } catch (error) {
    return Response.json({ success: false, msg: error.message }, { status: 500 });
  }
}
