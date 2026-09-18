import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Return acknowledged beacon
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      event: body.type || 'pageview',
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
