import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const EVENTS_FILE = path.join(process.cwd(), "public", "data", "analytics-events.json");

interface AnalyticsEventItem {
  id: string;
  timestamp: string;
  type: string;
  path: string;
  userAgent?: string;
  referer?: string;
}

function readEvents(): AnalyticsEventItem[] {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      const raw = fs.readFileSync(EVENTS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveEvents(events: AnalyticsEventItem[]) {
  try {
    const dir = path.dirname(EVENTS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events.slice(0, 1000), null, 2), "utf8");
  } catch {}
}

export async function GET() {
  const events = readEvents();
  return NextResponse.json({
    success: true,
    totalEvents: events.length,
    recentEvents: events.slice(0, 50),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.type || "pageview";
    const eventPath = body.path || "/";
    const events = readEvents();
    events.unshift({
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      type: eventType,
      path: eventPath,
      userAgent: req.headers.get("user-agent") || undefined,
      referer: req.headers.get("referer") || undefined,
    });
    saveEvents(events);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      event: eventType,
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
