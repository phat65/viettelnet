// Immutable snapshot transcribed from the two price sheets supplied on 2026-10-28.
// See docs/catalog-20261028.md for discrepancies against public offers and the existing database.
type Price = { region: 'metro' | 'other'; monthlyPrice: number; activationFee?: number; installationFee?: number }
export type PhotoPackage = {
  slug: string; name: string; catalogGroup: 'ultra' | 'camera'; category: 'internet' | 'camera';
  speed: number; priceUnit: string; equipment: string[]; description: string; conditions: string; prices: Price[];
}

const confirmation = 'Giá, ưu đãi và khả năng cung cấp dịch vụ được xác nhận theo địa chỉ và thời điểm đăng ký.'
const gigaConditions = `Phí hòa mạng 500.000đ/thuê bao. Bảng giá GIGA này áp dụng tại nội thành Hà Nội và TP.HCM. Tặng 1 tháng cước khi đóng trước 12 tháng theo điều kiện chương trình. ${confirmation}`
const comboConditions = `Giá đã gồm VAT, áp dụng với 1 Camera trong nhà và Cloud lưu trữ 1 ngày. Phí hòa mạng combo 300.000đ; miễn phí lắp đặt Camera. Camera ngoài trời cộng thêm 200.000đ/camera. Nâng Cloud lên 3/7/15/30 ngày cộng lần lượt 10.000/20.000/40.000/70.000đ mỗi tháng. Bảng giá nội thành Hà Nội, TP.HCM khác ngoại thành; cần xác nhận giá theo địa chỉ cụ thể. ${confirmation}`
const bothRegions = (monthlyPrice: number, fees: Omit<Price, 'region' | 'monthlyPrice'> = {}): Price[] =>
  [{ region: 'metro', monthlyPrice, ...fees }, { region: 'other', monthlyPrice, ...fees }]

export const photoCatalog: PhotoPackage[] = [
  ...[320000, 355000, 390000, 425000].map((monthlyPrice, index): PhotoPackage => ({
    slug: `giga${index + 1}`, name: `GIGA${index + 1}`, catalogGroup: 'ultra', category: 'internet', speed: 1000, priceUnit: '/tháng',
    equipment: ['1 thiết bị WiFi công nghệ mới', ...(index ? [`${index} Mesh WiFi`] : [])],
    description: `Internet 1 Gbps cho hộ gia đình${index ? `, kèm ${index} thiết bị Mesh mở rộng vùng phủ WiFi` : ''}. Kiểm tra hạ tầng XGSPON và thiết bị theo địa chỉ lắp đặt.`,
    conditions: gigaConditions, prices: [{ region: 'metro', monthlyPrice, activationFee: 500000 }],
  })),
  ...[
    { slug: 'gigapro1', name: 'GIGAPRO1', price: 500000, international: 5, ip: 'Không kèm IP tĩnh' },
    { slug: 'gigavip1', name: 'GIGAVIP1', price: 1300000, international: 15, ip: '1 IP tĩnh' },
  ].map((entry): PhotoPackage => ({
    slug: entry.slug, name: entry.name, catalogGroup: 'ultra', category: 'internet', speed: 1000, priceUnit: '/tháng',
    equipment: ['Thiết bị WiFi công nghệ mới', `Cam kết quốc tế tối thiểu ${entry.international} Mbps`, entry.ip],
    description: `Gói Internet doanh nghiệp 1 Gbps, cam kết băng thông quốc tế tối thiểu ${entry.international} Mbps. ${entry.ip}. Phù hợp nhu cầu kết nối phục vụ công việc.`,
    conditions: gigaConditions, prices: [{ region: 'metro', monthlyPrice: entry.price, activationFee: 500000 }],
  })),
  ...[
    { slug: 'netvt1-cam1', name: 'NETVT1_CAM1', speed: 350, mesh: 0, metro: 240000, other: 200000 },
    { slug: 'netvt2-cam1', name: 'NETVT2_CAM1', speed: 500, mesh: 0, metro: 285000, other: 260000 },
    { slug: 'meshvt1-cam1', name: 'MESHVT1_CAM1', speed: 350, mesh: 1, metro: 275000, other: 230000 },
    { slug: 'meshvt2-cam1', name: 'MESHVT2_CAM1', speed: 500, mesh: 2, metro: 309000, other: 265000 },
    { slug: 'meshvt3-cam1', name: 'MESHVT3_CAM1', speed: 500, mesh: 3, metro: 379000, other: 319000 },
  ].map((entry): PhotoPackage => ({
    slug: entry.slug, name: entry.name, catalogGroup: 'camera', category: 'camera', speed: entry.speed, priceUnit: '/tháng',
    equipment: ['1 Modem WiFi 6', '1 Camera trong nhà', 'Cloud lưu trữ 1 ngày', ...(entry.mesh ? [`${entry.mesh} Mesh WiFi`] : [])],
    description: `Internet ${entry.speed === 500 ? 'tối thiểu 500 Mbps, tối đa lên tới 1 Gbps' : '350 Mbps'} kèm Camera và Cloud lưu trữ 1 ngày${entry.mesh ? `, cùng ${entry.mesh} Mesh WiFi` : ''}. Dành cho khách hàng hòa mạng mới Internet và Camera Viettel.`,
    conditions: comboConditions,
    prices: [{ region: 'metro', monthlyPrice: entry.metro, activationFee: 300000, installationFee: 0 }, { region: 'other', monthlyPrice: entry.other, activationFee: 300000, installationFee: 0 }],
  })),
  ...[
    { days: 1, indoor: 580000, outdoor: 780000 }, { days: 3, indoor: 700000, outdoor: 900000 },
    { days: 7, indoor: 820000, outdoor: 1020000 }, { days: 15, indoor: 1060000, outdoor: 1260000 },
    { days: 30, indoor: 1420000, outdoor: 1620000 },
  ].flatMap((entry): PhotoPackage[] => (['indoor', 'outdoor'] as const).map((kind) => {
    const place = kind === 'indoor' ? 'trong nhà' : 'ngoài trời'
    return {
      slug: `camera-${kind === 'indoor' ? 'trong-nha' : 'ngoai-troi'}-cloud-${entry.days}-ngay`,
      name: `Camera ${place} Cloud ${entry.days} ngày`, catalogGroup: 'camera', category: 'camera', speed: 0, priceUnit: '/bộ',
      equipment: [`1 Camera ${place}`, `12 tháng Cloud lưu trữ ${entry.days} ngày`],
      description: `Bộ Camera ${place} kèm 12 tháng sử dụng Cloud. Xem lại video trong ${entry.days} ngày gần nhất qua Viettel Home; dùng trên Internet mọi nhà mạng.`,
      conditions: `Giá trọn bộ thiết bị và 12 tháng Cloud, đã gồm VAT. Bảo hành thiết bị 12 tháng kể từ khi kích hoạt trên Viettel Home. Hết thời hạn Cloud có thể mua thêm gói lưu trữ; không cam kết nhà mạng Internet. ${confirmation}`,
      prices: bothRegions(entry[kind]),
    }
  })),
  ...[
    { days: 1, price: 20000, fee: 300000 }, { days: 3, price: 30000, fee: 300000 },
    { days: 7, price: 40000, fee: 300000 }, { days: 15, price: 60000, fee: 180000 }, { days: 30, price: 90000, fee: 180000 },
  ].map((entry): PhotoPackage => ({
    slug: `cloud-camera-${entry.days}-ngay`, name: `Cloud Camera ${entry.days} ngày`, catalogGroup: 'camera', category: 'camera', speed: 0, priceUnit: '/tháng/camera',
    equipment: ['1 Camera trong nhà', `Cloud lưu trữ ${entry.days} ngày`, 'Miễn phí lắp đặt Camera'],
    description: `Gói Camera bổ sung cho khách hàng đang dùng Internet Viettel. Xem lại video trong ${entry.days} ngày gần nhất trên Viettel Home. Giá tính theo tháng cho mỗi Camera.`,
    conditions: `Giá đã gồm VAT. Phí hòa mạng áp dụng với Camera trong nhà; chọn Camera ngoài trời cộng thêm 200.000đ/camera. Cộng thêm 50 Mbps băng thông mỗi Camera, tối đa 2 Camera. Bảo hành thiết bị trong thời gian sử dụng dịch vụ, bảo trì 24/7 theo điều kiện chương trình. ${confirmation}`,
    prices: bothRegions(entry.price, { activationFee: entry.fee, installationFee: 0 }),
  })),
]
