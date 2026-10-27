# SEO cho viettelnet.store

DNS trỏ đúng giúp truy cập website; chứng chỉ HTTPS xác minh quyền kiểm soát tên miền. Để được tìm thấy trên Google còn cần Google thu thập và lập chỉ mục nội dung. Không có bảo đảm vị trí hoặc thời điểm lên kết quả tìm kiếm.

## Nền tảng trong code

### Sửa nội dung trong admin

- **Nội dung → Nội dung danh mục** (`/admin/globals/catalog-content`): chọn tab Internet hoặc nhóm dịch vụ để sửa tiêu đề trang, giới thiệu, bài tư vấn, FAQ và SEO. Để trống tiêu đề/giới thiệu/SEO sẽ dùng nội dung mặc định; xóa các dòng FAQ để ẩn FAQ. Các thay đổi áp dụng trên trang danh mục, không thay tiêu đề nhóm showcase ở trang chủ hoặc nội dung từng gói.
- **Kinh doanh → Đơn vị & Liên hệ** (`/admin/globals/site-settings`): nhập tên đơn vị thực tế, vai trò, địa chỉ, email và giờ tư vấn. Thông tin này dùng chung cho footer và các trang hỗ trợ. Danh sách số điện thoại/Zalo vẫn ở cùng màn hình.
- Các tab **Giới thiệu**, **Liên hệ**, **Chính sách bảo mật** sửa nội dung và SEO tại `/gioi-thieu`, `/lien-he`, `/chinh-sach-bao-mat`. Để trống nội dung dùng bản cơ bản; cần hoàn thiện chính sách theo cách đơn vị thực tế xử lý dữ liệu. Không có tên đơn vị/địa chỉ giả được điền sẵn.
- Bấm **Lưu**, tải lại trang công khai để xem thay đổi; không cần build lại. Đây là nội dung xuất bản ngay, chưa có quy trình duyệt bản nháp.
- Khi triển khai phiên bản này, chạy migration `20261026_175832_editable_site_content` trước khi khởi động app mới. `docker compose up -d --build --wait` đã có bước migrate tự động. Migration chỉ thêm bảng/cột, không thay gói cước, liên hệ hoặc tài khoản hiện có.

### Đường dẫn và navigation

| Nội dung | URL |
| --- | --- |
| Danh mục tất cả gói | `/internet` |
| Internet cá nhân/gia đình | `/internet/ca-nhan` |
| Internet kèm TV360 | `/internet/tv360` |
| Internet kèm camera | `/internet/camera` |
| Mesh cho nhà nhiều tầng | `/internet/mesh-wifi` |
| Ultra Speed | `/internet/ultra-speed` |
| Combo ưu đãi | `/internet/uu-dai` |
| Một gói cụ thể | `/internet/netvt1`, `/internet/meshvt1-cam1`… |

Menu đầu trang dẫn đến các trang danh mục thật, không chỉ cuộn đến fragment `/#camera`. Breadcrumb ở trang gói dẫn về Internet và nhóm tương ứng. Trang chủ vẫn giữ showcase và các anchor cũ để liên kết đã chia sẻ tiếp tục cuộn được.

URL cũ `/goi-cuoc/:slug` chuyển hướng vĩnh viễn **308** sang `/internet/:slug`, giữ query như `?khu-vuc=other`. Canonical và sitemap chỉ dùng URL mới. Giữ redirect này sau khi cập nhật và gửi lại sitemap trong Search Console; không xóa redirect ngay khi Google bắt đầu thấy URL mới.

Khu vực giá vẫn chọn ngay trên thẻ và trang gói. Không tạo thêm trang tỉnh/phường chỉ đổi tên địa danh. Đường dẫn gói không phụ thuộc nhóm để khi admin chuyển nhóm, liên kết gói vẫn giữ nguyên. Không dùng các slug danh mục (`tv360`, `camera`…) cho một gói riêng.

- Website xuất HTML từ server, có liên kết từ trang chủ đến từng gói.
- `/robots.txt` cho phép website công khai, chặn crawl `/admin` và `/api/`. Robots không phải cơ chế bảo mật; quyền truy cập vẫn do ứng dụng kiểm tra.
- `/sitemap.xml` tự liệt kê trang chủ, danh mục Internet, các nhóm có gói đang bán và từng gói; lấy ngày cập nhật từ dữ liệu gói.
- Trang chủ có title, description và canonical về `/`. Trang gói có canonical về đường dẫn không chứa bộ chọn giá `?khu-vuc=...`.
- Tiêu đề gói mặc định nêu tên và tốc độ; có thể ghi đè bằng `Tiêu đề SEO` và `Mô tả SEO` trong admin. Open Graph cung cấp tiêu đề/mô tả khi chia sẻ liên kết, không phải cam kết tăng thứ hạng.
- Khi deploy, đặt `NEXT_PUBLIC_SERVER_URL=https://viettelnet.store` và build lại để metadata/sitemap dùng domain thật.

## Khai báo với Google sau khi HTTPS hoạt động

1. Vào https://search.google.com/search-console và thêm thuộc tính **Domain**: `viettelnet.store`.
2. Google cung cấp một giá trị TXT `google-site-verification=...`. Thêm bản ghi **TXT**, tên `@`, giá trị đúng chuỗi Google cung cấp, tại nơi quản lý DNS; giữ nguyên các bản ghi A/CNAME hiện có.
3. Chờ DNS cập nhật rồi bấm **Verify**. Giữ bản ghi TXT để duy trì xác minh. Đây là xác minh Search Console, khác với Certbot cấp HTTPS.
4. Trong **Sitemaps**, gửi `https://viettelnet.store/sitemap.xml`.
5. Dùng **URL Inspection** kiểm tra trang chủ và một số trang gói quan trọng; yêu cầu lập chỉ mục nếu trang hợp lệ. Không cần gửi lại hằng ngày.
6. Theo dõi báo cáo **Page indexing** và **Performance** để biết URL đã được lập chỉ mục, truy vấn thực tế, lượt hiển thị và lượt nhấp. Dùng dữ liệu này để điều chỉnh nội dung.

Xác minh Domain qua TXT không cần thêm mã Google vào source. Không có sẵn chuỗi xác minh: phải lấy từ tài khoản Search Console của chủ website.

## Khách hàng có thể tìm bằng những cụm nào?

Đây là gợi ý nhóm nhu cầu, chưa phải số liệu nghiên cứu lượng tìm kiếm hay dự đoán xếp hạng:

| Nhu cầu tìm kiếm | Trang phù hợp / việc cần làm |
| --- | --- |
| `lắp mạng Viettel`, `đăng ký Internet Viettel`, `giá WiFi Viettel` | Trang chủ: giải thích dịch vụ, giá theo khu vực và cách đăng ký |
| `gói NETVT1 giá bao nhiêu`, `đăng ký NETVT2` | Trang gói hiện có: giá, tốc độ, thiết bị, phí, điều kiện và FAQ riêng |
| `WiFi cho nhà 3 tầng`, `gói Viettel Mesh`, `Internet kèm camera` | Trang gói phù hợp; về sau thêm trang nhóm và bài hướng dẫn chọn gói |
| `lắp mạng Viettel tại [khu vực phục vụ]` | Chỉ tạo trang khu vực khi có thông tin thực: phạm vi, đầu mối liên hệ, điều kiện kiểm tra hạ tầng và nội dung riêng |

Ưu tiên tên gói và nhu cầu cụ thể trước; các truy vấn thương hiệu rộng là mục tiêu cần theo dõi bằng dữ liệu thực tế. Không thể gán vài từ khóa rồi bảo đảm Google sẽ đưa website lên đầu.

## Nội dung cần hoàn thiện

- Với mỗi gói, trả lời rõ: ai phù hợp, giá tại đâu, thiết bị nào đi kèm, phí hòa mạng/lắp đặt, cam kết, thủ tục và cách xác nhận khả năng lắp tại địa chỉ khách.
- Trong admin, đặt title riêng, ví dụ `NETVT1: giá cước, tốc độ và đăng ký lắp đặt`. Mô tả SEO là một đoạn ngắn đúng nội dung, không nhồi lặp từ khóa. Google có thể chọn đoạn mô tả khác trên trang.
- Bổ sung thông tin đơn vị vận hành, vai trò thực tế, hotline, khu vực phục vụ và chính sách sử dụng thông tin đăng ký. Không tự nhận là website chính thức hay đại lý được ủy quyền nếu chưa có cơ sở.
- Bài hướng dẫn hữu ích có thể gồm: chọn tốc độ cho gia đình, Mesh cho nhà nhiều tầng, so sánh các gói, thủ tục đăng ký. Hiện chưa có module bài viết; đây là phần phát triển tiếp, không phải chức năng đã triển khai.
- Không tạo hàng loạt trang tỉnh/phường chỉ thay tên địa phương hoặc sao chép nội dung từ website khác để lấy thứ hạng. Mỗi trang cần có giá trị riêng cho người đọc.
- Kiểm tra trải nghiệm điện thoại, tốc độ, ảnh và form đăng ký. Đo lượt gửi form thành công để biết truy vấn nào mang lại khách hàng, thay vì chỉ nhìn thứ hạng.

## Kiểm tra trước khi gửi sitemap

```bash
curl -I https://viettelnet.store
curl --fail https://viettelnet.store/robots.txt
curl --fail https://viettelnet.store/sitemap.xml
```

Trang phải truy cập công khai qua HTTPS, không còn 503 của cấu hình Nginx tạm và không yêu cầu đăng nhập. Sitemap không được chứa localhost hoặc tên miền khác. Hiện Nginx chỉ cấu hình HTTPS cho domain chính; nếu muốn phục vụ `www`, cần cấp chứng chỉ có `www` rồi cấu hình chuyển hướng về domain chính.

Nguồn: [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Search Console verification](https://support.google.com/webmasters/answer/9008080), [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies).
