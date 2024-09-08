import { NextResponse, NextRequest } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from "next/headers";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://mxagvhzqjwzyjmzclpnn.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest, { params }: { params: { score: number } }) {
  try {
    const cookieStore = cookies();
    const userToken = cookieStore.get('token')?.value || "";
    if (!userToken) return NextResponse.json({ success: true, score: 0 }, { status: 200 });
    const decoded = jwt.verify(userToken, process.env.SECRET_KEY || "default_secret_key");
    if (!decoded || typeof decoded === "string") return NextResponse.json({ success: true, score: 0 }, { status: 200 });
    const id = (decoded as JwtPayload).id as number
    const { data, error } = await supabase
      .from('game')
      .select("*")
      .eq('id', id)
    if (error) {
      throw new Error(error.message);
    }
    let score = data[0]?.score || 0;
    return NextResponse.json({ success: true, score: score }, { status: 200 });

  } catch (error: any) {
    console.error("An error occurred:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
