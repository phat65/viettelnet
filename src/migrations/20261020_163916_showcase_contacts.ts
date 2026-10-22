import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_packages_catalog_group" AS ENUM('offers', 'individual', 'entertainment', 'camera', 'mesh', 'ultra');
  ALTER TYPE "public"."enum_packages_prices_region" ADD VALUE 'reference' BEFORE 'metro';
  CREATE TABLE "site_settings_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"zalo_enabled" boolean DEFAULT true,
  	"zalo_url" varchar,
  	"enabled" boolean DEFAULT true
  );
  
  ALTER TABLE "packages_prices" ALTER COLUMN "installation_fee" DROP NOT NULL;
  ALTER TABLE "packages_prices" ALTER COLUMN "commitment_months" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Internet Viettel';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_title" DROP DEFAULT;
  ALTER TABLE "site_settings" ALTER COLUMN "hero_description" DROP DEFAULT;
  ALTER TABLE "packages" ADD COLUMN "catalog_group" "enum_packages_catalog_group";
  ALTER TABLE "site_settings_contacts" ADD CONSTRAINT "site_settings_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_contacts_order_idx" ON "site_settings_contacts" USING btree ("_order");
  CREATE INDEX "site_settings_contacts_parent_id_idx" ON "site_settings_contacts" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_contacts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_contacts" CASCADE;
  ALTER TABLE "packages_prices" ALTER COLUMN "region" SET DATA TYPE text;
  DROP TYPE "public"."enum_packages_prices_region";
  CREATE TYPE "public"."enum_packages_prices_region" AS ENUM('metro', 'other');
  ALTER TABLE "packages_prices" ALTER COLUMN "region" SET DATA TYPE "public"."enum_packages_prices_region" USING "region"::"public"."enum_packages_prices_region";
  ALTER TABLE "packages_prices" ALTER COLUMN "installation_fee" SET NOT NULL;
  ALTER TABLE "packages_prices" ALTER COLUMN "commitment_months" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "site_name" SET DEFAULT 'Internet cho mọi nhà';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_title" SET DEFAULT 'Kết nối trọn vẹn, từ chính ngôi nhà bạn.';
  ALTER TABLE "site_settings" ALTER COLUMN "hero_description" SET DEFAULT 'Tìm gói Internet phù hợp cho gia đình, công việc và giải trí.';
  ALTER TABLE "packages" DROP COLUMN "catalog_group";
  DROP TYPE "public"."enum_packages_catalog_group";`)
}
