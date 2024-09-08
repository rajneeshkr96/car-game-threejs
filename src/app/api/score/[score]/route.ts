import { NextResponse, NextRequest } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from "next/headers";

const supabaseUrl = 'https://mxagvhzqjwzyjmzclpnn.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest, { params }: { params: { score: number } }) {
  try {
    const { score } = params;
    const cookieStore = cookies();
    const userToken = cookieStore.get('token')?.value || "";
    if (userToken) {
      const decoded = jwt.verify(userToken, process.env.SECRET_KEY || "default_secret_key");
      if (decoded || typeof decoded !== "string") {
        const id = (decoded as JwtPayload).id as number

        const res = await supabase
          .from('game')
          .select("*")
          .eq('id', id)
          .single()
        const storedScore = res.data.score
        console.log(res.data.score)
        const max = Math.max(storedScore, score)
        if (max !== storedScore) {
          const { data, error } = await supabase
            .from('game')
            .update({
              score: score,
            })
            .eq('id', id)
            .select("*")
            return NextResponse.json({ success: true, message: "update" }, { status: 200 });
        }

      }
    }

    // Insert score into Supabase
    const { data, error } = await supabase
      .from('game')
      .insert({
        score: score,
      }).select("*")

    if (error) {
      console.error("Error inserting data:", error.message);
      throw error;
    }
    let id = data[0]?.id


    const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
    const token = jwt.sign({ id: id }, SECRET_KEY, {
      expiresIn: '365 days',
    });

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 10); // Correctly setting the expiration year

    const response = NextResponse.json({ success: true, message: "score added" }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      expires,
    });


    return response;

  } catch (error: any) {
    console.error("An error occurred:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
