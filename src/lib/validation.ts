import { z } from 'zod'
import { resolveLocation } from '@/lib/locations'

export const consultationSchema = z.object({
  name: z.string().trim().max(100, 'Họ tên quá dài.'),
  phone: z.string().trim().transform((value) => value.replace(/[\s().-]/g, '').replace(/^\+84/, '0'))
    .pipe(z.string().regex(/^0[35789]\d{8}$/, 'Nhập số điện thoại di động hợp lệ.')),
  addressLine: z.string().trim().min(3, 'Nhập số nhà, tên đường hoặc thôn/xóm.').max(250, 'Địa chỉ quá dài.'),
  provinceCode: z.string().regex(/^\d{1,2}$/, 'Chọn tỉnh/thành phố.'),
  wardCode: z.string().regex(/^\d{1,5}$/, 'Chọn phường/xã.'),
  packageId: z.string().regex(/^\d*$/, 'Gói cước không hợp lệ.').transform((value) => value ? Number(value) : undefined)
    .pipe(z.number().int().positive().safe().optional()),
  customerNote: z.string().trim().max(1000, 'Ghi chú tối đa 1.000 ký tự.'),
}).superRefine((value, ctx) => {
  if (!resolveLocation(value.provinceCode, value.wardCode)) {
    ctx.addIssue({ code: 'custom', path: ['wardCode'], message: 'Phường/xã không thuộc tỉnh/thành phố đã chọn. Vui lòng chọn lại.' })
  }
})

export type ConsultationState = { success: boolean; message: string }
