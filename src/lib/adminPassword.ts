export function validateAdminPassword(value: unknown): true | string {
  if (typeof value !== 'string' || value.length < 8 || value.length > 128 || !value.trim()) {
    return 'Mật khẩu phải có từ 8 đến 128 ký tự và không được chỉ chứa khoảng trắng.'
  }
  return true
}
