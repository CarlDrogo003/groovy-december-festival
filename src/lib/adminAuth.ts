// src/lib/adminAuth.ts
import { supabaseAdmin } from "./supabaseAdminServer";

/**
 * verifyAdminToken
 * - token: Supabase access token from client
 * - returns { ok: true, user } if admin, otherwise { ok: false, reason }
 */
export async function verifyAdminToken(token: string | null) {
  if (!token) return { ok: false, reason: "no_token" };

  // verify token -> get user
  const {
    data: { user },
    error: userErr,
  } = await supabaseAdmin.auth.getUser(token);

  if (userErr || !user) return { ok: false, reason: "invalid_token" };

  // check admins table for user_id or email
  const { data: adminRow, error: qErr } = await supabaseAdmin
    .from("admins")
    .select("id, role")
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .limit(1)
    .maybeSingle();

  if (qErr) return { ok: false, reason: "db_error", error: qErr };
  if (!adminRow) return { ok: false, reason: "not_admin" };

  return { ok: true, user, adminRow };
}
