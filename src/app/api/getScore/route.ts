import { NextResponse, NextRequest } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { score: number } }) {
  try {
    // Verify database connection
    return NextResponse.json({ success: false, message: "todo" }, { status: 200 });

  } catch (error: any) {
    console.error("An error occurred:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
