CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"telefono" varchar(20) NOT NULL,
	"email" varchar(150) NOT NULL,
	"personas" integer NOT NULL,
	"fecha" varchar(20) NOT NULL,
	"hora" varchar(10) NOT NULL,
	"notas" text,
	"status" "reservation_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
