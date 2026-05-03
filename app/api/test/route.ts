import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });

    await db.execute("INSERT INTO test (name) VALUES (?)", ["navami"]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "DB failed" }, { status: 500 });
  }
}
