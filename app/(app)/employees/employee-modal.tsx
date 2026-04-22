'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { createEmployee, updateEmployee, type EmployeeFormData } from './actions'
import type { Employee, EmployeeRole, EmployeeRegion } from '@/types/database'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.enum([
    'Social Media Manager', 'Editor', 'Content Creator',
    'Marketing Manager', 'Operations Manager', 'Founder',
  ] as [EmployeeRole, ...EmployeeRole[]]),
  region: z.enum([
    'Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Newcastle',
  ] as [EmployeeRegion, ...EmployeeRegion[]]),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

const ROLES: EmployeeRole[] = [
  'Social Media Manager', 'Editor', 'Content Creator',
  'Marketing Manager', 'Operations Manager', 'Founder',
]

const REGIONS: EmployeeRegion[] = [
  'Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Newcastle',
]

interface Props {
  open: boolean
  onClose: () => void
  employee?: Employee
}

export default function EmployeeModal({ open, onClose, employee }: Props) {
  const isEdit = !!employee

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } =
    useForm<EmployeeFormData>({
      resolver: zodResolver(schema),
      defaultValues: employee
        ? {
            name: employee.name,
            role: employee.role,
            region: employee.region,
            email: employee.email ?? '',
            phone: employee.phone ?? '',
            address: employee.address ?? '',
          }
        : { name: '', email: '', phone: '', address: '' },
    })

  async function onSubmit(data: EmployeeFormData) {
    try {
      if (isEdit) {
        await updateEmployee(employee.id, data)
        toast.success('Employee updated')
      } else {
        await createEmployee(data)
        toast.success('Employee added')
      }
      reset()
      onClose()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" {...register('name')} placeholder="Jane Smith" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Role *</Label>
              <Select
                value={watch('role')}
                onValueChange={(v) => setValue('role', v as EmployeeRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Region *</Label>
              <Select
                value={watch('region')}
                onValueChange={(v) => setValue('region', v as EmployeeRegion)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-xs text-destructive">{errors.region.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="jane@scrmmedia.com.au" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} placeholder="+61 400 000 000" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Full Address</Label>
            <Input id="address" {...register('address')} placeholder="123 Main St, Melbourne VIC" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose() }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
