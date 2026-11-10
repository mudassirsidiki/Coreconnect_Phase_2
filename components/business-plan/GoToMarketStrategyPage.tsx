'use client'

import React, { useState } from 'react'
import { UsaMap, TARGET_REGIONS, type TargetRegion } from './gtm/UsaMap'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  FileText,
  Briefcase,
  Printer
} from 'lucide-react'

interface GoToMarketStrategyPageProps {
  onBackToDashboard?: () => void
}

export function GoToMarketStrategyPage({ onBackToDashboard }: GoToMarketStrategyPageProps) {
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6 print:m-0 print:p-0">
      {/* ─────────────────────────────────────────────────────────────
          EXECUTIVE PAGE HEADER
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6 print:border-none print:shadow-none print:p-0">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFC000]">
              Account Business Plan
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Badge className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C] text-[10px] font-bold dark:bg-blue-600">
              Company: C-Suite
            </Badge>
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-[10px] font-semibold gap-1">
              <CheckCircle2 className="size-3" />
              Strategy Active & Deployed
            </Badge>
          </div>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-[#0B1F5C] dark:text-white sm:text-3xl">
            Go-To-Market Strategy
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500 dark:text-slate-400">
            Tailored Go-To-Market blueprint, offering catalog, and prioritized geographic territory allocation for <strong className="text-slate-700 dark:text-slate-200">C-Suite</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs text-slate-700 hover:text-slate-900 dark:text-slate-300"
          >
            <Printer className="size-3.5" />
            Print / PDF
          </Button>

          {onBackToDashboard && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBackToDashboard}
              className="gap-1.5 text-xs text-[#0B1F5C] hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="size-3.5" />
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: PRODUCT / SERVICES (Company: C-Suite)
      ───────────────────────────────────────────────────────────── */}
      <Card className="border-slate-200/90 shadow-xs dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-[#0B1F5C] text-sm font-bold text-white shadow-xs dark:bg-blue-600">
                1
              </span>
              <div>
                <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                  Products / Services
                </CardTitle>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Target client offering profile and verified collateral asset readiness for <strong className="font-semibold text-slate-700 dark:text-slate-300">C-Suite</strong>.
                </p>
              </div>
            </div>

            {/* Collaterals - Yes Badge */}
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 px-3 py-1 text-xs font-bold gap-1.5 shadow-xs">
                <FileCheck className="size-4" />
                Collaterals – Yes
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 flex flex-col gap-5">
          {/* Products & Services Grid */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <Briefcase className="size-3.5 text-[#0B1F5C] dark:text-blue-400" />
              Active Offerings & Advisory Solutions
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {/* Product 1 */}
              <div className="flex items-center justify-center rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-blue-300 hover:shadow-xs transition dark:border-slate-800 dark:bg-slate-900/60 text-center">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Executive Strategy & Fractional Leadership
                </h4>
              </div>

              {/* Product 2 */}
              <div className="flex items-center justify-center rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-blue-300 hover:shadow-xs transition dark:border-slate-800 dark:bg-slate-900/60 text-center">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Revenue Operations & GTM Architecture
                </h4>
              </div>

              {/* Product 3 */}
              <div className="flex items-center justify-center rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-blue-300 hover:shadow-xs transition dark:border-slate-800 dark:bg-slate-900/60 text-center">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Board Governance, Compliance & Advisory
                </h4>
              </div>
            </div>
          </div>

          {/* Collaterals Details Callout */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="grid size-6 place-items-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="size-3.5" />
                </div>
                <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                  Collaterals Status: Verified Available (Yes)
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                4 Active Asset Packages Ready for Sales Engagement
              </span>
            </div>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200/70 bg-white p-2.5 text-xs font-medium text-slate-800 shadow-2xs dark:border-emerald-900/40 dark:bg-slate-900 dark:text-slate-200">
                <FileText className="size-4 text-emerald-600 shrink-0" />
                <span className="truncate">C-Suite Capabilities Deck (PDF)</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200/70 bg-white p-2.5 text-xs font-medium text-slate-800 shadow-2xs dark:border-emerald-900/40 dark:bg-slate-900 dark:text-slate-200">
                <FileText className="size-4 text-emerald-600 shrink-0" />
                <span className="truncate">GTM Framework & Playbook</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200/70 bg-white p-2.5 text-xs font-medium text-slate-800 shadow-2xs dark:border-emerald-900/40 dark:bg-slate-900 dark:text-slate-200">
                <FileText className="size-4 text-emerald-600 shrink-0" />
                <span className="truncate">Enterprise Case Studies Portfolio</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200/70 bg-white p-2.5 text-xs font-medium text-slate-800 shadow-2xs dark:border-emerald-900/40 dark:bg-slate-900 dark:text-slate-200">
                <FileText className="size-4 text-emerald-600 shrink-0" />
                <span className="truncate">Executive Engagement MSA Template</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: GEOGRAPHICAL LOCATIONS (Map + Prioritized Legend)
      ───────────────────────────────────────────────────────────── */}
      <Card className="border-slate-200/90 shadow-xs dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-[#0B1F5C] text-sm font-bold text-white shadow-xs dark:bg-blue-600">
                2
              </span>
              <div>
                <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                  Geographical Locations
                </CardTitle>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Target market deployment across the United States. Highlighted regions reflect prioritized sales campaigns.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-blue-300 bg-blue-50/60 text-[#0B1F5C] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-semibold">
                Country: USA
              </Badge>
              <Badge className="bg-[#FFC000] text-[#0B1F5C] hover:bg-[#FFC000] text-xs font-bold shadow-xs">
                5 Priority Clusters
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            {/* ── LEFT COLUMN: Target Locations & Priority Ranking Legend (Vertical) ── */}
            <div className="flex flex-col gap-3 lg:col-span-5 xl:col-span-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#0B1F5C] dark:text-white">
                    Target Locations & Priority Ranking Legend
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-semibold text-slate-500 border-slate-200 dark:border-slate-700">
                    5 Hubs
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  Hover or inspect each prioritized territory to highlight its coverage on the map.
                </p>
              </div>

              {/* 5 Location Legend Cards (Vertical Stack) */}
              <div className="flex flex-col gap-2.5">
                {TARGET_REGIONS.map((region) => {
                  const isSelected = activeRegionId === region.id
                  return (
                    <div
                      key={region.id}
                      onMouseEnter={() => setActiveRegionId(region.id)}
                      onMouseLeave={() => setActiveRegionId(null)}
                      className={`relative flex flex-col justify-between rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-md scale-[1.01] dark:border-white dark:bg-slate-800'
                          : 'border-slate-200/90 bg-white hover:border-slate-400 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900/70'
                      }`}
                    >
                      <div>
                        {/* Priority Pill & Color Dot */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="size-2.5 rounded-full shrink-0 shadow-2xs"
                              style={{ backgroundColor: region.color }}
                            />
                            <span className="text-[11px] font-bold text-slate-500">
                              Rank #{region.priority}
                            </span>
                          </div>

                          <Badge
                            className="text-[10px] font-extrabold px-1.5 py-0 shadow-xs"
                            style={{ backgroundColor: region.color, color: '#ffffff' }}
                          >
                            Priority {region.priority}
                          </Badge>
                        </div>

                        {/* Location Name */}
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {region.name}
                        </h4>

                        {/* Description */}
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {region.description}
                        </p>
                      </div>

                      {/* Metros & Coverage */}
                      <div className="mt-2.5 border-t border-slate-100 pt-2 text-[10px] dark:border-slate-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Target Metros:
                        </span>{' '}
                        <span className="text-slate-500 dark:text-slate-400" title={region.metroHubs}>
                          {region.metroHubs}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── RIGHT COLUMN: Visual Interactive USA Map ── */}
            <div className="lg:col-span-7 xl:col-span-8">
              <UsaMap
                activeRegionId={activeRegionId}
                onHoverRegion={setActiveRegionId}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
