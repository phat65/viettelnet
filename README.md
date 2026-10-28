# Viettel Sale Web

Website showcase theo [seccondmove.md](./seccondmove.md), trên kiến trúc [firstmove.md](./firstmove.md): Next.js App Router + TypeScript + Tailwind CSS + Payload CMS + PostgreSQL. Website khách hàng và admin nằm chung một dự án.

## Nội dung có sẵn

Menu dùng các trang `/internet`, `/internet/tv360`, `/internet/camera`, `/internet/mesh-wifi`, `/internet/ultra-speed` và `/internet/uu-dai`. Trang nhóm có nội dung giới thiệu, danh sách gói riêng và liên kết qua lại. URL cũ `/goi-cuoc/<slug>` chuyển hướng 308 sang `/internet/<slug>`, giữ vùng giá đang chọn. Xem [bảng đường dẫn](docs/seo.md).

Danh mục hiện có 21 gói: 18 gói gốc và 3 gói bổ sung GIGAPRO1, GIGAVIP1, MESHVT3_CAM1, chia thành 6 nhóm: ưu đãi, cá nhân, TV360, Camera, Mesh cho nhà nhiều tầng và Ultra Speed. Các lựa chọn Camera/Cloud theo ngày lưu trữ đã được bỏ khỏi danh mục bằng migration riêng; nội dung lưu trữ và ảnh minh họa sẽ được quản trị viên bổ sung trong mô tả gói Camera. Mỗi gói có trang riêng `/internet/<slug>`. Nhóm có từ 4 gói trở lên có mũi tên cuộn trước/sau. Xem [bảng giá, đối chiếu nguồn và migration triển khai](docs/catalog-20261028.md).

Admin có thể **thêm/sửa gói trong 6 nhóm có sẵn**, nhập giá riêng cho Hà Nội & TP.HCM / tỉnh thành khác, thiết bị, hình ảnh và bài viết chi tiết bằng trình soạn thảo. Đặt trạng thái **Đang bán** để hiện trên website. Khách chọn tên tỉnh/thành trên thẻ hoặc mở `/internet/khu-vuc/ha-noi`, `/internet/khu-vuc/ho-chi-minh`, `/internet/khu-vuc/da-nang`… Hà Nội và Hồ Chí Minh dùng giá `metro`, các tỉnh còn lại dùng `other` ở bên trong; giao diện chỉ hiện tên địa phương. Lựa chọn được giữ khi mở chi tiết và tự điền tỉnh trong form đăng ký; khách vẫn có thể sửa địa chỉ. Các trang tỉnh/thành tự có trong sitemap.

Bảng giá ban đầu được đối chiếu ViettelUp ngày 21/10/2026. GIGA chỉ có giá Hà Nội & TP.HCM; khu vực khác hiện “Liên hệ”. NETVT1 có phí hòa mạng 300.000đ và miễn phí lắp đặt theo ảnh mẫu; các khoản chưa xác nhận của gói khác được để trống. Giá, phí và thông số được hiển thị tự động trên trang chi tiết; bài viết riêng dùng cho ưu điểm, đối tượng phù hợp, hướng dẫn và FAQ, tránh nhập lặp bảng giá.

Trong **Đơn vị & Liên hệ**, thêm nhiều người liên hệ: tên, số điện thoại, bật/tắt Zalo, link Zalo tùy chọn và trạng thái hiển thị. Nếu bỏ trống link Zalo, hệ thống dùng số di động. Khách bấm **Chat Zalo** hoặc **Gọi tư vấn**, chọn người rồi mở đúng link/số tương ứng. Chưa có người liên hệ thì website vẫn nhận form, không hiển thị số mẫu.

**Nội dung danh mục** cho phép sửa giới thiệu, bài tư vấn, FAQ và SEO của `/internet` cùng sáu nhóm dịch vụ. **Đơn vị & Liên hệ** cũng quản lý thông tin ở footer và nội dung `/gioi-thieu`, `/lien-he`, `/chinh-sach-bao-mat`. Lưu là xuất bản ngay; xem [hướng dẫn nội dung và SEO](docs/seo.md).

## Chạy toàn bộ bằng Docker

**Deploy VPS với tên miền `viettelnet.store`:** xem [lệnh cài đặt, Nginx và HTTPS](docs/deploy-vps.md). `.env.example` dùng URL production; khi chạy local bằng file mẫu, đổi `NEXT_PUBLIC_SERVER_URL` về `http://localhost:3000`. Script `docker:setup` không ghi đè URL đã có.

Mở Docker Desktop, rồi chạy tại thư mục dự án:

```powershell
pnpm docker:setup
# Với database mới: điền BOOTSTRAP_ADMIN_EMAIL và BOOTSTRAP_ADMIN_PASSWORD trong .env.
docker compose up -d --build --wait
```

`docker:setup` tạo mật khẩu database ngẫu nhiên trong `.env`, giữ nguyên secret hiện có, và cấu hình kết nối local. Có thể dùng `node scripts/setup-docker.mjs` nếu máy chưa cài pnpm.

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin — đăng nhập bằng tài khoản được migration tạo từ `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD`.
- PostgreSQL: `localhost:${POSTGRES_PORT}`; cấu hình trên máy hiện tại là **5433** vì cổng 5432 đã có dịch vụ khác. Thông tin kết nối nằm trong `.env`.

Compose chạy PostgreSQL → migration → website/admin. Database và ảnh upload dùng named volume, được giữ khi dừng hoặc tạo lại container. Các cổng chỉ mở trên máy local.

```powershell
docker compose ps -a
docker compose logs -f app
docker compose down
# Khởi chạy lại, giữ nguyên dữ liệu:
docker compose up -d --wait
```

Không dùng `down -v` nếu muốn giữ database và ảnh. Hướng dẫn cấu hình, cập nhật và sao lưu: [docs/docker.md](./docs/docker.md).

## Chạy code local với PostgreSQL trong Docker

Yêu cầu Node.js từ 20.19 trở lên, pnpm 10 và PostgreSQL đang chạy.

```powershell
pnpm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Nếu `.env` đã tồn tại thì giữ lại. Khi dùng database do Compose tạo, `pnpm docker:setup` đã điền `DATABASE_URL` local. File `.env` không được đưa vào Git. Dừng app Docker trước khi chạy `pnpm dev` để tránh trùng cổng.

```powershell
pnpm docker:setup
docker compose stop app
docker compose up -d postgres --wait
# Với database mới: điền các biến BOOTSTRAP_ADMIN_* trước bước migration.
pnpm db:migrate
pnpm generate:types
pnpm generate:importmap
pnpm dev
```

- Website: `http://localhost:3000`.
- Quản trị: `http://localhost:3000/admin`.
- Database mới cần điền `BOOTSTRAP_ADMIN_EMAIL` và `BOOTSTRAP_ADMIN_PASSWORD` trong `.env` trước khi chạy migration. Migration tạo đúng một quản trị viên bằng cơ chế hash mật khẩu của Payload. Nếu đã có tài khoản, giữ nguyên tất cả tài khoản/mật khẩu và bỏ qua seed. Xem [hướng dẫn bootstrap admin](docs/bootstrap-admin.md).
- Điền **Đơn vị & Liên hệ** với thông tin và các số thực tế của bạn.
- **Gói cước** được nạp sẵn khi chạy migration; có thể thêm gói, chọn mục gói cước, chỉnh giá và nội dung chi tiết.
- Mở trang chi tiết, gửi form rồi kiểm tra **Người đăng ký** để biết khách chọn gói nào.

Dự án dùng migration, `PAYLOAD_DB_PUSH=false`, cho cả app Docker và code local khi dùng chung database. Sau khi đổi collections/globals, sinh migration mới rồi áp dụng trước khi chạy app.

## Cấu trúc

```text
public/images/                 Ảnh tĩnh; nguồn ghi tại SOURCES.md
Dockerfile                     Build tooling và runtime Next.js standalone
compose.yaml                   PostgreSQL, migration, website/admin
scripts/setup-docker.mjs        Chuẩn bị .env, giữ nguyên secret hiện có
src/
  app/
    (frontend)/                Layout, trang chủ, trang 404
      internet/[slug]/          Mẫu chi tiết chung cho mọi gói
    (payload)/                 Layout, stylesheet admin, route Payload
      admin/[[...segments]]/   Admin và đăng nhập
      api/[...slug]/           REST API có kiểm soát truy cập
    sitemap.ts
    robots.ts
  components/
    admin/                     Khối hướng dẫn công việc trong dashboard
    layout/                    Header, Footer, ContactButtons
    packages/                  PackageCard, PackageList, PackageDetails
    forms/                     ConsultationForm
    ui/                        Button, Input, Modal
  collections/
    Users.ts                   Quản trị viên
    Packages.ts                Quản lý gói: nhóm, giá, thiết bị, nội dung, SEO
    Leads.ts                   Thông tin tư vấn và trạng thái liên hệ
    Media.ts                   Hình ảnh, mô tả ảnh
  globals/SiteSettings.ts      Danh sách nhiều liên hệ và Zalo
  data/catalog.ts             18 gói và 6 nhóm theo seccondmove.md
  actions/submitConsultation.ts
  lib/                        Payload, truy vấn, kiểm tra dữ liệu, chống spam
  access/isAdmin.ts            Quyền quản trị / chỉ đọc gói đang bán
  migrations/                 Schema và migration nạp sẵn danh mục
  payload.config.ts
  payload-types.ts            Payload tự sinh; không sửa tay
tests/                        Kiểm tra dữ liệu form
docs/architecture.md          Quyết định thiết kế và ánh xạ yêu cầu
```

`(frontend)` và `(payload)` là route group, không xuất hiện trong URL. Mỗi gói có URL, nội dung và form đăng ký riêng. Ảnh showcase nằm trong `public/images/`, nguồn ghi tại `public/images/SOURCES.md`. Mục Hình ảnh trong admin dùng để upload ảnh gói hoặc ảnh cho bài viết.

## Admin theo hướng Medusa

Giữ cơ chế đăng nhập, sidebar, bảng danh sách, tìm kiếm, bộ lọc và form sửa của Payload. Tùy biến CSS nhẹ, màu trung tính, viền mảnh và góc bo; dashboard có lối tắt đến gói và yêu cầu tư vấn. Đây là giao diện Payload lấy cảm hứng từ cách tổ chức của Medusa, không phải bản sao Medusa Admin.

Menu:

- **Kinh doanh:** Gói cước, Người đăng ký, Đơn vị & Liên hệ. **Nội dung:** Nội dung danh mục. Dashboard có lối tắt lọc từng nhóm gói.
- **Nội dung:** Hình ảnh.
- **Hệ thống:** Quản trị viên.

Các trường chỉnh sửa cố định. Không có page builder, blocks hay kéo thả component. Không cài Medusa backend.

## Luồng dữ liệu và quyền

1. Khách xem danh mục có sẵn, chọn khu vực và mở trang chi tiết của gói.
2. Bấm đăng ký trên thẻ gói, trang chi tiết hoặc menu để mở cùng một popup. Form tự nhớ gói vừa chọn; đăng ký từ menu là yêu cầu tư vấn chung. Khách nhập số điện thoại, chọn tỉnh/thành → phường/xã và nhập địa chỉ cụ thể. Không còn form ở cuối trang chủ hoặc bên cạnh bài viết.
3. Server kiểm tra dữ liệu và gói đang bán, chặn honeypot và kiểm tra trùng số điện thoại trong 10 phút. Giá tham khảo được phép nhận tư vấn ở cả hai vùng; không khẳng định khả năng lắp đặt trước khi xác nhận địa chỉ.
4. Server xác nhận phường/xã thuộc tỉnh đã chọn, lấy tên từ danh mục, lưu địa chỉ đầy đủ và tự đặt trạng thái `new`. Admin có cột tỉnh/thành và phường/xã; đăng ký cũ giữ nguyên thông tin.
5. Admin cập nhật **Chưa liên hệ → Đã liên hệ → Đã hoàn tất**, cùng ghi chú nội bộ.

Public API không được đọc/tạo/sửa khách hàng hoặc tài khoản quản trị. Server action là điểm nhận yêu cầu công khai; quyền ghi ưu tiên được dùng có chủ đích sau bước kiểm tra. Ảnh là nội dung công khai, chỉ upload tài sản phù hợp để công bố.

Danh mục địa chỉ được lưu tại `src/data/locations`, lấy từ [Province Open API v2](https://provinces.open-api.vn/) theo hai cấp tỉnh/thành và phường/xã. Form tải phường/xã từ API nội bộ, không phụ thuộc dịch vụ bên ngoài khi khách đăng ký. Khi cần cập nhật danh mục, chạy `node scripts/update-locations.mjs`, kiểm tra thay đổi rồi build lại. Nguồn và thời điểm lấy dữ liệu nằm trong `src/data/locations/SOURCE.md`.

Chống spam hiện là mức khởi đầu: honeypot và kiểm tra gửi lại qua database. Chưa chặn được bot đổi số hay yêu cầu đồng thời vượt qua bước kiểm tra. Cần bổ sung giới hạn request ở proxy/WAF hoặc CAPTCHA khi triển khai công khai. Chưa có tích hợp gọi điện, nhắn Zalo, analytics hay CRM.

## Kiểm tra và triển khai sau này

Để Google tìm thấy website sau khi deploy: xem [hướng dẫn SEO và xác minh Search Console](docs/seo.md).

Xem [báo cáo sẵn sàng triển khai](docs/deployment-readiness.md) trước khi mở public. `pnpm deploy:check` kiểm tra biến môi trường production, không in mật khẩu/secret. Cấu hình localhost hiện tại sẽ báo chưa có domain HTTPS; đó là kết quả dự kiến khi phát triển local.

```powershell
pnpm typecheck
pnpm test
pnpm build
```

Kiểm thử trình duyệt dùng database/volume riêng, không thay đổi dữ liệu thật:

```powershell
# Build stack chính trước để có image mới.
$env:TEST_BOOTSTRAP_ADMIN_PASSWORD = node -e "console.log(require('node:crypto').randomBytes(24).toString('hex'))"
docker compose -p viettel-sale-web-test -f compose.yaml -f compose.test.yaml up -d --wait
pnpm exec playwright test
# Dừng môi trường thử, giữ stack chính chạy.
docker compose -p viettel-sale-web-test -f compose.yaml -f compose.test.yaml down
```

Test stack dùng website cổng 3100 và PostgreSQL cổng 5434. Kiểm tra 18 URL, đổi giá từng vùng, thêm/sửa/xuất bản gói và bài viết từ admin, form gắn đúng gói, chọn số Zalo/điện thoại và menu mobile. Trên Windows test dùng Microsoft Edge có sẵn; Linux cần cài Chromium của Playwright.

Trước triển khai: cấu hình URL/HTTPS, database, tài khoản đầu tiên trong môi trường riêng, lưu ảnh bền vững và sao lưu. Hosting nhiều instance cần object storage hoặc volume chung.

Sau khi chốt schema:

```powershell
pnpm db:migration:create
# Đọc migration sinh ra và thử trên database thử nghiệm trước.
pnpm db:migrate
pnpm build
pnpm start
```

Đặt `PAYLOAD_DB_PUSH=false`. Docker tự áp dụng migration và nạp danh mục trước khi chạy app. Migration nạp gói có bản chụp dữ liệu riêng trong `src/migrations/data/showcase-v1.ts`, không bị thay đổi khi sửa catalog về sau. Muốn đổi catalog cần thêm migration mới; không sửa migration đã chạy. Tài khoản và đăng ký hiện có được giữ nguyên.

## Nguồn tham khảo

- [Trang Internet ViettelUp](https://www.viettelup.vn/internet): cách chia nhóm gói, chọn khu vực, thẻ giá và điểm nhận tư vấn.
- [Medusa Admin User Guide](https://docs.medusajs.com/user-guide): sidebar, danh sách và trang quản lý.
- [Payload Installation](https://payloadcms.com/docs/getting-started/installation): tích hợp Next.js, PostgreSQL và các route hệ thống.
- [Payload blank template](https://github.com/payloadcms/payload/tree/main/templates/blank): tham chiếu route admin.

Danh mục ban đầu theo `seccondmove.md`; giao diện và bảng giá vùng cập nhật theo ảnh mẫu và ViettelUp. Hotline và Zalo chỉ dùng thông tin bạn tự gán trong admin.
