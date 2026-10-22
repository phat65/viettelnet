'use server'

import { getCMS } from '@/lib/payload'
import { hasRecentConsultation } from '@/lib/antiSpam'
import { consultationSchema, type ConsultationState } from '@/lib/validation'
import { resolveLocation } from '@/lib/locations'

export async function submitConsultation(
  _previous: ConsultationState, formData: FormData,
): Promise<ConsultationState> {
  if (formData.get('website')) return { success: false, message: 'Không thể gửi yêu cầu này.' }
  const parsed = consultationSchema.safeParse({
    name: formData.get('name') ?? '',
    phone: formData.get('phone'),
    addressLine: formData.get('addressLine'),
    provinceCode: formData.get('provinceCode'),
    wardCode: formData.get('wardCode'),
    packageId: formData.get('packageId') ?? '',
    customerNote: formData.get('customerNote') ?? '',
  })
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message }

  try {
    const payload = await getCMS()
    const { packageId, ...fields } = parsed.data
    const location = resolveLocation(fields.provinceCode, fields.wardCode)!
    if (packageId) {
      const result = await payload.find({
        collection: 'packages', overrideAccess: false, depth: 0, limit: 1,
        where: { and: [{ id: { equals: packageId } }, { status: { equals: 'published' } }] },
      })
      const selected = result.docs[0]
      // A lead is a consultation request, including coverage inquiries where no price is listed.
      if (!selected) {
        return { success: false, message: 'Gói không còn hiển thị. Vui lòng chọn lại.' }
      }
    }
    if (await hasRecentConsultation(payload, fields.phone)) {
      return { success: false, message: 'Yêu cầu gần đây đã được tiếp nhận. Vui lòng chờ 10 phút trước khi gửi lại.' }
    }
    // Deliberate privileged write: public REST create is denied. Only validated fields are copied.
    await payload.create({
      collection: 'leads', overrideAccess: true,
      data: {
        ...fields, provinceName: location.province.name, wardName: location.ward.name,
        area: [fields.addressLine, location.ward.name, location.province.name].join(', '),
        package: packageId, status: 'new',
      },
    })
    return { success: true, message: 'Đã nhận yêu cầu. Nhân viên tư vấn sẽ liên hệ với bạn.' }
  } catch {
    // Log an operational signal without the customer's phone, address or request body.
    console.error('[consultation] Could not persist registration; check database availability and migrations.')
    return { success: false, message: 'Chưa gửi được yêu cầu. Vui lòng thử lại sau hoặc gọi hotline.' }
  }
}
