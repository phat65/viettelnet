# Tạo sẵn quản trị viên bằng migration

Migration `20261022_000000_bootstrap_admin` chạy sau các migration schema và danh mục gói. Không có tài khoản/mật khẩu mặc định trong code.

## Lần deploy đầu tiên

Chạy `pnpm docker:setup` nếu chưa có `.env`. Điền các giá trị này trong `.env` trên máy chủ hoặc trong secret store của nơi deploy:

```dotenv
# Điền email thật và mật khẩu riêng trước khi chạy migration.
BOOTSTRAP_ADMIN_EMAIL=
BOOTSTRAP_ADMIN_PASSWORD=
# Có thể để trống để dùng tên Quản trị viên.
BOOTSTRAP_ADMIN_NAME=
```

Mật khẩu cần 16–128 ký tự, không dùng giá trị mẫu. Không commit `.env`, không gửi mật khẩu trong chat và không thêm mật khẩu vào Dockerfile. Nếu mật khẩu có `$` hoặc `#`, bao giá trị bằng dấu nháy đơn trong `.env` để Docker Compose không nội suy hoặc hiểu là comment.

```powershell
# Chạy trên môi trường đã cấu hình domain HTTPS thật.
pnpm deploy:check --first-deploy
docker compose up -d --build --wait
```

Trên máy local, bỏ qua bước kiểm tra domain HTTPS; migration vẫn kiểm tra thông tin admin trước khi tạo tài khoản. Nếu chạy không qua Docker, đặt cùng biến môi trường rồi chạy `pnpm db:migrate` trước khi start app.

Sau khi migration thành công, mở `/admin` và đăng nhập bằng email/mật khẩu đã đặt. Payload tự hash mật khẩu; database lưu hash và salt, không lưu mật khẩu gốc. Việc tạo tài khoản dùng transaction của migration.

## Khi chạy lại hoặc nâng cấp

- Nếu bảng users đã có tài khoản: migration bỏ qua việc tạo mới, không thay đổi tên, email hoặc mật khẩu, kể cả khi biến bootstrap đã thay đổi.
- Nếu bảng users trống mà thiếu email/mật khẩu hợp lệ: migration thất bại, không đánh dấu seed đã hoàn thành. Sửa biến môi trường rồi chạy lại.
- Compose đợi migration thành công trước khi khởi động app. Không dùng `--no-deps` để triển khai lần đầu và không chạy app bỏ qua migration.
- Sau lần seed, thay biến môi trường không có tác dụng đổi mật khẩu. Đổi mật khẩu trong admin.
- Migration down từ chối xóa tài khoản để không gây mất quyền truy cập.
- Migration chỉ seed một lần, không tự tạo lại admin nếu sau này toàn bộ tài khoản bị xóa. Khôi phục từ backup hoặc thực hiện quy trình phục hồi quản trị có kiểm soát.

Các biến bootstrap chỉ được truyền vào service `migrate`, không truyền vào `app`, không đưa vào image build. Sau khi đăng nhập thành công, có thể xóa `BOOTSTRAP_ADMIN_PASSWORD` khỏi môi trường triển khai và tạo lại container migrate để bỏ giá trị còn lưu trong cấu hình container đã thoát. Giữ mật khẩu trong trình quản lý mật khẩu; các lần nâng cấp sau không cần biến bootstrap nếu đã có admin.

## Kiểm tra migration

```powershell
docker compose build
pnpm test:bootstrap
```

Lệnh kiểm thử tạo project Docker và database riêng, dùng thông tin ngẫu nhiên không in ra log. Nó kiểm tra thiếu/sai mật khẩu không tạo tài khoản, tạo thành công một admin, lưu hash, đăng nhập được và chạy lại không đổi mật khẩu. Kết thúc sẽ dừng project thử, giữ volume thử và không chạm dữ liệu chính.

Khi chạy Playwright bằng `compose.test.yaml`, dùng `TEST_BOOTSTRAP_ADMIN_PASSWORD` riêng (xem README); cấu hình test không dùng mật khẩu bootstrap production.
