// Catalog supplied in seccondmove.md. Imported once by a data migration.
// A later catalog change must have a new migration so existing installations update too.
export const catalogGroups = [
  { id: 'offers', label: 'Ưu đãi', title: 'Gói cước ưu đãi sốc', description: 'Internet, truyền hình và camera trong một kết nối. Thêm tiện ích, trọn trải nghiệm.', icon: 'sparkles' },
  { id: 'individual', label: 'Internet', title: 'Gói cước cá nhân siêu tiết kiệm', description: 'Kết nối mượt mà cho không gian sống gọn, vừa đủ cho nhu cầu của bạn.', icon: 'wifi' },
  { id: 'entertainment', label: 'TV360', title: 'Gói cước truyền hình giải trí đa nền tảng', description: 'Mang cả thế giới giải trí đến phòng khách với truyền hình TV360.', icon: 'tv' },
  { id: 'camera', label: 'Camera', title: 'Gói cước Camera gia đình an tâm', description: 'Gắn kết cả gia đình bằng sự chăm sóc và giám sát dịu dàng.', icon: 'camera' },
  { id: 'mesh', label: 'Nhà cao tầng', title: 'Gói cước toàn diện cho nhà cao tầng', description: 'Đảm bảo kết nối mạnh mẽ tại từng góc ngôi nhà, ngay cả trong nhiều căn phòng.', icon: 'home' },
  { id: 'ultra', label: 'Ultra Speed', title: 'Gói cước Ultra Speed', description: 'Bứt phá giới hạn tốc độ với đường truyền đến 1Gbps cho công việc, giải trí và streaming.', icon: 'bolt' },
] as const

export type CatalogGroup = typeof catalogGroups[number]['id']
type CatalogEntry = {
  name: string; slug: string; group: CatalogGroup; category: 'internet' | 'tv360' | 'camera'
  speed: number; price: number; equipment: string[]; description: string
}

export const catalog: CatalogEntry[] = [
  { name: 'NETVT01', slug: 'netvt01', group: 'offers', category: 'camera', speed: 300, price: 225000, equipment: ['1 Modem WiFi 6', '1 Camera', 'Truyền hình TV360'], description: 'Một gói kết nối cho cả gia đình: Internet 300Mbps, camera quan sát và truyền hình TV360. Phù hợp khi bạn muốn kết hợp kết nối, giải trí và chăm sóc tổ ấm.' },
  { name: 'MESHVT01', slug: 'meshvt01', group: 'offers', category: 'camera', speed: 300, price: 240000, equipment: ['1 Modem WiFi 6', '1 Mesh WiFi', '1 Camera', 'Truyền hình TV360'], description: 'Trọn bộ Internet, camera và truyền hình, cùng một thiết bị Mesh mở rộng vùng phủ. Dành cho gia đình cần kết nối ở nhiều phòng mà vẫn muốn các tiện ích trong cùng gói.' },
  { name: 'NETVT1', slug: 'netvt1', group: 'individual', category: 'internet', speed: 300, price: 195000, equipment: ['1 Modem WiFi 6'], description: 'Kết nối Internet 300Mbps cho những nhu cầu mỗi ngày: làm việc từ xa, học trực tuyến và xem phim. Một lựa chọn gọn gàng với modem WiFi 6 đi kèm.' },
  { name: 'NETVT2', slug: 'netvt2', group: 'individual', category: 'internet', speed: 500, price: 240000, equipment: ['1 Modem WiFi 6'], description: 'Internet 500Mbps dành cho nhu cầu sử dụng nhiều thiết bị và truyền tải dữ liệu thường xuyên. Kết nối công việc và giải trí với modem WiFi 6.' },
  { name: 'MESHVT1', slug: 'meshvt1', group: 'individual', category: 'internet', speed: 300, price: 210000, equipment: ['1 Modem WiFi 6', '1 Mesh WiFi'], description: 'Kết hợp Internet 300Mbps với một thiết bị Mesh WiFi để mở rộng vùng phủ. Phù hợp với không gian nhiều phòng cần thêm điểm kết nối.' },
  { name: 'NETVT1_GIAITRI', slug: 'netvt1-giaitri', group: 'entertainment', category: 'tv360', speed: 300, price: 215000, equipment: ['1 Modem WiFi 6', 'Truyền hình TV360'], description: 'Internet 300Mbps kết hợp truyền hình TV360, mang lựa chọn giải trí đến phòng khách. Phù hợp với gia đình muốn sử dụng Internet và truyền hình trong cùng gói.' },
  { name: 'NETVT2_GIAITRI', slug: 'netvt2-giaitri', group: 'entertainment', category: 'tv360', speed: 500, price: 260000, equipment: ['1 Modem WiFi 6', 'Truyền hình TV360'], description: 'Kết nối 500Mbps và truyền hình TV360 cho những giờ giải trí tại nhà. Modem WiFi 6 đáp ứng nhu cầu kết nối của các thiết bị trong gia đình.' },
  { name: 'MESHVT1_GIAITRI', slug: 'meshvt1-giaitri', group: 'entertainment', category: 'tv360', speed: 300, price: 230000, equipment: ['1 Modem WiFi 6', 'Truyền hình TV360', '1 Mesh WiFi'], description: 'Internet 300Mbps, TV360 và một thiết bị Mesh: giải trí ở phòng khách, kết nối thêm ở những căn phòng khác. Một lựa chọn cho không gian sống nhiều phòng.' },
  { name: 'NETVT1_CAM1', slug: 'netvt1-cam1', group: 'camera', category: 'camera', speed: 350, price: 215000, equipment: ['1 Modem WiFi 6', '1 Camera AI'], description: 'Internet 350Mbps đi cùng camera AI để bạn quan tâm đến ngôi nhà từ xa. Kết hợp nhu cầu kết nối hàng ngày và quan sát không gian gia đình.' },
  { name: 'NETVT2_CAM1', slug: 'netvt2-cam1', group: 'camera', category: 'camera', speed: 500, price: 260000, equipment: ['1 Modem WiFi 6', '1 Camera AI'], description: 'Internet 500Mbps kết hợp camera AI. Dành cho gia đình muốn tăng tốc kết nối và có thêm thiết bị quan sát tại nhà.' },
  { name: 'MESHVT1_CAM1', slug: 'meshvt1-cam1', group: 'camera', category: 'camera', speed: 350, price: 230000, equipment: ['1 Modem WiFi 6', '1 Camera AI', '1 Mesh WiFi'], description: 'Kết nối 350Mbps, camera AI và một Mesh WiFi để mở rộng vùng phủ. Thêm điểm kết nối, thêm sự an tâm cho gia đình.' },
  { name: 'MESHVT2_CAM1', slug: 'meshvt2-cam1', group: 'camera', category: 'camera', speed: 500, price: 265000, equipment: ['1 Modem WiFi 6', '1 Camera AI', '2 Mesh WiFi'], description: 'Internet 500Mbps cùng hai thiết bị Mesh WiFi và camera AI. Phù hợp khi ngôi nhà có nhiều khu vực cần kết nối và quan sát.' },
  { name: 'MESHVT2', slug: 'meshvt2', group: 'mesh', category: 'internet', speed: 500, price: 245000, equipment: ['1 Modem WiFi 6', '2 Mesh WiFi'], description: 'Hai thiết bị Mesh mở rộng kết nối Internet 500Mbps qua nhiều phòng và tầng. Vị trí đặt thiết bị được tư vấn theo không gian thực tế của ngôi nhà.' },
  { name: 'MESHVT3', slug: 'meshvt3', group: 'mesh', category: 'tv360', speed: 500, price: 299000, equipment: ['1 Modem WiFi 6', '3 Mesh WiFi', 'Truyền hình TV360'], description: 'Internet 500Mbps với ba Mesh WiFi và truyền hình TV360. Một gói dành cho ngôi nhà nhiều tầng cần nhiều điểm phủ sóng và tiện ích giải trí.' },
  { name: 'GIGA1', slug: 'giga1', group: 'ultra', category: 'internet', speed: 1000, price: 320000, equipment: ['1 Modem WiFi 6 XGSPON'], description: 'Kết nối đến 1Gbps với modem WiFi 6 XGSPON. Dành cho nhu cầu truyền tải dữ liệu lớn, làm việc và giải trí tốc độ cao.' },
  { name: 'GIGA2', slug: 'giga2', group: 'ultra', category: 'internet', speed: 1000, price: 355000, equipment: ['1 Modem WiFi 6 XGSPON', '1 Mesh WiFi'], description: 'Tốc độ đến 1Gbps và thêm một Mesh WiFi để mở rộng vùng phủ. Kết hợp kết nối tốc độ cao với sự linh hoạt trong bố trí thiết bị.' },
  { name: 'GIGA3', slug: 'giga3', group: 'ultra', category: 'internet', speed: 1000, price: 390000, equipment: ['1 Modem WiFi 6 XGSPON', '2 Mesh WiFi'], description: 'Internet đến 1Gbps với hai thiết bị Mesh WiFi. Phù hợp với không gian nhiều phòng có nhu cầu kết nối tốc độ cao.' },
  { name: 'GIGA4', slug: 'giga4', group: 'ultra', category: 'internet', speed: 1000, price: 425000, equipment: ['1 Modem WiFi 6 XGSPON', '3 Mesh WiFi'], description: 'Gói tốc độ đến 1Gbps cùng ba thiết bị Mesh WiFi, dành cho không gian rộng và nhiều tầng. Tư vấn bố trí thiết bị theo nhu cầu thực tế.' },
]

export const catalogConditions = 'Giá giới thiệu dùng để tham khảo khi chọn gói. Giá áp dụng, phí lắp đặt, thời hạn cam kết và ưu đãi sẽ được xác nhận theo địa chỉ và thời điểm đăng ký. Tốc độ trải nghiệm phụ thuộc thiết bị, vùng phủ WiFi và điều kiện sử dụng.'
