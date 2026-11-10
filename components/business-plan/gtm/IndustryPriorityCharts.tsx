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
  Cell
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Target, Users } from 'lucide-react'

export interface TargetIndustryData {
  name: string
  priority: number
  color: string
  focusWeight: number
}

export const TARGET_INDUSTRIES: TargetIndustryData[] = [
  { name: 'Electrical', priority: 1, color: '#1D4ED8', focusWeight: 35 },
  { name: 'Mechanical', priority: 2, color: '#D97706', focusWeight: 25 },
  { name: 'Business Development', priority: 3, color: '#059669', focusWeight: 20 },
  { name: 'General Contracting', priority: 4, color: '#7C3AED', focusWeight: 12 },
  { name: 'Plumbing & Piping', priority: 5, color: '#0284C7', focusWeight: 8 }
]

export interface CompanySizeBracket {
  range: string
  priority: number
  color: string
  label: string
  meterWidth: number
}

export const COMPANY_SIZE_BRACKETS: CompanySizeBracket[] = [
  { range: '2-50', priority: 1, color: '#1D4ED8', label: 'Boutique & SME', meterWidth: 95 },
  { range: '51-100', priority: 2, color: '#D97706', label: 'Emerging Mid-Market', meterWidth: 78 },
  { range: '101-500', priority: 3, color: '#059669', label: 'Upper Mid-Market', meterWidth: 60 },
  { range: '501-1000', priority: 4, color: '#7C3AED', label: 'Enterprise', meterWidth: 42 },
  { range: '1000+', priority: 5, color: '#0284C7', label: 'Large Corporate', meterWidth: 25 }
]

export function IndustryPriorityCharts() {
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null)
  const chartData = [...TARGET_INDUSTRIES].sort((a, b) => a.priority - b.priority)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
      {/* ── LEFT: TARGETED INDUSTRIES (BAR CHART) ── */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/40 p-5 shadow-2xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Target className="size-4 text-blue-600" />
              Targeted Industries with Priorities
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Priority ranking and outreach weight allocation by vertical
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold text-slate-600 border-slate-300 dark:border-slate-700 dark:text-slate-300">
            Priority 1–5
          </Badge>
        </div>

        {/* Bar Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 35, left: 10, bottom: 8 }}
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
                domain={[0, 42]}
                tickFormatter={(val) => `${val}%`}
                tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                stroke="#cbd5e1"
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 13, fontWeight: 700, fill: '#0B1F5C' }}
                stroke="#94a3b8"
                width={160}
              />
              <RechartsTooltip
                cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  const data = payload[0].payload as TargetIndustryData
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 shadow-xl backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/95">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-3 rounded-full"
                          style={{ backgroundColor: data.color }}
                        />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {data.name}
                        </span>
                        <Badge
                          className="text-xs font-extrabold px-2 py-0.5 shadow-xs"
                          style={{ backgroundColor: data.color, color: '#ffffff' }}
                        >
                          Priority {data.priority}
                        </Badge>
                      </div>
                      <div className="mt-1.5 text-xs font-bold text-[#0B1F5C] dark:text-blue-300">
                        Campaign Focus: {data.focusWeight}% of Total Effort
                      </div>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey="focusWeight"
                radius={[0, 8, 8, 0]}
                animationDuration={700}
                label={{
                  position: 'right',
                  fill: '#0B1F5C',
                  fontSize: 12,
                  fontWeight: 700,
                  formatter: (val: any) => `${val}%`
                }}
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

        {/* Footnote */}
        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>Priority 1 represents top campaign resource concentration</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Cumulative Focus: 100%
          </span>
        </div>
      </div>

      {/* ── RIGHT: COMPANY SIZE — NUMBER OF EMPLOYEES ── */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/40 p-5 shadow-2xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="size-4 text-blue-600" />
              Company Size — Number of Employees
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Target account headcount brackets ranked by strategic priority
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold text-slate-600 border-slate-300 dark:border-slate-700 dark:text-slate-300">
            5 Priorities
          </Badge>
        </div>

        {/* 5 Priority Headcount Brackets */}
        <div className="flex flex-col gap-2.5 my-auto py-1">
          {COMPANY_SIZE_BRACKETS.map((bracket) => (
            <div
              key={bracket.range}
              className="group flex flex-col gap-1.5 rounded-lg border border-slate-200/80 bg-white p-3 transition-all hover:border-slate-400 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-3 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: bracket.color }}
                  />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {bracket.range}
                  </span>
                  <span className="text-xs text-slate-500">
                    employees
                  </span>
                  <span className="text-xs font-medium text-slate-400 hidden sm:inline">
                    · {bracket.label}
                  </span>
                </div>

                <Badge
                  className="text-xs font-extrabold px-2.5 py-0.5 shadow-xs"
                  style={{ backgroundColor: bracket.color, color: '#ffffff' }}
                >
                  Priority {bracket.priority}
                </Badge>
              </div>

              {/* Priority Visual Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-300 group-hover:brightness-110"
                  style={{
                    width: `${bracket.meterWidth}%`,
                    backgroundColor: bracket.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>Priority 1 targets highest agility & decision-making velocity</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Headcount: 2 to 1000+
          </span>
        </div>
      </div>
    </div>
  )
}
