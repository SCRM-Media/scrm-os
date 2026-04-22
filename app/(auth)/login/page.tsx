import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from './login-button'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/clients')

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--sidebar))]">
      <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-sm flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="text-2xl font-bold tracking-tight text-gray-900">SCRM OS</div>
          <div className="text-sm text-gray-500">SCRM Media Operations System</div>
        </div>

        <LoginButton />

        <p className="text-xs text-gray-400 text-center">
          Access restricted to @scrmmedia.com.au accounts
        </p>
      </div>
    </div>
  )
}
