'use client'

import React from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function CrmStrategyCard() {
  return (
    <div className="flex flex-col justify-center h-full gap-4 py-2 my-auto">
      {/* ── TOP HERO: HUBSPOT SHOWCASE ── */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 p-4 shadow-2xs dark:border-orange-950/60 dark:from-orange-950/20 dark:via-slate-900 dark:to-slate-900">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* HubSpot Gradient Icon Badge */}
          <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[#FF7A59] to-[#FF5C35] text-white shadow-md shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path d="M18.8 9.5a2.7 2.7 0 0 0-2.3-2.6V5.4a1.8 1.8 0 1 0-1.8 0v1.5a2.7 2.7 0 0 0-2.3 2.6c0 1.2.8 2.2 1.9 2.5v3.4l-2.6-1.5a1.8 1.8 0 1 0-.9 1.5l2.7 1.6a2.7 2.7 0 0 0 2.2 1.1 2.7 2.7 0 0 0 2.7-2.7v-3.4a2.7 2.7 0 0 0 2.4-2.6 2.7 2.7 0 0 0-2-2.8Zm-3.2-6.5a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6ZM9.5 15.8a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Zm6.1 3.5a1.7 1.7 0 1 1 1.7-1.7 1.7 1.7 0 0 1-1.7 1.7Zm0-6.1a1.7 1.7 0 1 1 1.7-1.7 1.7 1.7 0 0 1-1.7 1.7Z" />
            </svg>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                HubSpot
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Going to HubSpot
            </p>
          </div>
        </div>

        <Badge className="bg-[#FF7A59] text-white hover:bg-[#FF7A59] text-xs font-bold px-2.5 py-1 shrink-0 shadow-xs">
          Going to HubSpot
        </Badge>
      </div>

      {/* ── MIDDLE: CURRENT PROTOCOL DESCRIPTION ── */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0">
              <FileSpreadsheet className="size-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              (Use Excel For Now)
            </h4>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Lead tracking, prospect pipeline stages, and contact records are currently managed in standardized Excel spreadsheets prior to full HubSpot CRM integration.
        </p>
      </div>
    </div>
  )
}
