import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const ROLE_COLORS: Record<string, string> = {
  'Social Media Manager': 'bg-blue-500',
  'Editor': 'bg-purple-500',
  'Content Creator': 'bg-orange-500',
  'Marketing Manager': 'bg-green-500',
  'Operations Manager': 'bg-red-500',
  'Founder': 'bg-gray-800',
}

export function getRoleColor(role: string): string {
  return ROLE_COLORS[role] ?? 'bg-gray-400'
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`
}

const MELBOURNE_TZ = 'Australia/Melbourne'

export function toMelbourneDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    timeZone: MELBOURNE_TZ,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
