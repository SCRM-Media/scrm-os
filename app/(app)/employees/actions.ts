'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { EmployeeRole, EmployeeRegion } from '@/types/database'

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.enum([
    'Social Media Manager', 'Editor', 'Content Creator',
    'Marketing Manager', 'Operations Manager', 'Founder',
  ] as [EmployeeRole, ...EmployeeRole[]]),
  region: z.enum([
    'Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Newcastle',
  ] as [EmployeeRegion, ...EmployeeRegion[]]),
  email: z.string().email('Invalid email').or(z.literal('')).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>

export async function createEmployee(data: EmployeeFormData) {
  const parsed = employeeSchema.parse(data)
  const supabase = await createClient()
  const { error } = await supabase.from('employees').insert({
    ...parsed,
    email: parsed.email || null,
    phone: parsed.phone || null,
    address: parsed.address || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/employees')
}

export async function updateEmployee(id: string, data: EmployeeFormData) {
  const parsed = employeeSchema.parse(data)
  const supabase = await createClient()
  const { error } = await supabase
    .from('employees')
    .update({
      ...parsed,
      email: parsed.email || null,
      phone: parsed.phone || null,
      address: parsed.address || null,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/employees')
}

export async function deactivateEmployee(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('employees')
    .update({ is_active: false })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/employees')
}
