import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { query, queryOne } from "@/lib/db/pool";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const uid = session.user.uid ?? session.user.id;
  if (!uid) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  try {
    const { companyName, businessType, jurisdictions, phone } = await req.json();

    if (!businessType || !jurisdictions?.length) {
      return NextResponse.json({ error: "Business type and at least one jurisdiction are required" }, { status: 400 });
    }

    // Update phone on profile if provided
    if (phone) {
      await query("UPDATE profiles SET phone = $1 WHERE id = $2", [phone, uid]);
    }

    // Upsert clients record — create on first onboard, update on re-onboard
    const existing = await queryOne<{ id: string }>("SELECT id FROM clients WHERE profile_id = $1", [uid]);

    if (existing) {
      await query(
        `UPDATE clients SET
           company_name = $1, business_type = $2, jurisdictions = $3,
           status = 'active', onboarded_at = NOW(), updated_at = NOW()
         WHERE profile_id = $4`,
        [companyName || null, businessType, jurisdictions, uid]
      );
    } else {
      await query(
        `INSERT INTO clients (profile_id, company_name, business_type, jurisdictions, status, onboarded_at)
         VALUES ($1, $2, $3, $4, 'active', NOW())`,
        [uid, companyName || null, businessType, jurisdictions]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[onboard]", err);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
