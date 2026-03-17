export const BOOKING_STATUS = {
  pending: '001',
  assigned: '002',
  rejected: '003',
  completed: '004',
  cancelled: '005',
} as const;

export const TRIP_TYPE_TEMPLATES = {
  internal: 'ในจังหวัด.docx',
  external: 'ต่างจังหวัด.docx',
} as const;

export type TripType = keyof typeof TRIP_TYPE_TEMPLATES;

export function isTripType(value: string): value is TripType {
  return value === 'internal' || value === 'external';
}
