import jwt from "jsonwebtoken";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.SUPABASE_URL });
const SECRET = process.env.SESSION_SECRET || "change-me";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const { idToken, email, sub } = req.body || {};
    if (!sub || !email) return res.status(400).json({ error: "Missing Google sub/email" });

    const existing = await pool.query("select * from users where google_sub=$1", [sub]);
    let user = existing.rows[0];
    if (!user) {
      const ins = await pool.query(
        "insert into users (google_sub, email) values ($1,$2) returning *",
        [sub, email]
      );
      user = ins.rows[0];
    }

    const sessionToken = jwt.sign({ uid: user.id, sub, email }, SECRET, { expiresIn: "30d" });
    res.json({
      sessionToken,
      email: user.email,
      planName: user.plan_name,
      isActive: user.is_active,
      quotaRemaining: user.quota_remaining
    });
  } catch (e) {
    res.status(500).json({ error: "auth failed" });
  }
}
