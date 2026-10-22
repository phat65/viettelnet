1. Cấu trúc website chốt như sau
Trang	Nội dung
Trang chính /	Banner, danh sách gói Internet, combo Internet + TV360/camera, form tư vấn, hotline/Zalo
Chi tiết /goi-cuoc/ten-goi	Hình ảnh, giá, tốc độ, thiết bị đi kèm, điều kiện áp dụng, nút đăng ký
Admin /admin	Đăng nhập, quản lý gói cước, xem và cập nhật yêu cầu tư vấn


Các trang chi tiết dùng chung một mẫu giao diện. Bạn thêm gói trong admin thì hệ thống tạo trang tương ứng, không phải code riêng từng trang.

2. Giao diện nên trực quan như thế nào?

Trang chính có thể bố trí theo thứ tự:
1. Banner: hình gia đình sử dụng Internet, thông điệp ngắn và nút “Xem gói cước”.
2. Chọn khu vực lắp đặt: hiển thị mức giá áp dụng nếu các khu vực có giá khác nhau.
3. Danh sách gói: chia nhóm Internet, Internet + TV360, Internet + Camera.
4. Quy trình đăng ký: để lại thông tin → nhân viên tư vấn → xác nhận và hẹn lắp.
5. Form tư vấn và thông tin liên hệ.
Mỗi thẻ gói nên hiển thị rõ tên, giá/tháng, tốc độ, thiết bị đi kèm, cùng hai nút:
- Xem chi tiết
- Nhận tư vấn
Trang chi tiết có ảnh modem, Mesh, camera hoặc TV360 phù hợp với gói; phân biệt rõ thiết bị được bao gồm và hình ảnh minh họa. Giá, phí lắp, thời hạn cam kết cần lấy từ thông tin đang được áp dụng cho địa bàn bạn bán.

3. Thông tin khách sẽ vào admin ra sao?

Khách chọn gói và nhập:
Trường	Yêu cầu
Số điện thoại	Bắt buộc
Khu vực muốn lắp	Bắt buộc
Họ tên	Có thể tùy chọn
Ghi chú	Tùy chọn
Gói quan tâm	Hệ thống tự điền từ gói khách vừa chọn


Sau khi gửi thành công, dữ liệu được lưu vào database và xuất hiện trong admin:
Thời gian	Khách hàng	Điện thoại	Gói quan tâm	Khu vực	Trạng thái
20/10, 14:30	Nguyễn A	09xx xxx xxx	Gói A	Hà Nội	Chưa liên hệ


Admin chỉ cần ba trạng thái: Chưa liên hệ – Đã liên hệ – Đã hoàn tất, kèm ô ghi chú.

Bạn mở yêu cầu để xem số điện thoại và gọi hoặc liên hệ Zalo bằng tài khoản của mình. Bản đầu chưa cần tích hợp nhắn tin trực tiếp trong admin.

4. Công nghệ phù hợp với phạm vi này

Nếu bạn chọn tự code theo hướng đã trao đổi, mình giữ bộ công nghệ:
Thành phần	Lựa chọn
Website và trang chi tiết	Next.js + TypeScript
Thiết kế giao diện	Tailwind CSS
Admin	Payload CMS
Lưu dữ liệu	PostgreSQL


Payload cung cấp nền tảng admin để mình cấu hình hai mục chính: Gói cước và Yêu cầu tư vấn. Website và admin nằm trong cùng một dự án.

Dữ liệu ban đầu chỉ cần bốn nhóm: tài khoản admin, gói cước, hình ảnh, yêu cầu tư vấn. Không cần tài khoản khách hàng, giỏ hàng, thanh toán, phân công sale hay CRM phức tạp.

5. Roadmap rút gọn: khoảng 7–10 ngày làm việc

Ước lượng cho một người đã quen công nghệ, có sẵn nội dung và hình ảnh.
Thời gian	Việc thực hiện
Ngày 1	Chốt danh sách gói, bảng giá, nội dung và bố cục
Ngày 2–3	Làm trang chính, tối ưu giao diện điện thoại
Ngày 4	Làm mẫu trang chi tiết và tự sinh trang theo gói
Ngày 5–6	Cấu hình admin, quản lý gói, form lưu thông tin khách
Ngày 7	Thêm chống spam, kiểm tra dữ liệu và bảo vệ admin
Ngày 8	Thiết lập SEO cơ bản, tên miền, HTTPS và triển khai
Ngày 9–10	Kiểm tra thực tế, sửa giao diện, nhập đủ nội dung


Vẫn nên làm tiêu đề SEO riêng cho từng gói, sitemap, tốc độ tải và đo lượt gửi form thành công ngay từ đầu. Đây là phần nhỏ nhưng giúp website sẵn sàng cho việc tìm khách sau này.

Tiêu chí hoàn thành rất cụ thể: bạn tự thêm/sửa gói được; khách xem chi tiết và gửi thông tin được; bạn đăng nhập admin thấy yêu cầu và cập nhật đã liên hệ được.


Với quy mô của bạn, nên để website, admin và xử lý form trong một project. Dưới đây là cấu trúc đề xuất cho Next.js + Tailwind CSS + Payload CMS + PostgreSQL.
viettelSaleweb/
├── public/
│   └── images/
│       ├── logo.svg
│       └── banner.webp
│
├── src/
│   ├── app/
│   │   ├── (frontend)/                 # Website khách hàng
│   │   │   ├── layout.tsx              # Header, footer, nút liên hệ
│   │   │   ├── page.tsx                # Trang chủ: danh sách gói
│   │   │   ├── globals.css             # Tailwind và CSS chung
│   │   │   ├── not-found.tsx           # Trang không tìm thấy
│   │   │   └── goi-cuoc/
│   │   │       └── [slug]/
│   │   │           └── page.tsx        # Trang chi tiết từng gói
│   │   │
│   │   ├── (payload)/                  # Admin và API của Payload
│   │   │   ├── layout.tsx
│   │   │   ├── custom.scss
│   │   │   ├── admin/
│   │   │   │   ├── importMap.js
│   │   │   │   └── [[...segments]]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── not-found.tsx
│   │   │   └── api/
│   │   │       └── [...slug]/
│   │   │           └── route.ts
│   │   │
│   │   ├── sitemap.ts                 # Danh sách URL cho Google
│   │   └── robots.ts                  # Hướng dẫn thu thập dữ liệu
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ContactButtons.tsx      # Nút gọi và Zalo
│   │   │
│   │   ├── packages/
│   │   │   ├── PackageCard.tsx         # Thẻ một gói cước
│   │   │   ├── PackageList.tsx         # Danh sách, lọc nhóm gói
│   │   │   └── PackageDetails.tsx      # Hình ảnh và thông tin gói
│   │   │
│   │   ├── forms/
│   │   │   └── ConsultationForm.tsx    # Form yêu cầu tư vấn
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   │
│   ├── collections/                    # Cấu hình dữ liệu và admin
│   │   ├── Users.ts                    # Tài khoản quản trị
│   │   ├── Packages.ts                 # Gói cước
│   │   ├── Leads.ts                    # Yêu cầu tư vấn
│   │   └── Media.ts                    # Ảnh tải lên
│   │
│   ├── globals/
│   │   └── SiteSettings.ts             # Hotline, Zalo, banner
│   │
│   ├── actions/
│   │   └── submitConsultation.ts       # Nhận và lưu form ở server
│   │
│   ├── lib/
│   │   ├── payload.ts                  # Khởi tạo Payload phía server
│   │   ├── queries.ts                  # Lấy gói cước, cấu hình web
│   │   ├── validation.ts               # Kiểm tra dữ liệu form
│   │   └── antiSpam.ts                 # Chống gửi form hàng loạt
│   │
│   ├── access/
│   │   └── isAdmin.ts                  # Kiểm tra quyền quản trị
│   │
│   ├── migrations/                     # Thay đổi cấu trúc database
│   ├── payload.config.ts              # Cấu hình Payload và database
│   └── payload-types.ts               # Kiểu dữ liệu tự sinh
│
├── .env.example                       # Mẫu biến môi trường
├── .env                               # Bí mật, không đưa lên Git
├── .gitignore
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── README.md

Nhóm (frontend) và (payload) giúp tách giao diện khách với admin, không xuất hiện trong URL. Các file hệ thống trong (payload) nên lấy từ bộ khởi tạo Payload; admin được sinh từ cấu hình dữ liệu, nên bạn không cần tự viết từng màn hình thêm/sửa/xóa. Payload

Các đường dẫn website sẽ có:
URL	Chức năng
/	Trang giới thiệu và danh sách gói
/goi-cuoc/ten-goi	Chi tiết gói tương ứng
/admin	Quản trị
/admin/login	Đăng nhập quản trị


[slug]/page.tsx là một mẫu dùng chung cho tất cả gói. Ví dụ gói có slug = internet-gia-dinh thì URL là /goi-cuoc/internet-gia-dinh.

Bốn nhóm dữ liệu chính:
File	Dữ liệu cần lưu
Users.ts	Email, thông tin xác thực do Payload quản lý
Packages.ts	Tên, slug, nhóm gói, giá theo khu vực, tốc độ, ảnh, thiết bị, nội dung, điều kiện, trạng thái hiển thị
Leads.ts	Tên khách, điện thoại, khu vực, gói quan tâm, ghi chú, trạng thái liên hệ, ngày gửi
Media.ts	Ảnh gói cước, thiết bị, văn bản mô tả ảnh


SiteSettings.ts lưu các thông tin chung để bạn đổi hotline, Zalo hoặc banner ngay trong admin.

Luồng nhận khách nằm ở ba chỗ:
1. ConsultationForm.tsx: khách nhập và gửi thông tin.
2. submitConsultation.ts: kiểm tra dữ liệu, chống spam, xác thực gói đang bán rồi lưu vào Leads.
3. Admin hiển thị yêu cầu để bạn gọi lại và cập nhật trạng thái.
Danh sách khách chỉ admin được đọc/sửa. Form công khai chỉ được gửi các trường cho phép; trạng thái ban đầu do server đặt là “Chưa liên hệ”.

Bạn nên làm lần lượt: cấu hình dữ liệu/admin → trang chủ → trang chi tiết → form nhận khách → giao diện điện thoại và SEO → triển kkhai,