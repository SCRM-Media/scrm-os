'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users,
  Calendar,
  CalendarDays,
  Building2,
  ClipboardList,
  Package,
  Video,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/social-calendar', label: 'Social Calendar', icon: Calendar },
  { href: '/employee-calendar', label: 'Employee Calendar', icon: CalendarDays },
  { href: '/clients', label: 'Clients', icon: Building2 },
  { href: '/onboarding', label: 'Onboarding', icon: ClipboardList },
  { href: '/employees', label: 'Employees', icon: Users },
  { href: '/packages', label: 'Packages', icon: Package },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-[hsl(var(--sidebar))] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-[hsl(var(--sidebar-border))]">
        <div className="text-white font-bold text-lg tracking-tight">SCRM OS</div>
        <div className="text-[hsl(var(--sidebar-foreground))] opacity-50 text-xs mt-0.5">SCRM Media</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                active
                  ? 'bg-[hsl(var(--sidebar-accent))] text-white'
                  : 'text-[hsl(var(--sidebar-foreground))] opacity-70 hover:opacity-100 hover:bg-[hsl(var(--sidebar-accent))]'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}

        {/* Video Examples — deferred v1.1 */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[hsl(var(--sidebar-foreground))] opacity-30 cursor-not-allowed select-none">
          <Video className="w-4 h-4 shrink-0" />
          Video Examples
          <span className="ml-auto text-[10px] bg-white/10 rounded px-1.5 py-0.5">Soon</span>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[hsl(var(--sidebar-border))] space-y-1">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[hsl(var(--sidebar-foreground))] opacity-70 hover:opacity-100 hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
        <div className="px-3 text-[10px] text-[hsl(var(--sidebar-foreground))] opacity-30">v1.0</div>
      </div>
    </aside>
  )
}
