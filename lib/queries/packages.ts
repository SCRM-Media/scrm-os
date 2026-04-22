import { createClient } from '@/lib/supabase/server'
import type { Package, PackageBlock, InventoryPackage } from '@/types/database'

export type PackageWithBlocks = Package & { package_blocks: PackageBlock[] }

export async function getPackagesWithBlocks(): Promise<PackageWithBlocks[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('*, package_blocks(*)')
    .order('name')

  if (error) throw error
  return data as PackageWithBlocks[]
}

export async function getInventoryPackages(): Promise<InventoryPackage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('inventory_packages')
    .select('*')
    .order('name')

  if (error) throw error
  return data
}
