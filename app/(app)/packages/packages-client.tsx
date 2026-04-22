'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { formatDuration, formatCurrency } from '@/lib/utils'
import type { PackageWithBlocks } from '@/lib/queries/packages'
import type { InventoryPackage } from '@/types/database'

const REPEAT_LABEL: Record<string, string> = {
  Weekly: 'Weekly',
  Fortnightly: 'Fortnightly',
  'Monthly Week 0': 'Monthly (Week 1)',
  'Monthly Week 1': 'Monthly (Week 2)',
  Monthly: 'Monthly',
  None: 'One-off',
}

const SYSTEM_PACKAGES = ['Minimum', 'Momentum', 'Dominate', 'Partner']

interface Props {
  packages: PackageWithBlocks[]
  inventoryPackages: InventoryPackage[]
}

export default function PackagesClient({ packages, inventoryPackages }: Props) {
  const socialPackages = packages.filter((p) => p.name !== '__add_ons_config__')
  const systemPkgs = socialPackages.filter((p) => SYSTEM_PACKAGES.includes(p.name))
  const customPkgs = socialPackages.filter((p) => !SYSTEM_PACKAGES.includes(p.name))

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Define block types, durations, and add-on configurations
        </p>
      </div>

      <Tabs defaultValue="social">
        <TabsList>
          <TabsTrigger value="social">Social Packages</TabsTrigger>
          <TabsTrigger value="addons">Add-Ons</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="mt-6 space-y-3">
          {systemPkgs.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">System Packages</p>
              {systemPkgs.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} isSystem />
              ))}
            </div>
          )}

          {customPkgs.length > 0 && (
            <div className="space-y-3 mt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Custom Packages</p>
              {customPkgs.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} isSystem={false} />
              ))}
            </div>
          )}

          {socialPackages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No packages yet. Run the data migration to populate packages.
            </div>
          )}
        </TabsContent>

        <TabsContent value="addons" className="mt-6 space-y-4">
          {/* CarBee */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <h3 className="font-semibold text-gray-900">CarBee Filming</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Rate and session duration are configured per-client in the CarBee tab.
              Session duration auto-calculates from cars per session ÷ production rate.
            </p>
          </div>

          {/* Inventory Photography Packages */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <h3 className="font-semibold text-gray-900">Inventory Photography Packages</h3>
            </div>

            {inventoryPackages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No inventory packages yet. Run the data migration to populate.
              </p>
            ) : (
              <div className="space-y-3">
                {inventoryPackages.map((ip) => (
                  <div key={ip.id} className="flex items-start justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{ip.name}</p>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        {ip.cars_per_hour && <span>{ip.cars_per_hour} cars/hr (photos)</span>}
                        {ip.cars_per_hour_video && <span>{ip.cars_per_hour_video} cars/hr (video)</span>}
                        {ip.photos_per_car && <span>{ip.photos_per_car} photos/car</span>}
                      </div>
                      {ip.notes && <p className="text-xs text-muted-foreground mt-1">{ip.notes}</p>}
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      {ip.price_per_car && (
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(ip.price_per_car)}/car
                        </p>
                      )}
                      {ip.includes_video_default && (
                        <Badge variant="secondary" className="text-[10px]">Includes video</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PackageCard({ pkg, isSystem }: { pkg: PackageWithBlocks; isSystem: boolean }) {
  const [open, setOpen] = useState(false)
  const blockCount = pkg.package_blocks.length

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          {open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          <span className="font-semibold text-gray-900">{pkg.name}</span>
          {isSystem && (
            <Badge variant="secondary" className="text-[10px]">System</Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {pkg.base_price && (
            <span>{formatCurrency(pkg.base_price)}/mo</span>
          )}
          <span>{blockCount} block{blockCount !== 1 ? 's' : ''}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {blockCount === 0 ? (
            <p className="px-5 py-3 text-sm text-muted-foreground">No blocks defined.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Block Type</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Duration</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {pkg.package_blocks.map((block) => (
                  <tr key={block.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-800">{block.block_type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDuration(block.duration_minutes)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{REPEAT_LABEL[block.repeat_frequency] ?? block.repeat_frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
