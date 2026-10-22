import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" ALTER COLUMN "region" DROP NOT NULL;
  ALTER TABLE "leads" ADD COLUMN "province_name" varchar;
  ALTER TABLE "leads" ADD COLUMN "ward_name" varchar;
  ALTER TABLE "leads" ADD COLUMN "address_line" varchar;
  ALTER TABLE "leads" ADD COLUMN "province_code" varchar;
  ALTER TABLE "leads" ADD COLUMN "ward_code" varchar;
  CREATE INDEX "leads_province_name_idx" ON "leads" USING btree ("province_name");`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  throw new Error('This migration preserves customer addresses. Restore a verified backup to roll back; new registrations have no legacy pricing region.')
}
