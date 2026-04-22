import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/clients'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const service = createServiceClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      // Upsert profile — handles both new users and re-logins
      const { error: upsertError } = await service
        .from('user_profiles')
        .upsert(
          {
            id: data.user.id,
            email: data.user.email!,
            display_name:
              (data.user.user_metadata?.full_name as string) ?? data.user.email!,
            role: 'viewer',
          },
          { onConflict: 'id', ignoreDuplicates: true }
        )

      if (upsertError) {
        console.error('[callback] profile upsert error:', upsertError)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
