# Rà soát trước triển khai — 22/10/2026

Ứng dụng có thể đưa lên môi trường staging bằng Docker. Chưa coi là sẵn sàng mở public chỉ dựa trên việc chạy được ở localhost: tên miền, HTTPS, giới hạn request, sao lưu và khôi phục phải được xác nhận trên máy chủ đích.

## Đã xử lý trong lần rà soát này

- Nâng `sharp` từ 0.34.5 lên 0.35.5 để vá các cảnh báo xử lý ảnh; Next.js đã dùng 0.35.5, phần cần nâng là bản dùng trực tiếp bởi Payload.
- Cho nhánh `@payloadcms/next` dùng cùng Sass với dự án để bỏ nhánh `chokidar → braces` cũ. Nâng DOMPurify của Monaco lên 3.4.16. Các override nằm trong `package.json` và được khóa bằng `pnpm-lock.yaml`; cần xem lại khi nâng Payload.
- Thêm `nosniff`, chống nhúng trang ngoài origin, chính sách referrer và tắt quyền camera/microphone/geolocation không sử dụng.
- Cookie đăng nhập có cờ Secure khi URL public là HTTPS; localhost HTTP vẫn dùng được.
- Giới hạn upload 5 MB/ảnh, chỉ quản trị viên được upload JPG/PNG/WebP/AVIF.
- Ghi tín hiệu lỗi lưu đăng ký vào log mà không ghi số điện thoại, địa chỉ hoặc nội dung form.

## Bảo mật thư viện còn lại

`pnpm audit --prod` sau cập nhật: **0 critical, 0 high, 1 moderate, 0 low**. Đây là kết quả tại thời điểm rà soát, không phải bảo đảm không có lỗ hổng.

Cảnh báo còn lại: [esbuild GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99), qua `@payloadcms/db-postgres → drizzle-kit → @esbuild-kit/esm-loader → @esbuild-kit/core-utils`. Cảnh báo liên quan development server của esbuild. Container app chạy `node server.js`, container migration chạy CLI rồi thoát; dự án không khởi chạy esbuild serve. Không mở development server hoặc công cụ migration ra Internet. Theo dõi bản nâng của upstream; không ép thay esbuild trái dải phiên bản của loader chỉ để xóa cảnh báo.

## Việc phải hoàn tất trên máy chủ trước khi mở public

1. Chọn nơi deploy và tên miền. Đặt `NEXT_PUBLIC_SERVER_URL=https://ten-mien-cua-ban`, không có đường dẫn con; build lại image sau khi đổi. Compose tự gán `PAYLOAD_SERVER_URL` theo URL này. Kiểm tra canonical, robots, sitemap không còn `localhost`.
2. Dùng secret và mật khẩu database riêng cho production; không đưa `.env` lên Git. Chạy `pnpm deploy:check` để kiểm tra biến môi trường mà không in secret. Lệnh này chỉ kiểm tra cấu hình, không thay thế kiểm tra hạ tầng.
3. Đặt reverse proxy có HTTPS phía trước app. Giữ cổng app và PostgreSQL trên `127.0.0.1` như Compose hiện tại, chỉ công khai 80/443 qua proxy. Cần giữ đúng Host/X-Forwarded-Proto để đăng nhập admin và Server Actions hoạt động.
4. Điền `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD` và chạy `pnpm deploy:check --first-deploy` cho database mới. Migration tự tạo tài khoản trước khi app được khởi động; thiếu cấu hình thì dừng deploy. Database đã có admin sẽ giữ nguyên tài khoản và mật khẩu. Xem [bootstrap admin](bootstrap-admin.md).
5. Đặt giới hạn request tại proxy/WAF cho các POST form đăng ký và API đăng nhập; đảm bảo không chặn thao tác admin hợp lệ. Form hiện có honeypot và kiểm tra lặp số điện thoại 10 phút nhưng chưa chống được đổi số hoặc nhiều request đồng thời. Không coi đây là rate limit hoàn chỉnh.
6. Lưu bền vững cả volume PostgreSQL **và** `media`. Tự động sao lưu ra nơi khác máy chủ; thử phục hồi database và ảnh vào môi trường riêng trước khi nhận khách thật. Named volume không phải backup. Không dùng `docker compose down -v`.
7. Cấu hình email nếu cần quên mật khẩu/thông báo qua email. Hiện chưa có email adapter: thư được ghi ra console, không được gửi đến hộp thư. Đăng ký tư vấn hiện được lưu trong admin, chưa tự báo email/Zalo cho nhân viên.
8. Xác nhận số điện thoại, link Zalo, bảng giá và nội dung đơn vị vận hành. Có hướng dẫn về việc sử dụng thông tin khách hàng và người chịu trách nhiệm liên hệ trước khi thu thập khách thật; không dùng nội dung đơn vị chưa được xác nhận.
9. Theo dõi `/api/health`, log lỗi và dung lượng đĩa. Docker healthcheck báo trạng thái nhưng tự nó không khởi động lại một container chỉ vì unhealthy. Chuẩn bị cảnh báo và quy trình xử lý.

## Kiểm tra phát hành

Kết quả local của lần rà soát: TypeScript và Docker production build đạt; 7 bài unit test đạt; 9 luồng Playwright đạt (8 luồng giao diện/admin và 1 luồng bảo vệ dữ liệu, upload, resize ảnh, từ chối ảnh trên 5 MB). Test dùng PostgreSQL cổng 5434 riêng. `deploy:check` với `.env` local báo thiếu domain HTTPS đúng như dự kiến; nhánh cấu hình HTTPS cũng đã được kiểm tra bằng biến môi trường tạm, không sửa `.env`.

API công khai `/api/users` và `/api/leads` từ chối đọc/ghi không đăng nhập. Hotline đang có cấu hình hoạt động. Robots và sitemap ở localhost hiện dùng URL localhost; cần build lại với domain thật trước khi public.

```powershell
pnpm deploy:check
pnpm audit --prod --audit-level high
pnpm typecheck
pnpm test
docker compose build

# Bộ test dùng database/volume riêng, không ghi vào dữ liệu khách hàng.
$env:TEST_BOOTSTRAP_ADMIN_PASSWORD = node -e "console.log(require('node:crypto').randomBytes(24).toString('hex'))"
docker compose -p viettel-sale-web-test -f compose.yaml -f compose.test.yaml up -d --wait
pnpm exec playwright test
docker compose -p viettel-sale-web-test -f compose.yaml -f compose.test.yaml down

# Chỉ cập nhật stack chính sau khi các kiểm tra đạt.
docker compose up -d --wait
```

Khi cập nhật schema: tạo và đọc migration, sao lưu trước khi áp dụng. Migration một chiều trong dự án cần phục hồi backup nếu phải quay về schema cũ; đổi lại image cũ không tự đảo migration.

Tại domain thật, kiểm tra thêm đăng nhập và lưu gói trong admin, gửi đăng ký và nhận đúng địa chỉ/gói, chọn hotline/Zalo, upload và tải lại ảnh sau khi restart, chuyển HTTP sang HTTPS, cookie Secure, và sitemap/canonical dùng đúng domain. Chưa có kiểm thử tải hoặc xác nhận HTTPS/domain thật trong lần rà soát local này.

Tham khảo: [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting), [Payload production deployment](https://payloadcms.com/docs/production/deployment), [Sharp security advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w).
