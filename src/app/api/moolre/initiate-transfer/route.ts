import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestAuthContext } from "@/lib/auth/request-user";

type InitiateTransferBody = {
  receiver?: string;
  channel?: string | number;
  sublistid?: string | number;
  currency?: string;
  amount?: number | string;
  reason?: string;
};

type MoolreTransferResponse = {
  status?: number;
  code?: string;
  message?: string;
  data?: unknown;
  go?: unknown;
};

export async function POST(request: Request) {
  const { userId, role } = getRequestAuthContext(await cookies(), await headers());
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (role === "viewer") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const body = (await request.json().catch(() => null)) as InitiateTransferBody | null;
  const receiver = body?.receiver?.toString().trim() ?? "";
  const channel = body?.channel?.toString().trim() ?? "";
  const sublistid = body?.sublistid?.toString().trim() ?? "";
  const currency = body?.currency?.toString().trim().toUpperCase() || "GHS";
  const reason = body?.reason?.toString().trim() ?? "Agency transfer";
  const amount = Number(body?.amount ?? 0);

  if (!receiver || !channel || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Receiver, channel, and a valid amount are required." },
      { status: 400 },
    );
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

  // Some Moolre accounts/environments can expose different transfer paths.
  const transferEndpoint =
    process.env.MOOLRE_TRANSFER_ENDPOINT?.trim() ||
    "https://api.moolre.com/open/transact/initiate";

  const payload = {
    receiver,
    channel,
    sublistid: sublistid || undefined,
    currency,
    amount,
    reason,
    accountnumber: accountNumber,
  };

  const response = await fetch(transferEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-USER": apiUser,
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as MoolreTransferResponse | null;
  const ok = response.ok && result?.status === 1;
  if (!ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          result?.message ||
          "Unable to initiate transfer. Check MOOLRE_TRANSFER_ENDPOINT and payload fields.",
        code: result?.code ?? null,
        raw: result ?? null,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: result?.message || "Transfer initiated successfully.",
      code: result?.code ?? null,
      data: result?.data ?? null,
      go: result?.go ?? null,
    },
    { status: 200 },
  );
}
