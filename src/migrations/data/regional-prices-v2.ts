// Snapshot of the public ViettelUp Internet catalog, read on 2026-10-21.
// Source: https://www.viettelup.vn/internet (internet.price: metro-other, in 1,000 VND).
// GIGA entries have one price and are offered for HN/HCM only.
export const regionalPrices: Record<string, [number, number?]> = {
  netvt01: [265000, 225000], meshvt01: [285000, 240000],
  netvt1: [235000, 195000], netvt2: [265000, 240000], meshvt1: [255000, 210000],
  'netvt1-giaitri': [255000, 215000], 'netvt2-giaitri': [285000, 260000], 'meshvt1-giaitri': [275000, 230000],
  'netvt1-cam1': [255000, 215000], 'netvt2-cam1': [285000, 260000],
  'meshvt1-cam1': [275000, 230000], 'meshvt2-cam1': [309000, 265000],
  meshvt2: [289000, 245000], meshvt3: [359000, 299000],
  giga1: [320000], giga2: [355000], giga3: [390000], giga4: [425000],
}

// Lexical document: editable prose, while the live price table comes from package fields.
export function detailArticle(name: string, description: string) {
  const text = (value: string) => ({ type: 'text', version: 1, text: value, format: 0, detail: 0, mode: 'normal', style: '' })
  const block = (type: string, value: string, tag?: string) => ({ type, version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, children: [text(value)], ...(tag ? { tag } : {}) })
  return { root: { type: 'root', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, children: [
    block('heading', `Vì sao nên chọn gói ${name}?`, 'h2'),
    block('paragraph', description),
    block('heading', `Gói ${name} phù hợp với ai?`, 'h2'),
    block('paragraph', name === 'NETVT1' ? 'Gia đình nhỏ, căn hộ diện tích vừa, có nhu cầu học tập, làm việc và giải trí hàng ngày.' : 'Chọn gói theo tốc độ, thiết bị đi kèm và diện tích sử dụng. Nhân viên sẽ tư vấn vị trí lắp modem, Mesh hoặc camera phù hợp với không gian thực tế.'),
    block('heading', 'Cách đăng ký lắp Internet Viettel', 'h2'),
    block('paragraph', 'Chọn khu vực lắp đặt, bấm Đăng ký và để lại thông tin. Bạn cũng có thể chọn một số điện thoại hoặc Zalo trên website để trao đổi trực tiếp với nhân viên tư vấn.'),
    block('heading', 'Câu hỏi thường gặp', 'h2'),
    block('heading', 'Giá cước áp dụng như thế nào?', 'h3'),
    block('paragraph', 'Bảng giá phía trên hiển thị mức cước theo khu vực đã chọn. Địa chỉ lắp đặt cụ thể và hạ tầng sẽ được xác nhận trước khi đăng ký dịch vụ.'),
    block('heading', 'Có thể hẹn lịch lắp đặt không?', 'h3'),
    block('paragraph', 'Có. Hãy ghi thời gian thuận tiện trong phần ghi chú. Nhân viên sẽ liên hệ kiểm tra hạ tầng và thống nhất lịch lắp đặt.'),
  ] } }
}
