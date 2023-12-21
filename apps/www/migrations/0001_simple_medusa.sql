DO $$ BEGIN
 CREATE TYPE "components" AS ENUM('components:ui', 'components:component', 'components:example', 'components:addons');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "components" "components" DEFAULT 'components:addons';