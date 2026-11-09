'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Activity } from 'lucide-react'

interface AccountManagementActivitiesPageProps {
  onBackToDashboard?: () => void
}

export function AccountManagementActivitiesPage({ onBackToDashboard }: AccountManagementActivitiesPageProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[.18em] text-[#b18400]">
            Account Business Plan
          </div>
          <h2 className="mt-1 text-2xl font-bold text-[#0B1F5C] dark:text-white">
            Account Management Activities
          </h2>
        </div>
        {onBackToDashboard && (
          <Button variant="outline" size="sm" onClick={onBackToDashboard} className="text-xs">
            <ArrowLeft className="mr-1 size-3.5" />
            Back to Dashboard
          </Button>
        )}
      </div>

      {/* Blank Workspace Ready for Next Instructions */}
      <div className="min-h-[460px] rounded-xl border border-dashed border-slate-300 bg-white/40 p-8 flex flex-col items-center justify-center text-center dark:border-slate-800 dark:bg-slate-900/40">
        <div className="size-12 rounded-full bg-blue-50 flex items-center justify-center dark:bg-slate-800 mb-3 text-[#0B1F5C] dark:text-[#FFC000]">
          <Activity className="size-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Account Management Activities
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          Workspace created and ready for configuration.
        </p>
      </div>
    </div>
  )
}
