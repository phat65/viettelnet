# Triển khai viettelnet.store trên VPS

Hướng dẫn cho VPS mới chạy **Ubuntu 24.04 LTS, x86_64**, RAM khuyến nghị 6 GB khi build trực tiếp. Nginx và Certbot chạy trên VPS; website/admin và PostgreSQL chạy bằng Docker Compose. Không cần cài Node.js hoặc pnpm trên VPS.

Luồng truy cập: `https://viettelnet.store` → Nginx cổng 443 → `127.0.0.1:3000` → app Docker → PostgreSQL trong mạng Docker.

## 1. DNS và cài công cụ

- Trỏ bản ghi **A**, tên `@`, của `viettelnet.store` về IPv4 VPS. Chỉ thêm AAAA khi VPS có IPv6 hoạt động.
- Nếu dùng Cloudflare, để **DNS only** trong quy trình này. Cấu hình hiện giới hạn request theo IP kết nối trực tiếp; bật proxy CDN cần cấu hình thêm danh sách proxy tin cậy để lấy đúng IP khách.
- Cho phép TCP 80/443 trên firewall của VPS và nhà cung cấp; giữ cổng SSH đang dùng. Không mở 3000/5432 ra Internet.
- Hướng dẫn chỉ cấp chứng chỉ cho `viettelnet.store`, chưa bao gồm `www.viettelnet.store`.

Các lệnh dưới đây chạy trong Bash trên VPS, với quyền root qua `sudo -i`:

Chạy riêng `sudo -i`, đợi dấu nhắc đổi thành `root@...#`, rồi mới dán các lệnh tiếp theo. Nếu đang ở tài khoản `ubuntu`, lệnh `install` vào `/var/www` hoặc `/etc/nginx` cần thêm `sudo`; lỗi `chmod ... Operation not permitted` có thể do thiếu quyền.

```bash
sudo -i
apt update
apt install -y docker.io docker-compose-v2 docker-buildx nginx certbot git nano curl
systemctl enable --now docker nginx
docker compose version

git clone https://github.com/phat65/viettelnet.git /opt/viettelnet
cd /opt/viettelnet
```

Nếu repository Private, dùng tài khoản GitHub với token khi Git yêu cầu mật khẩu, hoặc clone qua SSH đã cấu hình. Không ghi token vào URL clone. Nếu máy đã cài Docker từ nguồn khác, giữ bộ Docker/Compose hiện có, chỉ cài các công cụ còn thiếu.

## 2. Chuẩn bị .env

```bash
cd /opt/viettelnet
# Giữ .env nếu đã tồn tại; không ghi đè secret của database đang chạy.
if [ ! -f .env ]; then cp .env.example .env; fi
docker run --rm \
  --mount type=bind,src="$PWD",dst=/workspace \
  -w /workspace node:24-bookworm-slim node scripts/setup-docker.mjs
chmod 600 .env
nano .env
```

Giữ các mật khẩu/secret ngẫu nhiên vừa sinh. Điền email thật và mật khẩu admin riêng 8–128 ký tự vào các biến còn trống:

```dotenv
NEXT_PUBLIC_SERVER_URL=https://viettelnet.store
APP_PORT=3000
PAYLOAD_DB_PUSH=false
BOOTSTRAP_ADMIN_EMAIL=
BOOTSTRAP_ADMIN_PASSWORD=
BOOTSTRAP_ADMIN_NAME=Quản trị viên
```

Đây là các dòng cần kiểm tra trong `.env`, **không thay toàn bộ file bằng đoạn trên**. Nếu mật khẩu chứa `$` hoặc `#`, bao giá trị bằng dấu nháy đơn. Không đưa `.env` vào Git. `APP_PORT=3000` phải khớp upstream Nginx. Compose dùng URL này cả khi build lẫn khi chạy; cookie admin sẽ bật Secure.

## 3. Cấp chứng chỉ HTTPS lần đầu

Chỉ dùng cấu hình HTTP tạm bên dưới khi chưa có chứng chỉ. Nó phục vụ yêu cầu xác minh chứng chỉ; các đường dẫn khác trả 503 trong lúc chuẩn bị.

```bash
install -d -m 755 /var/www/letsencrypt
install -m 644 deploy/nginx/viettelnet.store.http.conf /etc/nginx/sites-available/viettelnet.store
ln -sfn /etc/nginx/sites-available/viettelnet.store /etc/nginx/sites-enabled/viettelnet.store
nginx -t && systemctl reload nginx

certbot certonly --webroot -w /var/www/letsencrypt \
  --cert-name viettelnet.store -d viettelnet.store
```

Certbot sẽ hỏi email nhận thông báo và chấp nhận điều khoản. Chỉ tiếp tục sau khi cấp chứng chỉ thành công. Nếu thất bại, kiểm tra DNS, bản ghi AAAA và cổng 80. Không tạo chứng chỉ giả để thay thế trên production.

## 4. Chạy ứng dụng và bật Nginx HTTPS

```bash
cd /opt/viettelnet
docker compose up -d --build --wait
docker compose ps -a
curl --fail http://127.0.0.1:3000/api/health

install -m 644 deploy/nginx/viettelnet.store.conf /etc/nginx/sites-available/viettelnet.store
nginx -t && systemctl reload nginx

install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
install -m 755 deploy/nginx/renew-nginx.sh /etc/letsencrypt/renewal-hooks/deploy/viettelnet-nginx
systemctl enable --now certbot.timer
certbot renew --dry-run
```

Migration chạy trước app, tạo admin khi database trống; đã có admin thì giữ nguyên. Container `migrate` có trạng thái `Exited (0)` là bình thường. Nếu migration lỗi, xem `docker compose logs --tail 100 migrate` và sửa cấu hình trước khi chạy lại; không bỏ qua migration.

Hook gia hạn kiểm tra cấu hình rồi reload Nginx để dùng chứng chỉ mới. Không chạy lại bước cài HTTP tạm sau khi HTTPS đã hoạt động. Khi gia hạn, đường dẫn `/.well-known/acme-challenge/` vẫn phục vụ qua HTTP.

```bash
curl -I http://viettelnet.store
curl --fail https://viettelnet.store/api/health
systemctl list-timers certbot.timer
docker compose logs --tail 50 app migrate
```

HTTP phải chuyển hướng 308 về HTTPS. Mở **https://viettelnet.store/admin**, đăng nhập bằng tài khoản đã đặt, thử lưu gói, upload ảnh và gửi đăng ký từ website. Kiểm tra sitemap dùng domain thật. Nginx chuyển tiếp Host và HTTPS scheme để admin/Server Actions hoạt động; giới hạn body 6 MB để chứa ảnh tối đa 5 MB và metadata của form. Request vượt giới hạn theo IP trả 429; điều chỉnh sau khi đo tải thực tế nếu cần.

## 5. Cập nhật những lần sau

Sao lưu database và ảnh trước khi cập nhật; xem [hướng dẫn sao lưu](docker.md#sao-lưu-postgresql). Giữ `.env` và các Docker volume. Các lệnh sau giả định đã push code mới lên nhánh main:

```bash
cd /opt/viettelnet
git pull --ff-only origin main
docker compose up -d --build --wait
curl --fail https://viettelnet.store/api/health
```

Nếu sửa file Nginx, cài lại **file HTTPS** rồi kiểm tra/reload:

```bash
install -m 644 deploy/nginx/viettelnet.store.conf /etc/nginx/sites-available/viettelnet.store
nginx -t && systemctl reload nginx
```

Build trực tiếp cần thêm RAM và dung lượng cho cache/image. Không dùng `docker compose down -v`. HTTPS và named volume không thay thế backup; trước khi nhận khách thật cần đặt lịch sao lưu PostgreSQL và ảnh ra nơi khác máy chủ, rồi thử khôi phục.

Nguồn: [Nginx reverse proxy](https://nginx.org/en/docs/http/ngx_http_proxy_module.html), [Nginx rate limiting](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html), [Ubuntu: TLS certificates](https://ubuntu.com/server/docs/how-to/security/obtain-tls-certificates/).
