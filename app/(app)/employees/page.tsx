import { getEmployees } from '@/lib/queries/employees'
import { createClient } from '@/lib/supabase/server'
import EmployeesClient from './employees-client'

export default async function EmployeesPage() {
  const [employees, supabase] = await Promise.all([
    getEmployees(),
    createClient(),
  ])

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const canEdit = profile?.role === 'admin' || profile?.role === 'manager'

  return <EmployeesClient employees={employees} canEdit={canEdit} />
}
