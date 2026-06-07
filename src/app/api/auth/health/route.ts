import { NextResponse } from "next/server";
import { checkAuthHealth } from "@/lib/auth/health";

export async function GET() {
  const health = await checkAuthHealth();
  return NextResponse.json(health, { status: 200 });
}
