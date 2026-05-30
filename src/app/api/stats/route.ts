import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db/pool";

export const revalidate = 3600;

export async function GET() {
  try {
    const [clients, filed] = await Promise.all([
      queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM clients"),
      queryOne<{ count: string }>("SELECT COUNT(*)::text AS count FROM cases WHERE status = 'filed'"),
    ]);
    return NextResponse.json({
      clients: parseInt(clients?.count ?? "0"),
      casesFiled: parseInt(filed?.count ?? "0"),
      jurisdictions: 5,
      yearsExperience: 1,
    });
  } catch {
    return NextResponse.json({ clients: 0, casesFiled: 0, jurisdictions: 4, yearsExperience: 15 });
  }
}
