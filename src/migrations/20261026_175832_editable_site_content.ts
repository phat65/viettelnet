import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "catalog_content_internet_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "catalog_content_offers_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "catalog_content_individual_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "catalog_content_entertainment_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "catalog_content_camera_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "catalog_content_mesh_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "catalog_content_ultra_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "catalog_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"internet_heading" varchar DEFAULT 'Internet Viettel: chọn gói phù hợp với bạn',
  	"internet_intro" varchar DEFAULT 'Từ kết nối hằng ngày đến truyền hình, camera và WiFi cho nhà nhiều tầng. Chọn nhóm dịch vụ để so sánh gói, xem thiết bị và mức giá phù hợp.',
  	"internet_advice" jsonb,
  	"internet_seo_title" varchar,
  	"internet_seo_description" varchar,
  	"offers_heading" varchar DEFAULT 'Gói Internet Viettel kết hợp TV360 và Camera',
  	"offers_intro" varchar DEFAULT 'Xem các gói kết hợp Internet, truyền hình và camera, cùng thiết bị đi kèm. So sánh mức giá theo khu vực; ưu đãi, phí và điều kiện áp dụng được xác nhận tại thời điểm đăng ký.',
  	"offers_advice" jsonb,
  	"offers_seo_title" varchar,
  	"offers_seo_description" varchar,
  	"individual_heading" varchar DEFAULT 'Gói Internet Viettel cho cá nhân và gia đình',
  	"individual_intro" varchar DEFAULT 'So sánh tốc độ và thiết bị đi kèm theo số người, số thiết bị thường dùng. Nếu nhà có nhiều phòng hoặc vật cản, cân nhắc gói có Mesh để mở rộng vùng phủ WiFi.',
  	"individual_advice" jsonb,
  	"individual_seo_title" varchar,
  	"individual_seo_description" varchar,
  	"entertainment_heading" varchar DEFAULT 'Gói Internet Viettel kèm truyền hình TV360',
  	"entertainment_intro" varchar DEFAULT 'Các gói dưới đây kết hợp Internet và truyền hình TV360. Kiểm tra tốc độ, thiết bị và nội dung dịch vụ đi kèm trên trang từng gói; quyền xem và ưu đãi được xác nhận khi đăng ký.',
  	"entertainment_advice" jsonb,
  	"entertainment_seo_title" varchar,
  	"entertainment_seo_description" varchar,
  	"camera_heading" varchar DEFAULT 'Gói Internet Viettel kèm Camera',
  	"camera_intro" varchar DEFAULT 'So sánh các gói Internet có camera, tốc độ kết nối và thiết bị Mesh đi kèm. Vị trí lắp camera, nhu cầu lưu trữ và điều kiện sử dụng sẽ được tư vấn theo địa chỉ thực tế.',
  	"camera_advice" jsonb,
  	"camera_seo_title" varchar,
  	"camera_seo_description" varchar,
  	"mesh_heading" varchar DEFAULT 'Gói Mesh WiFi Viettel cho nhà nhiều tầng',
  	"mesh_intro" varchar DEFAULT 'Số tầng, diện tích và vật cản ảnh hưởng đến cách bố trí Mesh. Xem số thiết bị trong từng gói, sau đó đăng ký tư vấn để lựa chọn vị trí đặt phù hợp với ngôi nhà.',
  	"mesh_advice" jsonb,
  	"mesh_seo_title" varchar,
  	"mesh_seo_description" varchar,
  	"ultra_heading" varchar DEFAULT 'Gói Internet Viettel Ultra Speed đến 1 Gbps',
  	"ultra_intro" varchar DEFAULT 'Các gói Ultra Speed dành cho nhu cầu truyền tải dữ liệu lớn, làm việc và giải trí tốc độ cao. Khả năng lắp đặt cần được kiểm tra theo hạ tầng tại địa chỉ của bạn; tốc độ thực tế còn phụ thuộc thiết bị và kết nối.',
  	"ultra_advice" jsonb,
  	"ultra_seo_title" varchar,
  	"ultra_seo_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "organization_name" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "organization_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "organization_address" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "organization_email" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "organization_working_hours" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "about_content" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "about_seo_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "about_seo_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_content" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "contact_seo_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_seo_description" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "privacy_content" jsonb;
  ALTER TABLE "site_settings" ADD COLUMN "privacy_seo_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "privacy_seo_description" varchar;
  ALTER TABLE "catalog_content_internet_faq" ADD CONSTRAINT "catalog_content_internet_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalog_content_offers_faq" ADD CONSTRAINT "catalog_content_offers_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalog_content_individual_faq" ADD CONSTRAINT "catalog_content_individual_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalog_content_entertainment_faq" ADD CONSTRAINT "catalog_content_entertainment_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalog_content_camera_faq" ADD CONSTRAINT "catalog_content_camera_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalog_content_mesh_faq" ADD CONSTRAINT "catalog_content_mesh_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalog_content_ultra_faq" ADD CONSTRAINT "catalog_content_ultra_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalog_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "catalog_content_internet_faq_order_idx" ON "catalog_content_internet_faq" USING btree ("_order");
  CREATE INDEX "catalog_content_internet_faq_parent_id_idx" ON "catalog_content_internet_faq" USING btree ("_parent_id");
  CREATE INDEX "catalog_content_offers_faq_order_idx" ON "catalog_content_offers_faq" USING btree ("_order");
  CREATE INDEX "catalog_content_offers_faq_parent_id_idx" ON "catalog_content_offers_faq" USING btree ("_parent_id");
  CREATE INDEX "catalog_content_individual_faq_order_idx" ON "catalog_content_individual_faq" USING btree ("_order");
  CREATE INDEX "catalog_content_individual_faq_parent_id_idx" ON "catalog_content_individual_faq" USING btree ("_parent_id");
  CREATE INDEX "catalog_content_entertainment_faq_order_idx" ON "catalog_content_entertainment_faq" USING btree ("_order");
  CREATE INDEX "catalog_content_entertainment_faq_parent_id_idx" ON "catalog_content_entertainment_faq" USING btree ("_parent_id");
  CREATE INDEX "catalog_content_camera_faq_order_idx" ON "catalog_content_camera_faq" USING btree ("_order");
  CREATE INDEX "catalog_content_camera_faq_parent_id_idx" ON "catalog_content_camera_faq" USING btree ("_parent_id");
  CREATE INDEX "catalog_content_mesh_faq_order_idx" ON "catalog_content_mesh_faq" USING btree ("_order");
  CREATE INDEX "catalog_content_mesh_faq_parent_id_idx" ON "catalog_content_mesh_faq" USING btree ("_parent_id");
  CREATE INDEX "catalog_content_ultra_faq_order_idx" ON "catalog_content_ultra_faq" USING btree ("_order");
  CREATE INDEX "catalog_content_ultra_faq_parent_id_idx" ON "catalog_content_ultra_faq" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "catalog_content_internet_faq" CASCADE;
  DROP TABLE "catalog_content_offers_faq" CASCADE;
  DROP TABLE "catalog_content_individual_faq" CASCADE;
  DROP TABLE "catalog_content_entertainment_faq" CASCADE;
  DROP TABLE "catalog_content_camera_faq" CASCADE;
  DROP TABLE "catalog_content_mesh_faq" CASCADE;
  DROP TABLE "catalog_content_ultra_faq" CASCADE;
  DROP TABLE "catalog_content" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "organization_name";
  ALTER TABLE "site_settings" DROP COLUMN "organization_description";
  ALTER TABLE "site_settings" DROP COLUMN "organization_address";
  ALTER TABLE "site_settings" DROP COLUMN "organization_email";
  ALTER TABLE "site_settings" DROP COLUMN "organization_working_hours";
  ALTER TABLE "site_settings" DROP COLUMN "about_content";
  ALTER TABLE "site_settings" DROP COLUMN "about_seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "about_seo_description";
  ALTER TABLE "site_settings" DROP COLUMN "contact_content";
  ALTER TABLE "site_settings" DROP COLUMN "contact_seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "contact_seo_description";
  ALTER TABLE "site_settings" DROP COLUMN "privacy_content";
  ALTER TABLE "site_settings" DROP COLUMN "privacy_seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "privacy_seo_description";`)
}
