'use client'

import React, { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  LayoutGrid,
  PieChart as PieIcon,
  TrendingUp,
  Target,
  Sparkles,
  Zap,
  Info
} from 'lucide-react'

export interface TargetIndustryData {
  name: string
  priority: number
  color: string
  focusWeight: number // % of outreach effort
  tier: string
  role: string
}

export const TARGET_INDUSTRIES: TargetIndustryData[] = [
  {
    name: 'Electrical',
    priority: 1,
    color: '#1D4ED8',
    focusWeight: 35,
    tier: 'Tier 1 · Primary Core',
    role: 'High-velocity executive & MEP coordination outreach'
  },
  {
    name: 'Mechanical',
    priority: 2,
    color: '#D97706',
    focusWeight: 25,
    tier: 'Tier 2 · Growth Pillar',
    role: 'Engineering leadership & commercial HVAC bidding'
  },
  {
    name: 'Business Development',
    priority: 3,
    color: '#059669',
    focusWeight: 20,
    tier: 'Tier 3 · Strategic Expansion',
    role: 'Fractional advisory, corporate scaling & partnerships'
  },
  {
    name: 'General Contracting',
    priority: 4,
    color: '#7C3AED',
    focusWeight: 12,
    tier: 'Tier 4 · Selective Pipeline',
    role: 'Tier-1 general contractor project management'
  },
  {
    name: 'Plumbing & Piping',
    priority: 5,
    color: '#0284C7',
    focusWeight: 8,
    tier: 'Tier 5 · Specialized Niche',
    role: 'Targeted specialized sub-trade accounts'
  }
]

export function IndustryPriorityCharts() {
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'charts' | 'cards'>('charts')

  // Prepare chart data (sorted by priority 1 to 5)
  const chartData = [...TARGET_INDUSTRIES].sort((a, b) => a.priority - b.priority)

  return (
    <div className="flex flex-col gap-5">
      {/* View Switcher & Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <BarChart3 className="size-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Strategic Industry Priority Allocation
            </span>
            <span className="ml-2 text-[11px] text-slate-400">
              Interactive Campaign Weight & Effort Distribution
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/80 p-0.5 dark:border-slate-800 dark:bg-slate-900">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setViewMode('charts')}
            className={`h-7 px-2.5 text-xs font-semibold gap-1.5 transition-all ${
              viewMode === 'charts'
                ? 'bg-white text-[#0B1F5C] shadow-2xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <BarChart3 className="size-3.5" />
            Charts & Graphs
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setViewMode('cards')}
            className={`h-7 px-2.5 text-xs font-semibold gap-1.5 transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-[#0B1F5C] shadow-2xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <LayoutGrid className="size-3.5" />
            Cards
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: CHARTS & GRAPHS VIEW (Default Fancy Presentation)
      ───────────────────────────────────────────────────────────── */}
      {viewMode === 'charts' ? (
        <div className="flex flex-col gap-6">
          {/* Dual Charts Grid: Horizontal Bar Chart + Donut Pie Chart */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
            {/* Chart 1: Horizontal Priority Weight Ranking (lg:col-span-7) */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/40 p-4 shadow-2xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 lg:col-span-7">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Target className="size-3.5 text-blue-600" />
                    Priority Ranking vs. Outreach Weight (%)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hover bars to inspect campaign depth and strategic focus
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200 dark:border-slate-700">
                  Ranked #1 to #5
                </Badge>
              </div>

              {/* Bar Chart Container */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 8, right: 30, left: 30, bottom: 8 }}
                    onMouseMove={(state) => {
                      if (state && state.activeLabel) {
                        setHoveredIndustry(state.activeLabel as string)
                      }
                    }}
                    onMouseLeave={() => setHoveredIndustry(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                    <XAxis
                      type="number"
                      domain={[0, 40]}
                      tickFormatter={(val) => `${val}%`}
                      tick={{ fontSize: 10, fill: '#94a3b8' }}
                      stroke="#cbd5e1"
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#0B1F5C' }}
                      stroke="#94a3b8"
                      width={130}
                    />
                    <RechartsTooltip
                      cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null
                        const data = payload[0].payload as TargetIndustryData
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/95">
                            <div className="flex items-center gap-2">
                              <span
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {data.name}
                              </span>
                              <Badge
                                className="text-[10px] font-extrabold px-1.5 py-0 shadow-xs"
                                style={{ backgroundColor: data.color, color: '#ffffff' }}
                              >
                                Priority {data.priority}
                              </Badge>
                            </div>
                            <div className="mt-1.5 flex items-center justify-between gap-4 text-[11px]">
                              <span className="text-slate-500">Outreach Focus:</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {data.focusWeight}% of Total Effort
                              </span>
                            </div>
                            <div className="mt-0.5 text-[10px] font-medium text-slate-400">
                              {data.tier}
                            </div>
                            <div className="mt-1 border-t border-slate-100 pt-1 text-[10px] text-slate-500 dark:border-slate-800">
                              {data.role}
                            </div>
                          </div>
                        )
                      }}
                    />
                    <Bar
                      dataKey="focusWeight"
                      radius={[0, 8, 8, 0]}
                      animationDuration={700}
                    >
                      {chartData.map((entry) => {
                        const isHovered = hoveredIndustry === entry.name
                        return (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                            opacity={hoveredIndustry ? (isHovered ? 1 : 0.45) : 0.92}
                            className="transition-opacity duration-200 cursor-pointer"
                          />
                        )
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Footnote */}
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800">
                <span>Priority 1 represents top campaign resource concentration</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Cumulative Focus: 100%
                </span>
              </div>
            </div>

            {/* Chart 2: Donut Breakdown & Effort Share (lg:col-span-5) */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/40 p-4 shadow-2xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 lg:col-span-5">
              <div className="mb-1 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <PieIcon className="size-3.5 text-emerald-600" />
                    Effort Distribution (%)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Target portfolio balance across verticals
                  </p>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                  100% Total
                </Badge>
              </div>

              {/* Donut Chart with Centered Metric */}
              <div className="relative flex items-center justify-center h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="focusWeight"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={82}
                      paddingAngle={3}
                      onMouseEnter={(_, index) => {
                        setHoveredIndustry(chartData[index]?.name || null)
                      }}
                      onMouseLeave={() => setHoveredIndustry(null)}
                    >
                      {chartData.map((entry) => {
                        const isHovered = hoveredIndustry === entry.name
                        return (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                            stroke={isHovered ? '#ffffff' : 'transparent'}
                            strokeWidth={2}
                            opacity={hoveredIndustry ? (isHovered ? 1 : 0.45) : 0.92}
                            className="transition-all duration-200 cursor-pointer"
                          />
                        )
                      })}
                    </Pie>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null
                        const data = payload[0].payload as TargetIndustryData
                        return (
                          <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/95">
                            <div className="flex items-center gap-2">
                              <span
                                className="size-2 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              <span className="text-xs font-bold text-slate-900 dark:text-white">
                                {data.name}
                              </span>
                            </div>
                            <div className="mt-1 text-xs font-extrabold text-[#0B1F5C] dark:text-blue-300">
                              {data.focusWeight}% of Total Effort · Priority #{data.priority}
                            </div>
                          </div>
                        )
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center Label */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-black text-[#0B1F5C] dark:text-white">
                    {hoveredIndustry
                      ? `${chartData.find((c) => c.name === hoveredIndustry)?.focusWeight}%`
                      : '5'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {hoveredIndustry ? 'Outreach' : 'Verticals'}
                  </span>
                </div>
              </div>

              {/* Interactive Legend List */}
              <div className="mt-2 flex flex-col gap-1.5 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                {chartData.map((ind) => {
                  const isHovered = hoveredIndustry === ind.name
                  return (
                    <div
                      key={ind.name}
                      onMouseEnter={() => setHoveredIndustry(ind.name)}
                      onMouseLeave={() => setHoveredIndustry(null)}
                      className={`flex items-center justify-between rounded-lg px-2 py-1 text-xs transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-slate-100 font-bold dark:bg-slate-800 scale-[1.01]'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: ind.color }}
                        />
                        <span className="truncate">{ind.name}</span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          (P{ind.priority})
                        </span>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {ind.focusWeight}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Continuous Multi-Color Priority Spectrum Ribbon */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-500" />
                Portfolio Campaign Spectrum
              </span>
              <span className="text-[11px] text-slate-400">
                Segmented by priority weight
              </span>
            </div>

            {/* Segmented Ribbon */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              {chartData.map((ind) => (
                <div
                  key={ind.name}
                  style={{
                    width: `${ind.focusWeight}%`,
                    backgroundColor: ind.color
                  }}
                  className={`h-full transition-opacity cursor-pointer ${
                    hoveredIndustry && hoveredIndustry !== ind.name ? 'opacity-40' : 'opacity-100'
                  }`}
                  onMouseEnter={() => setHoveredIndustry(ind.name)}
                  onMouseLeave={() => setHoveredIndustry(null)}
                  title={`${ind.name}: ${ind.focusWeight}% (Priority ${ind.priority})`}
                />
              ))}
            </div>

            {/* Spectrum Labels */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              {chartData.map((ind) => (
                <div
                  key={ind.name}
                  onMouseEnter={() => setHoveredIndustry(ind.name)}
                  onMouseLeave={() => setHoveredIndustry(null)}
                  className={`flex items-center gap-1.5 cursor-pointer transition-all ${
                    hoveredIndustry === ind.name ? 'font-bold scale-105' : 'text-slate-500'
                  }`}
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: ind.color }} />
                  <span>{ind.name}:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{ind.focusWeight}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            VIEW 2: MINIMAL CARDS VIEW (Clean 5-Column Grid)
        ───────────────────────────────────────────────────────────── */
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {chartData.map((ind) => (
            <div
              key={ind.name}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-blue-300 hover:shadow-xs transition dark:border-slate-800 dark:bg-slate-900/60 min-h-[96px]"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="size-2.5 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: ind.color }}
                />
                <Badge
                  className="text-[10px] font-extrabold px-2 py-0.5 shadow-xs"
                  style={{ backgroundColor: ind.color, color: '#ffffff' }}
                >
                  Priority {ind.priority}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {ind.name}
                </h4>
                <div className="mt-1 text-[11px] font-medium text-slate-500">
                  {ind.focusWeight}% Target Outreach Focus
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
