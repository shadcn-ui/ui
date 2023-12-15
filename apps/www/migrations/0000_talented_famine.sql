DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('USER', 'OWNER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shadcn_marketplace_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"refresh_token_expires_in" integer,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT shadcn_marketplace_account_provider_providerAccountId_pk PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shadcn_marketplace_packages" (
	"name" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"author" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"version" text,
	"downloads" integer DEFAULT 0,
	"dependencies" text[],
	"registryDependencies" text[],
	"files" json[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shadcn_marketplace_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shadcn_marketplace_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"role" "role" DEFAULT 'USER'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shadcn_marketplace_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT shadcn_marketplace_verificationToken_identifier_token_pk PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shadcn_marketplace_account" ADD CONSTRAINT "shadcn_marketplace_account_userId_shadcn_marketplace_user_id_fk" FOREIGN KEY ("userId") REFERENCES "shadcn_marketplace_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shadcn_marketplace_session" ADD CONSTRAINT "shadcn_marketplace_session_userId_shadcn_marketplace_user_id_fk" FOREIGN KEY ("userId") REFERENCES "shadcn_marketplace_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
