'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import EmployeeModal from './employee-modal'
import { getInitials, getRoleColor } from '@/lib/utils'
import type { Employee, EmployeeRole, EmployeeRegion } from '@/types/database'

const REGIONS: Array<'All' | EmployeeRegion> = [
  'All', 'Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Newcastle',
]

const ROLES: Array<'All Roles' | EmployeeRole> = [
  'All Roles', 'Social Media Manager', 'Editor', 'Content Creator',
  'Marketing Manager', 'Operations Manager', 'Founder',
]

interface Props {
  employees: Employee[]
  canEdit: boolean
}

export default function EmployeesClient({ employees, canEdit }: Props) {
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState<string>('All')
  const [roleFilter, setRoleFilter] = useState<string>('All Roles')
  const [modalOpen, setModalOpen] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | undefined>()

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.email ?? '').toLowerCase().includes(search.toLowerCase())
      const matchRegion = regionFilter === 'All' || e.region === regionFilter
      const matchRole = roleFilter === 'All Roles' || e.role === roleFilter
      return matchSearch && matchRegion && matchRole
    })
  }, [employees, search, regionFilter, roleFilter])

  const byRegion = useMemo(() => {
    const order: EmployeeRegion[] = ['Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Newcastle']
    return order
      .map((region) => ({
        region,
        employees: filtered.filter((e) => e.region === region),
      }))
      .filter(({ employees }) => employees.length > 0)
  }, [filtered])

  function openAdd() {
    setEditEmployee(undefined)
    setModalOpen(true)
  }

  function openEdit(emp: Employee) {
    setEditEmployee(emp)
    setModalOpen(true)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {employees.length} team member{employees.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canEdit && (
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grouped by region */}
      {byRegion.length === 0 ? (
        <p className="text-muted-foreground text-sm">No team members match your filters.</p>
      ) : (
        <div className="space-y-8">
          {byRegion.map(({ region, employees: regionEmps }) => (
            <div key={region}>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                {region} ({regionEmps.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {regionEmps.map((emp) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    canEdit={canEdit}
                    onEdit={() => openEdit(emp)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employee={editEmployee}
      />
    </div>
  )
}

function EmployeeCard({
  employee,
  canEdit,
  onEdit,
}: {
  employee: Employee
  canEdit: boolean
  onEdit: () => void
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors group relative">
      {canEdit && (
        <button
          onClick={onEdit}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-gray-100"
          title="Edit employee"
        >
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full ${getRoleColor(employee.role)} flex items-center justify-center text-white text-sm font-semibold shrink-0`}
        >
          {getInitials(employee.name)}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">{employee.name}</p>
          <Badge variant="secondary" className="text-[10px] mt-0.5 py-0">
            {employee.role}
          </Badge>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {employee.email && (
          <p className="text-xs text-muted-foreground truncate">{employee.email}</p>
        )}
        {employee.phone && (
          <p className="text-xs text-muted-foreground">{employee.phone}</p>
        )}
        {employee.address && (
          <p className="text-xs text-muted-foreground truncate">{employee.address}</p>
        )}
      </div>
    </div>
  )
}
