'use client'

import { useActionState, useEffect, useId, useState } from 'react'
import { submitConsultation } from '@/actions/submitConsultation'
import { Icon } from '@/components/ui/Icon'
import provinces from '@/data/locations/provinces.json'

type Ward = { code: string; name: string }

export function ConsultationForm({ packageId, packageName, onClose }: {
  packageId?: number; packageName?: string; onClose: () => void
}) {
  const formId = useId()
  const [state, action, pending] = useActionState(submitConsultation, { success: false, message: '' })
  const [province, setProvince] = useState('')
  const [ward, setWard] = useState('')
  const [wards, setWards] = useState<Ward[]>([])
  const [loading, setLoading] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!province) return
    const controller = new AbortController()
    setLoading(true)
    setLocationError('')
    fetch(`/api/locations/${province}`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Location request failed')
        const data: Ward[] = await response.json()
        if (!controller.signal.aborted) setWards(data)
      })
      .catch(() => {
        if (!controller.signal.aborted) setLocationError('Chưa tải được phường/xã. Vui lòng thử lại.')
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [province, retry])

  if (state.success) return <div className="registration-success" role="status">
    <span className="registration-success-icon"><Icon name="check" width="28" height="28" /></span>
    <h3>Đã nhận đăng ký của bạn!</h3><p>{state.message}</p>
    <button type="button" className="button" onClick={onClose}>Hoàn tất</button>
  </div>

  return <form action={action} className="consultation-form registration-form">
    <p className="registration-intro">Nhập thông tin để chúng tôi tư vấn và kiểm tra khả năng lắp đặt tại nhà bạn.</p>
    {packageName && <p className="registration-package">Gói quan tâm: <strong>{packageName}</strong></p>}
    <input type="hidden" name="packageId" value={packageId || ''} />
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="field" htmlFor={`${formId}-name`}><span className="sr-only">Họ tên</span>
      <input id={`${formId}-name`} name="name" placeholder="Nhập họ tên" autoComplete="name" maxLength={100} autoFocus />
    </label>
    <label className="field" htmlFor={`${formId}-phone`}><span className="sr-only">Số điện thoại *</span>
      <input id={`${formId}-phone`} name="phone" type="tel" placeholder="Nhập số điện thoại *" autoComplete="tel" required maxLength={20} />
    </label>
    <label className="field" htmlFor={`${formId}-province`}><span className="sr-only">Tỉnh / thành phố *</span>
      <select id={`${formId}-province`} name="provinceCode" required value={province} autoComplete="address-level1"
        onChange={event => { setProvince(event.target.value); setWard(''); setWards([]); setLocationError(''); setLoading(Boolean(event.target.value)) }}>
        <option value="" disabled>Chọn tỉnh/thành phố *</option>
        {provinces.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
      </select>
    </label>
    <label className="field" htmlFor={`${formId}-ward`}><span className="sr-only">Phường / xã *</span>
      <select id={`${formId}-ward`} name="wardCode" required value={ward} autoComplete="address-level2"
        disabled={!province || loading || !!locationError} onChange={event => setWard(event.target.value)} aria-describedby={locationError ? `${formId}-location-error` : undefined}>
        <option value="" disabled>{loading ? 'Đang tải phường/xã…' : !province ? 'Chọn tỉnh/thành phố trước' : 'Chọn phường/xã *'}</option>
        {wards.map(item => <option key={item.code} value={item.code}>{item.name}</option>)}
      </select>
    </label>
    {locationError && <p role="alert" id={`${formId}-location-error`}>{locationError} <button type="button" className="location-retry" onClick={() => setRetry(value => value + 1)}>Thử lại</button></p>}
    <label className="field" htmlFor={`${formId}-address`}><span className="sr-only">Địa chỉ cụ thể *</span>
      <input id={`${formId}-address`} name="addressLine" placeholder="Số nhà, tên đường / thôn, xóm *" required minLength={3} maxLength={250} autoComplete="street-address" />
    </label>
    <p className="registration-privacy">Thông tin chỉ dùng để liên hệ tư vấn và hỗ trợ đăng ký.</p>
    {state.message && <p role="alert">{state.message}</p>}
    <div className="registration-actions">
      <button type="button" className="button button--secondary" onClick={onClose}>Đóng</button>
      <button type="submit" className="button" disabled={pending || loading || !ward || !!locationError}>{pending ? 'Đang gửi…' : 'Xác nhận'}</button>
    </div>
  </form>
}
