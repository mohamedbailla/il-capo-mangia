import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations } from "@/db/schemas/reservations";
import { desc, like, or } from "drizzle-orm";
import { z } from "zod";

const reservationSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  telefono: z.string()
    .regex(/^\+?[\d\s\-().]{7,15}$/, "Teléfono no válido")
    .refine((v) => { const d = v.replace(/\D/g, ""); return d.length >= 7 && d.length <= 15; }, "Teléfono no válido"),
  email: z.string().email("Email no válido").optional().or(z.literal("")),
  personas: z.number().int().min(1).max(20),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  hora: z.string().min(1, "La hora es obligatoria"),
  notas: z.string().optional(),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    let results;
    if (search) {
      results = await db
        .select()
        .from(reservations)
        .where(
          or(
            like(reservations.nombre, `%${search}%`),
            like(reservations.email, `%${search}%`),
            like(reservations.telefono, `%${search}%`),
          ),
        )
        .orderBy(desc(reservations.createdAt));
    } else {
      results = await db
        .select()
        .from(reservations)
        .orderBy(desc(reservations.createdAt));
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener reservas" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const [newReservation] = await db
      .insert(reservations)
      .values({
        nombre: parsed.data.nombre,
        telefono: parsed.data.telefono,
        email: parsed.data.email || null,
        personas: parsed.data.personas,
        fecha: parsed.data.fecha,
        hora: parsed.data.hora,
        notas: parsed.data.notas || null,
        status: parsed.data.status ?? "pending",
      })
      .returning();

    return NextResponse.json({ success: true, data: newReservation }, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear la reserva" },
      { status: 500 },
    );
  }
}
