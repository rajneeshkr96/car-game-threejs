import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from "next/headers";

const supabaseUrl = 'https://eieoyqffboqdrvgcsmyf.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || "";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest, { params }: { params: { score: number } }) {
  try {
    // Verify database connection
    const { error: connectionError } = await supabase.from('scores').select('*').limit(1);
    if (connectionError) {
      console.error("Error connecting to Supabase:", connectionError.message);
      return NextResponse.json({ success: false, message: "Database connection failed" }, { status: 500 });
    }

    // Retrieve the score from params
    const { score } = params;
    const cookieStore = cookies();
    const userToken = cookieStore.get('token')?.value || "";
    if(!userToken) {
    //   todo 
    // increment score 
    }



    const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";
    const token = jwt.sign({ id: 'hh' }, SECRET_KEY, {
      expiresIn: '2 days',
    });

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 10); // Correctly setting the expiration year

    const response = NextResponse.json({ success: true, message: "s" }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      expires,
    });

    // Insert score into Supabase
    const { data, error } = await supabase
      .from('scores') // Replace 'scores' with your actual table name
      .insert([{ score, created_at: new Date().toISOString() }]);

    if (error) {
      console.error("Error inserting data:", error.message);
      throw error;
    }

    return response;

  } catch (error: any) {
    console.error("An error occurred:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
