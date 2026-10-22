# Chạy website và PostgreSQL bằng Docker

## Thành phần

| Service | Chức năng |
| --- | --- |
| `postgres` | PostgreSQL 17; dữ liệu trong volume `viettel-sale-web_postgres_data` |
| `migrate` | CLI Payload áp dụng migration mới rồi thoát với mã 0 |
| `app` | Next.js standalone, gồm website và admin; ảnh trong `viettel-sale-web_media_data` |

`postgres` phải healthy trước khi chạy migration; `app` chỉ khởi động khi migration thành công. App healthcheck gọi `/api/health` để kiểm tra cả database và bảng tài khoản. Response không chứa dữ liệu người dùng.

Image app chạy dưới user `node`, không chạy root. File `.env`, thư mục `media`, `node_modules` và build trên Windows không được đưa vào Docker build context. Dependencies được cài trong Linux theo lockfile.

## Chạy lần đầu

1. Khởi động Docker Desktop ở chế độ Linux containers.
2. Tại thư mục dự án:

```powershell
node scripts/setup-docker.mjs
# Điền BOOTSTRAP_ADMIN_EMAIL / BOOTSTRAP_ADMIN_PASSWORD trong .env trước khi chạy lần đầu.
docker compose up -d --build --wait
```

Migration sẽ tạo quản trị viên đầu tiên từ `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` khi bảng users còn trống. Mật khẩu cần 16–128 ký tự, không dùng giá trị mẫu. Nếu thiếu hoặc không hợp lệ, migration thất bại và Compose không khởi động app mới. Nếu đã có bất kỳ admin nào, tài khoản và mật khẩu hiện có được giữ nguyên, không cần biến bootstrap.

Mở http://localhost:3000/admin để đăng nhập. Không có email/mật khẩu hardcode trong code. Xem [cấu hình bootstrap admin](bootstrap-admin.md). Chỉ container `migrate` nhận mật khẩu bootstrap; container `app` không nhận biến này.

## Biến môi trường

| Biến | Ý nghĩa |
| --- | --- |
| `POSTGRES_USER` | User database, mặc định `viettel` |
| `POSTGRES_DB` | Database, mặc định `viettel_sale_web` |
| `POSTGRES_PASSWORD` | Mật khẩu sinh ngẫu nhiên; dùng ký tự chữ/số/`_`/`-` để an toàn trong connection URI |
| `POSTGRES_PORT` | Cổng PostgreSQL trên máy, mặc định 5432 |
| `APP_PORT` | Cổng website trên máy, mặc định 3000 |
| `NEXT_PUBLIC_SERVER_URL` | URL người dùng truy cập, mặc định `http://localhost:3000` |
| `PAYLOAD_SECRET` | Secret ký phiên đăng nhập; giữ ổn định qua các lần chạy |
| `DATABASE_URL` | URL cho lệnh pnpm chạy trực tiếp trên máy; Compose tự dùng hostname `postgres` trong container |
| `PAYLOAD_DB_PUSH` | Đặt `false` để quản lý schema bằng migration |
| `BOOTSTRAP_ADMIN_EMAIL` | Email quản trị viên đầu tiên; bắt buộc khi database chưa có tài khoản |
| `BOOTSTRAP_ADMIN_PASSWORD` | Mật khẩu riêng 16–128 ký tự; không được ghi vào Git hoặc image |
| `BOOTSTRAP_ADMIN_NAME` | Tên hiển thị, không bắt buộc; mặc định `Quản trị viên` |

Chạy lại script setup giữ nguyên mật khẩu và secret đang có. Script chỉ thay `DATABASE_URL` còn ở giá trị mẫu của scaffold hoặc chưa có; không ghi đè URL tùy chỉnh.

Cấu hình local trên máy hiện tại dùng `POSTGRES_PORT=5433` vì cổng 5432 đã bị chiếm. Trong mạng Docker, app vẫn kết nối `postgres:5432`.

Khi đổi cổng app, cập nhật cả `APP_PORT` và `NEXT_PUBLIC_SERVER_URL`, rồi build lại. Khi đổi cổng PostgreSQL, sửa cả `POSTGRES_PORT` và cổng trong `DATABASE_URL` local.

`POSTGRES_*` dùng để khởi tạo database lần đầu. Khi volume đã có dữ liệu, sửa mật khẩu trong `.env` không tự đổi mật khẩu tài khoản PostgreSQL; cần đổi bằng SQL rồi đồng bộ cấu hình.

## Dừng, chạy lại và cập nhật

```powershell
# Trạng thái (migrate Exited 0 là bình thường)
docker compose ps -a

# Log
docker compose logs --tail 100 app migrate postgres

# Dừng container, giữ volume
docker compose down

# Chạy lại
docker compose up -d --wait

# Sau khi sửa code
docker compose up -d --build --wait
```

Sau khi sửa schema:

```powershell
pnpm db:migration:create ten-thay-doi
# Đọc migration trước khi áp dụng.
docker compose up -d --build --wait
```

`migrate` chạy các migration chưa được ghi nhận trong bảng `payload_migrations`. Không dùng schema push và migration đồng thời trên cùng database.

## Sao lưu PostgreSQL

Ví dụ tạo file backup vào thư mục `backups` (đã được bỏ qua bởi Git và Docker build):

```powershell
New-Item -ItemType Directory -Force backups
docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -f /tmp/viettel-backup.dump'
docker compose cp postgres:/tmp/viettel-backup.dump ./backups/viettel-backup.dump
docker compose exec -T postgres rm /tmp/viettel-backup.dump
```

Sao lưu volume ảnh riêng nếu đã tải ảnh vào admin. Dừng hoặc build lại container giữ dữ liệu; xóa volume sẽ xóa dữ liệu. Không chạy `docker compose down -v` cho môi trường cần giữ.

## Giới hạn hiện tại

Cấu hình phục vụ local, cổng chỉ bind `127.0.0.1`. Chưa gồm tên miền, HTTPS, dịch vụ email và backup tự động. Khi triển khai lên máy chủ, cấu hình reverse proxy và sao lưu tương ứng.

Tham khảo: [Docker Compose startup order](https://docs.docker.com/compose/how-tos/startup-order/), [Next.js standalone](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [Payload migrations](https://payloadcms.com/docs/database/migrations).
