import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";

type ValidateNameBody = {
  receiver?: string;
  channel?: string | number;
  sublistid?: string | number;
  currency?: string;
};

type MoolreResponse = {
  status?: number;
  code?: string;
  message?: string;
  data?: string;
};

export async function POST(request: Request) {
  const { userId, role } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (role === "viewer") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as ValidateNameBody | null;
  const receiver = body?.receiver?.toString().trim() ?? "";
  const channel = body?.channel?.toString().trim() ?? "";
  const sublistid = body?.sublistid?.toString().trim() ?? "";
  const currency = body?.currency?.toString().trim().toUpperCase() || "GHS";

  if (!receiver || !channel) {
    return NextResponse.json({ error: "Receiver and channel are required." }, { status: 400 });
  }

  const apiUser = process.env.MOOLRE_API_USER?.trim();
  const apiKey = process.env.MOOLRE_API_KEY?.trim();
  const accountNumber = process.env.MOOLRE_ACCOUNT_NUMBER?.trim();
  if (!apiUser || !apiKey || !accountNumber) {
    return NextResponse.json(
      {
        error:
          "Moolre is not configured. Set MOOLRE_API_USER, MOOLRE_API_KEY, and MOOLRE_ACCOUNT_NUMBER.",
      },
      { status: 500 },
    );
  }

  const payload = {
    type: 1,
    receiver,
    channel,
    sublistid: sublistid || undefined,
    currency,
    accountnumber: accountNumber,
  };

  const response = await fetch("https://api.moolre.com/open/transact/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-USER": apiUser,
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as MoolreResponse | null;
  const resolvedName = (result?.data ?? "").toString().trim();
  const ok = response.ok && result?.status === 1 && Boolean(resolvedName);

  if (!ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result?.message || "Unable to validate recipient name.",
        code: result?.code ?? null,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      name: resolvedName,
      code: result?.code ?? null,
      message: result?.message || "Successful",
    },
    { status: 200 },
  );
}
