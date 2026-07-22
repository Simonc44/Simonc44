import { NextResponse } from "next/server";
import { getGithubData } from "@/lib/github";

export async function GET() {
  try {
    const data = await getGithubData();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch GitHub data", detail: message },
      { status: 502 }
    );
  }
}
