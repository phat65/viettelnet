export const money = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
export const categoryLabels = { internet: 'Internet', tv360: 'Internet + TV360', camera: 'Internet + Camera' } as const
export const regionLabels = { metro: 'Hà Nội & TP.HCM', other: 'Tỉnh / thành khác' } as const
export type Region = keyof typeof regionLabels
