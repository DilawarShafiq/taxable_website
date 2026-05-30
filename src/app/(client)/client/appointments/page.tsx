import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { query, queryOne } from "@/lib/db/pool";
import { CalendarDays, Clock } from "lucide-react";
import { APPOINTMENT_STATUS_COLORS } from "@/lib/constants";

const TYPE_LABELS: Record<string, string> = {
  consultation: "Consultation",
  review: "Review",
  follow_up: "Follow-up",
};

export default async function ClientAppointmentsPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  let appointments: { id: string; starts_at: string; duration_minutes: number; type: string | null; status: string; notes: string | null }[] = [];
  try {
    const clientRow = await queryOne<{ id: string }>("SELECT id FROM clients WHERE profile_id = $1", [session.uid]);
    if (clientRow) {
      appointments = await query(
        "SELECT id, starts_at, duration_minutes, type, status, notes FROM appointments WHERE client_id = $1 ORDER BY starts_at DESC LIMIT 20",
        [clientRow.id]
      );
    }
  } catch { /* no appointments yet */ }

  const upcoming = appointments.filter((a) => a.status === "scheduled" && new Date(a.starts_at) >= new Date());
  const past = appointments.filter((a) => a.status !== "scheduled" || new Date(a.starts_at) < new Date());

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Your scheduled consultations</p>
        </div>
        <div className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-lg px-3 py-2">
          Contact your accountant via messages to book
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-xl p-12 text-center">
          <CalendarDays className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500 mb-1">No appointments scheduled</p>
          <p className="text-xs text-gray-400">Your accountant will schedule consultations here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map((apt) => <AppointmentCard key={apt.id} apt={apt} />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Past</h2>
              <div className="space-y-3">
                {past.map((apt) => <AppointmentCard key={apt.id} apt={apt} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ apt }: { apt: { id: string; starts_at: string; duration_minutes: number; type: string | null; status: string; notes: string | null } }) {
  const start = new Date(apt.starts_at);
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-4">
      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
        <CalendarDays className="h-4 w-4 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-gray-900">
            {start.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${APPOINTMENT_STATUS_COLORS[apt.status] ?? "bg-gray-100 text-gray-500"}`}>
            {apt.status}
          </span>
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          {" · "}
          {apt.duration_minutes} min
          {apt.type && ` · ${TYPE_LABELS[apt.type] ?? apt.type}`}
        </p>
        {apt.notes && <p className="text-xs text-gray-400 mt-1.5 italic">{apt.notes}</p>}
      </div>
    </div>
  );
}
