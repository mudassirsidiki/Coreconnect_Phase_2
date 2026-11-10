'use client'

import React, { useState } from 'react'
import { UsaMap, TARGET_REGIONS, type TargetRegion } from './gtm/UsaMap'
import {
  TargetedIndustriesChart,
  CompanySizeBrackets
} from './gtm/IndustryPriorityCharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  FileText,
  Briefcase,
  Printer,
  UserCheck,
  Calculator,
  HardHat,
  Compass,
  Mail,
  PhoneCall
} from 'lucide-react'

const TARGET_JOB_TITLES = [
  {
    title: 'Project Manager',
    category: 'Operations & Execution Lead',
    icon: UserCheck
  },
  {
    title: 'Estimators',
    category: 'Cost Estimation & Commercial Bidding',
    icon: Calculator
  },
  {
    title: 'Pre-construction Manager',
    category: 'Pre-construction Planning & Strategy',
    icon: HardHat
  },
  {
    title: 'Project Engineer',
    category: 'Technical Engineering & MEP Coordination',
    icon: Compass
  }
]

const OUTREACH_CHANNELS = [
  {
    name: 'Email',
    description: 'Personalized multi-touch cold & warm email cadences',
    icon: Mail,
    bgColor: '#EFF6FF',
    iconColor: '#1D4ED8'
  },
  {
    name: 'LinkedIn',
    description: 'Executive InMail, connection requests & social touchpoints',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53c0-.85-.68-1.54-1.53-1.54-.85 0-1.54.69-1.54 1.54 0 .85.69 1.53 1.54 1.53m1.39 9.97v-8.37H5.07v8.37h2.78Z" />
      </svg>
    ),
    bgColor: '#F0F9FF',
    iconColor: '#0284C7'
  },
  {
    name: 'Calls',
    description: 'Direct discovery calls, qualification & follow-up cadences',
    icon: PhoneCall,
    bgColor: '#F5F3FF',
    iconColor: '#7C3AED'
  }
]

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

              {/* 5 Location Legend Items (Clean: Color Dot, Location Name & Priority) */}
              <div className="flex flex-col gap-2.5">
                {TARGET_REGIONS.map((region) => {
                  const isSelected = activeRegionId === region.id
                  return (
                    <div
                      key={region.id}
                      onMouseEnter={() => setActiveRegionId(region.id)}
                      onMouseLeave={() => setActiveRegionId(null)}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50 shadow-md scale-[1.01] dark:border-white dark:bg-slate-800'
                          : 'border-slate-200/90 bg-white hover:border-slate-400 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="size-3 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: region.color }}
                        />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {region.name}
                        </h4>
                      </div>

                      <Badge
                        className="text-[10px] font-extrabold px-2 py-0.5 shrink-0 shadow-xs"
                        style={{ backgroundColor: region.color, color: '#ffffff' }}
                      >
                        Priority {region.priority}
                      </Badge>
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

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3 & 4: TARGETED INDUSTRIES & COMPANY SIZE
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
        {/* ── SECTION 3: TARGETED INDUSTRIES WITH PRIORITIES ── */}
        <Card className="border-slate-200/90 shadow-xs dark:border-slate-800 flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#0B1F5C] text-sm font-bold text-white shadow-xs dark:bg-blue-600">
                  3
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                    Targeted Industries with Priorities
                  </CardTitle>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Prioritized industry sectors and domain verticals for client engagement.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C] text-xs font-bold dark:bg-blue-600">
                  5 Verticals
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 flex flex-col justify-between flex-1">
            <TargetedIndustriesChart />
          </CardContent>
        </Card>

        {/* ── SECTION 4: COMPANY SIZE — NUMBER OF EMPLOYEES ── */}
        <Card className="border-slate-200/90 shadow-xs dark:border-slate-800 flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#0B1F5C] text-sm font-bold text-white shadow-xs dark:bg-blue-600">
                  4
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                    Company Size — Number of Employees
                  </CardTitle>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Target account headcount brackets ranked by strategic priority.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C] text-xs font-bold dark:bg-blue-600">
                  5 Priorities
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 flex flex-col justify-between flex-1">
            <CompanySizeBrackets />
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5 & 6: TARGETED JOB TITLES & OUTREACH STRATEGY
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
        {/* ── SECTION 5: TARGETED JOB TITLES ── */}
        <Card className="border-slate-200/90 shadow-xs dark:border-slate-800 flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#0B1F5C] text-sm font-bold text-white shadow-xs dark:bg-blue-600">
                  5
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                    Targeted Job Titles
                  </CardTitle>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Key decision-maker and influencer personas targeted across active campaigns.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C] text-xs font-bold dark:bg-blue-600">
                  4 Focus Personas
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
            {/* 4 Job Titles Grid (No Priorities) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto py-1">
              {TARGET_JOB_TITLES.map((job) => (
                <div
                  key={job.title}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-blue-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0B1F5C] dark:bg-blue-950/60 dark:text-blue-300">
                    <job.icon className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {job.title}
                    </h4>
                    <span className="text-[11px] font-medium text-slate-400">
                      {job.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footnote */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span>Verified decision-maker roles in active account targeting</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Persona Coverage: 100%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ── SECTION 6: OUTREACH STRATEGY ── */}
        <Card className="border-slate-200/90 shadow-xs dark:border-slate-800 flex flex-col justify-between">
          <CardHeader className="border-b border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-[#0B1F5C] text-sm font-bold text-white shadow-xs dark:bg-blue-600">
                  6
                </span>
                <div>
                  <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                    Outreach Strategy
                  </CardTitle>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Coordinated multi-touch engagement channels for pipeline acceleration.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C] text-xs font-bold dark:bg-blue-600">
                  3 Active Channels
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
            {/* 3 Channels */}
            <div className="flex flex-col gap-2.5 my-auto py-1">
              {OUTREACH_CHANNELS.map((ch) => (
                <div
                  key={ch.name}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs transition-all hover:border-blue-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg shadow-2xs"
                      style={{ backgroundColor: ch.bgColor, color: ch.iconColor }}
                    >
                      <ch.icon className="size-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {ch.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {ch.description}
                      </p>
                    </div>
                  </div>

                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-50 text-[11px] font-bold gap-1.5 shrink-0 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </Badge>
                </div>
              ))}
            </div>

            {/* Footnote */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span>Multi-touch cadence sequence (Email + Social + Voice)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Touchpoints: Omnichannel
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
