import pg from "pg";
const { Pool } = pg;

export default async function handler(req, res) {
  try {
    const pool = new Pool({
      connectionString: process.env.SUPABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await pool.query("select 1");
    res.json({ db: "ok" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e.message || e) });
  }
}
