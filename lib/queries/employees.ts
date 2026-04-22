import { createClient } from '@/lib/supabase/server'
import type { Employee, EmployeeRegion, EmployeeRole } from '@/types/database'

export async function getEmployees(): Promise<Employee[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data
}

export type EmployeesByRegion = Record<EmployeeRegion, Employee[]>

export function groupByRegion(employees: Employee[]): EmployeesByRegion {
  const grouped: EmployeesByRegion = {
    Melbourne: [],
    Sydney: [],
    Brisbane: [],
    Perth: [],
    Newcastle: [],
  }
  for (const emp of employees) {
    grouped[emp.region].push(emp)
  }
  return grouped
}
