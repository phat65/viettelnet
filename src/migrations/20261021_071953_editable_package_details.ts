import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "packages" SET "catalog_group" = CASE WHEN "category" = 'tv360' THEN 'entertainment'::"enum_packages_catalog_group" WHEN "category" = 'camera' THEN 'camera'::"enum_packages_catalog_group" ELSE 'individual'::"enum_packages_catalog_group" END WHERE "catalog_group" IS NULL;
  ALTER TABLE "packages" ALTER COLUMN "catalog_group" SET DEFAULT 'individual';
  ALTER TABLE "packages" ALTER COLUMN "catalog_group" SET NOT NULL;
  ALTER TABLE "packages" ALTER COLUMN "category" SET DEFAULT 'internet';
  ALTER TABLE "packages_prices" ADD COLUMN "activation_fee" numeric;
  ALTER TABLE "packages" ADD COLUMN "detail_content" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "packages" ALTER COLUMN "catalog_group" DROP DEFAULT;
  ALTER TABLE "packages" ALTER COLUMN "catalog_group" DROP NOT NULL;
  ALTER TABLE "packages" ALTER COLUMN "category" DROP DEFAULT;
  ALTER TABLE "packages_prices" DROP COLUMN "activation_fee";
  ALTER TABLE "packages" DROP COLUMN "detail_content";`)
}
