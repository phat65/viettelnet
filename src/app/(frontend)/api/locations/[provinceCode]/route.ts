import { getWards } from '@/lib/locations'

export async function GET(_request: Request, { params }: { params: Promise<{ provinceCode: string }> }) {
  const { provinceCode } = await params
  if (!/^\d{1,2}$/.test(provinceCode)) return Response.json({ message: 'Tỉnh/thành không hợp lệ.' }, { status: 400 })
  const wards = getWards(provinceCode)
  if (!wards.length) return Response.json({ message: 'Không tìm thấy tỉnh/thành.' }, { status: 404 })
  return Response.json(wards, { headers: { 'Cache-Control': 'public, max-age=3600' } })
}
