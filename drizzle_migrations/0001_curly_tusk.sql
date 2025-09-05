CREATE TABLE "stats" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"steps" integer DEFAULT 0 NOT NULL,
	"spo2" integer DEFAULT 0 NOT NULL,
	"stress" integer DEFAULT 0 NOT NULL,
	"water_intake" integer DEFAULT 0 NOT NULL,
	"calories" integer DEFAULT 0 NOT NULL,
	"inactivity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
