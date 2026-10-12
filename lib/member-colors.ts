/** 7 üye rengi — koyu panel (#081c16 / #102b22) ve lime vurgu ile uyumlu */
export const MEMBER_COLORS = [
  '#1c4a38', // derin orman
  '#2a4a5a', // çelik mavi-yeşil
  '#4a3a28', // sıcak toprak
  '#3a2a4a', // soluk erik
  '#2a4a2a', // kuru zeytin
  '#4a2a32', // kuru pas
  '#2a3a4a', // kömür yeşil-mavi
] as const;

export type MemberColor = (typeof MEMBER_COLORS)[number];

/** Üye ID’sine göre sabit renk (aynı kişi her zaman aynı rengi alır) */
export function colorForMember(id: string): MemberColor {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return MEMBER_COLORS[Math.abs(h) % MEMBER_COLORS.length];
}
