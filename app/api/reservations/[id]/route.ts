import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reservations } from "@/db/schemas/reservations";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Estado no válido" },
        { status: 400 },
      );
    }

    const [updated] = await db
      .update(reservations)
      .set({ status, updatedAt: new Date() })
      .where(eq(reservations.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Reserva no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la reserva" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [deleted] = await db
      .delete(reservations)
      .where(eq(reservations.id, parseInt(id)))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Reserva no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Reserva eliminada" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar la reserva" },
      { status: 500 },
    );
  }
}
