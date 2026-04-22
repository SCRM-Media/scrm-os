import { getPackagesWithBlocks, getInventoryPackages } from '@/lib/queries/packages'
import PackagesClient from './packages-client'

export default async function PackagesPage() {
  const [packages, inventoryPackages] = await Promise.all([
    getPackagesWithBlocks(),
    getInventoryPackages(),
  ])

  return <PackagesClient packages={packages} inventoryPackages={inventoryPackages} />
}
