# Kiến trúc theo firstmove.md

## Phạm vi

Website showcase theo `seccondmove.md` và ảnh tham khảo: hiển thị sẵn 18 gói, detail riêng mỗi gói, nhận đăng ký và chọn nhiều số Zalo/điện thoại. Admin có thể thêm/sửa gói trong sáu nhóm cố định, thay giá và soạn bài chi tiết; không cần cấu hình bố cục.

## Từ ViettelUp sang cấu trúc dự án

Trang tham khảo: https://www.viettelup.vn/internet

| Thành phần quan sát | Vị trí trong dự án |
| --- | --- |
| Banner giới thiệu và CTA cố định | `(frontend)/page.tsx`, `public/images/` |
| Nhóm gói và giá theo khu vực | `Packages.ts`, `PackageList.ts` |
| Thẻ gói với tốc độ, tiện ích, đăng ký | `PackageCard.tsx` |
| Nội dung chi tiết theo gói | `internet/[slug]/page.tsx`, `PackageDetailView.tsx`, `PackageArticle.tsx` |
| Yêu cầu tư vấn | `ConsultationForm.tsx`, `submitConsultation.ts`, `Leads.ts` |
| Nhiều liên hệ và hộp chọn số | `SiteSettings.ts`, `contacts.ts`, `ContactButtons.tsx`, `Footer.tsx` |

Trang chủ: banner → lợi ích → menu 6 nhóm / khu vực → 6 khối gói → kết nối → ưu đãi → nhu cầu sử dụng → HomeWifi → quy trình → form. Không thêm trang tin tức ngoài yêu cầu.

18 gói theo tài liệu được seed bằng migration dữ liệu, sau migration schema để PostgreSQL commit enum mới. Sáu nhóm showcase: offers, individual, entertainment, camera, mesh, ultra. Nhóm nghiệp vụ Internet/TV360/Camera cũ vẫn được giữ.

Giá vùng được đối chiếu trang nguồn ngày 21/10/2026, lưu trong migration `regional_catalog`. Mỗi thẻ tự chọn khu vực, cập nhật giá tức thì và truyền vùng sang trang chi tiết/form. GIGA chỉ có giá metro; vùng chưa có giá hiển thị liên hệ và vẫn nhận yêu cầu tư vấn. Phí chưa biết để null, riêng NETVT1 có phí theo ảnh được cung cấp. Editor Lexical lưu bài viết dạng JSON, bảng giá lấy trực tiếp từ trường giá để không lặp dữ liệu trong bài.

## Học cách bố trí admin Medusa

Nguồn: https://docs.medusajs.com/user-guide

Có thể áp dụng sidebar và màn hình danh sách/chi tiết của Medusa cho nhu cầu này. Payload đã có nền tảng phù hợp, vì vậy giữ Payload và chỉnh giao diện nhẹ:

- Nhóm menu theo công việc.
- Admin thêm/sửa/xóa gói và chọn nhóm cố định. Public chỉ đọc gói đang bán; mọi thao tác ghi yêu cầu đăng nhập.
- Danh sách yêu cầu có ngày gửi, khách, điện thoại, gói, khu vực, trạng thái.
- Nội dung là trường dữ liệu cố định; không cấu hình page builder.
- Dashboard cung cấp lối tắt đến hai nghiệp vụ chính.
- Admin chỉnh danh sách liên hệ: tên, điện thoại, link Zalo tùy chọn, bật/tắt hiển thị. URL Zalo chỉ chấp nhận HTTPS trên `zalo.me`; số di động được chuẩn hóa. Hộp chọn dùng dialog có hỗ trợ bàn phím.
- Menu Hình ảnh hỗ trợ upload ảnh gói và bài viết. Cấu hình banner cũ được ẩn; dữ liệu cũ được giữ lại. Migration chuyển hotline cũ sang danh sách liên hệ nếu có.

`src/app/(payload)/custom.scss` chứa tùy biến giao diện. `src/components/admin/` dành cho phần bổ sung admin. Không thay thế cơ chế xác thực và phân quyền bằng giao diện giả lập.

## Mức hoàn thành của scaffold

Đã có cấu hình collections/globals, route frontend/admin/API, truy vấn, form server action, quyền truy cập, SEO và CSS ban đầu. Import map và types được sinh bằng CLI Payload.

Đã bổ sung Docker Compose cho PostgreSQL, bước migration và website/admin. Có migration khởi tạo schema; volume giữ database và ảnh upload. Xem `docs/docker.md`.

Đây là cấu trúc có thể phát triển tiếp, chưa phải bản nghiệm thu vận hành. Cần kiểm thử đầy đủ nghiệp vụ, nội dung và ảnh đúng đơn vị kinh doanh, kiểm tra trực quan trong trình duyệt, analytics form thành công và cấu hình triển khai công khai.
