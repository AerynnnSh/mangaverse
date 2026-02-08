import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("mal_code_verifier")?.value;

  if (!code || !codeVerifier) {
    return NextResponse.json(
      { error: "Missing code or verifier" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch("https://myanimelist.net/v1/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.MAL_CLIENT_ID!,
        client_secret: process.env.MAL_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code: code,
        code_verifier: codeVerifier,
        redirect_uri: process.env.NEXT_PUBLIC_MAL_REDIRECT_URI!,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("MAL Token Error:", data);
      return NextResponse.json(data, { status: 400 });
    }

    // Redirect ke Beranda (/) bukan /library
    const res = NextResponse.redirect(new URL("/", request.url));

    // Simpan token ke cookie
    res.cookies.set("mal_access_token", data.access_token, {
      httpOnly: false, // Set false agar bisa dibaca oleh js-cookie di Client Side
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 },
    );
  }
}
