// app/api/gallery/route.ts
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { GALLERY_QUERY } from "@/sanity/queries/gallery";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const start = Number(searchParams.get("start") ?? 0);
  const limit = Number(searchParams.get("limit") ?? 20);
  const category = searchParams.get("category");

  const data = await client.fetch(GALLERY_QUERY, {
    start,
    end: start + limit,
    category: category || null, // 🔑 IMPORTANT
  });

  return NextResponse.json({
    items: data,
    hasMore: data.length === limit,
  });
}
