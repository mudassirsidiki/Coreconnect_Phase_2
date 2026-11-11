'use client'

import React, { useState } from 'react'
import {
  HardHat,
  Calculator,
  Compass,
  UserCheck,
  Target,
  BarChart3
} from 'lucide-react'
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

export interface JobTitlePriority {
  id: string
  title: string
  shortTitle: string
  priority: number
  focusWeight: number
  color: string
  gradient: string
  glowColor: string
  icon: React.ComponentType<{ className?: string }>
  arcRadius: number
  arcCircumference: number
  arcPercent: number
}

// 4 Concentric Rings Geometry (ViewBox: 220 x 220, Center: 110, 110)
export const JOB_TITLE_PRIORITIES: JobTitlePriority[] = [
  {
    id: 'pm',
    title: 'Project Manager',
    shortTitle: 'Project Mgr',
    priority: 1,
    focusWeight: 40,
    color: '#1D4ED8',
    gradient: 'from-blue-600 to-indigo-600',
    glowColor: 'group-hover:border-blue-400 dark:group-hover:border-blue-600',
    icon: UserCheck,
    arcRadius: 92,
    arcCircumference: 2 * Math.PI * 92,
    arcPercent: 0.88
  },
  {
    id: 'estimator',
    title: 'Estimators',
    shortTitle: 'Estimators',
    priority: 2,
    focusWeight: 30,
    color: '#D97706',
    gradient: 'from-amber-500 to-orange-600',
    glowColor: 'group-hover:border-amber-400 dark:group-hover:border-amber-600',
    icon: Calculator,
    arcRadius: 74,
    arcCircumference: 2 * Math.PI * 74,
    arcPercent: 0.72
  },
  {
    id: 'precon',
    title: 'Pre-construction Manager',
    shortTitle: 'Pre-con Mgr',
    priority: 3,
    focusWeight: 20,
    color: '#7C3AED',
    gradient: 'from-indigo-500 to-purple-600',
    glowColor: 'group-hover:border-indigo-400 dark:group-hover:border-indigo-600',
    icon: HardHat,
    arcRadius: 56,
    arcCircumference: 2 * Math.PI * 56,
    arcPercent: 0.54
  },
  {
    id: 'engineer',
    title: 'Project Engineer',
    shortTitle: 'Project Eng',
    priority: 4,
    focusWeight: 10,
    color: '#0284C7',
    gradient: 'from-cyan-500 to-blue-600',
    glowColor: 'group-hover:border-cyan-400 dark:group-hover:border-cyan-600',
    icon: Compass,
    arcRadius: 38,
    arcCircumference: 2 * Math.PI * 38,
    arcPercent: 0.36
  }
]

export function TargetedPersonasCard() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'gauge' | 'chart'>('gauge')

  const hoveredJob = JOB_TITLE_PRIORITIES.find((j) => j.id === hoveredId)
  const chartData = [...JOB_TITLE_PRIORITIES].sort((a, b) => a.priority - b.priority)

  return (
    <div className="flex flex-col justify-between h-full gap-4">
      {/* ── TOP CONTROLLER: VIEW TOGGLE ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Active Priority Distribution
          </span>
        </div>

        {/* View Switcher: Target Gauge vs Priority Chart */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('gauge')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === 'gauge'
                ? 'bg-white text-[#0B1F5C] shadow-2xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Target className="size-3.5" />
            Target Gauge
          </button>
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === 'chart'
                ? 'bg-white text-[#0B1F5C] shadow-2xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="size-3.5" />
            Priority Chart
          </button>
        </div>
      </div>

      {/* ── MODE 1: CONCENTRIC TARGET GAUGE + PRIORITY CARDS ── */}
      {viewMode === 'gauge' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto py-1">
          {/* Left: Concentric Target Arc Radar Graphic */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative size-[210px] shrink-0">
              <svg viewBox="0 0 220 220" className="size-full">
                {/* Background Track Rings */}
                {JOB_TITLE_PRIORITIES.map((job) => (
                  <circle
                    key={`bg-${job.id}`}
                    cx="110"
                    cy="110"
                    r={job.arcRadius}
                    fill="none"
                    stroke="#f1f5f9"
                    className="dark:stroke-slate-800"
                    strokeWidth="8.5"
                  />
                ))}

                {/* Active Colored Arcs */}
                {JOB_TITLE_PRIORITIES.map((job) => {
                  const isHovered = hoveredId === job.id
                  const offset = job.arcCircumference * (1 - job.arcPercent)
                  return (
                    <circle
                      key={`arc-${job.id}`}
                      cx="110"
                      cy="110"
                      r={job.arcRadius}
                      fill="none"
                      stroke={job.color}
                      strokeWidth={isHovered ? 11.5 : 8.5}
                      strokeDasharray={job.arcCircumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      transform="rotate(-90 110 110)"
                      opacity={hoveredId ? (isHovered ? 1 : 0.35) : 0.95}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredId(job.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    />
                  )
                })}
              </svg>

              {/* Center Bullseye Hub */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <div className="size-16 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center px-1">
                  {hoveredJob ? (
                    <>
                      <span
                        className="text-[11px] font-black uppercase tracking-wider"
                        style={{ color: hoveredJob.color }}
                      >
                        P{hoveredJob.priority}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                        {hoveredJob.focusWeight}%
                      </span>
                    </>
                  ) : (
                    <>
                      <Target className="size-4 text-[#0B1F5C] dark:text-blue-400 mb-0.5" />
                      <span className="text-[9px] font-extrabold uppercase tracking-tight text-slate-500 dark:text-slate-400 leading-none">
                        4 Tiers
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: 4 Job Title Priority Cards */}
          <div className="md:col-span-7 flex flex-col gap-2">
            {JOB_TITLE_PRIORITIES.map((job) => {
              const isHovered = hoveredId === job.id
              return (
                <div
                  key={job.id}
                  onMouseEnter={() => setHoveredId(job.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group flex items-center justify-between gap-3 rounded-xl border p-2.5 transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? 'border-blue-400 bg-blue-50/25 shadow-md scale-[1.01] dark:border-blue-700 dark:bg-blue-950/20'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs dark:border-slate-800 dark:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`grid size-8 place-items-center rounded-lg bg-gradient-to-br ${job.gradient} text-white shadow-2xs shrink-0`}
                    >
                      <job.icon className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">Focus Weight:</span>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          {job.focusWeight}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    className="text-[11px] font-extrabold px-2 py-0.5 shrink-0 shadow-2xs"
                    style={{ backgroundColor: job.color, color: '#ffffff' }}
                  >
                    Priority {job.priority}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── MODE 2: RECHARTS PRIORITY COLUMN BAR CHART ── */}
      {viewMode === 'chart' && (
        <div className="h-64 w-full my-auto py-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 15, left: -10, bottom: 5 }}
              onMouseMove={(state) => {
                if (state && state.activePayload && state.activePayload.length) {
                  setHoveredId((state.activePayload[0].payload as JobTitlePriority).id)
                }
              }}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis
                dataKey="shortTitle"
                tick={{ fontSize: 11, fontWeight: 700, fill: '#0B1F5C' }}
                stroke="#94a3b8"
              />
              <YAxis
                domain={[0, 48]}
                tickFormatter={(val) => `${val}%`}
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                stroke="#cbd5e1"
              />
              <RechartsTooltip
                cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  const data = payload[0].payload as JobTitlePriority
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 shadow-xl backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/95">
                      <div className="flex items-center gap-2">
                        <span className="size-3 rounded-full" style={{ backgroundColor: data.color }} />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {data.title}
                        </span>
                        <Badge
                          className="text-xs font-extrabold px-2 py-0.5"
                          style={{ backgroundColor: data.color, color: '#ffffff' }}
                        >
                          Priority {data.priority}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs font-bold text-[#0B1F5C] dark:text-blue-300">
                        Campaign Focus: {data.focusWeight}% of Total Effort
                      </div>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey="focusWeight"
                radius={[8, 8, 0, 0]}
                animationDuration={700}
                label={{
                  position: 'top',
                  fill: '#0B1F5C',
                  fontSize: 11,
                  fontWeight: 700,
                  formatter: (val: any) => `${val}%`
                }}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={entry.color}
                    opacity={hoveredId ? (hoveredId === entry.id ? 1 : 0.45) : 0.92}
                    className="transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── FOOTNOTE (Matches Section 3 & 4) ── */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>Priority 1 represents top campaign resource concentration</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Cumulative Focus: 100%
        </span>
      </div>
    </div>
  )
}
