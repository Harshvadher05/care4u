export const ROLE = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type RoleType = typeof ROLE[keyof typeof ROLE];

export const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"
] as const;

export type DayType = typeof DAYS[number];

export const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
