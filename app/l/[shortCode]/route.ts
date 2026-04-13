import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(link.url);
}
