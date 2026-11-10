'use client'

import React from 'react'
import {
  HardHat,
  Calculator,
  Compass,
  UserCheck
} from 'lucide-react'

export interface JobTitleItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  glowColor: string
}

export const JOB_TITLES: JobTitleItem[] = [
  {
    id: 'pm',
    title: 'Project Manager',
    icon: UserCheck,
    gradient: 'from-blue-600 to-indigo-600',
    glowColor: 'group-hover:border-blue-400 dark:group-hover:border-blue-600'
  },
  {
    id: 'estimator',
    title: 'Estimators',
    icon: Calculator,
    gradient: 'from-amber-500 to-orange-600',
    glowColor: 'group-hover:border-amber-400 dark:group-hover:border-amber-600'
  },
  {
    id: 'precon',
    title: 'Pre-construction Manager',
    icon: HardHat,
    gradient: 'from-indigo-500 to-purple-600',
    glowColor: 'group-hover:border-indigo-400 dark:group-hover:border-indigo-600'
  },
  {
    id: 'engineer',
    title: 'Project Engineer',
    icon: Compass,
    gradient: 'from-cyan-500 to-blue-600',
    glowColor: 'group-hover:border-cyan-400 dark:group-hover:border-cyan-600'
  }
]

export function TargetedPersonasCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-auto py-2">
      {JOB_TITLES.map((job) => (
        <div
          key={job.id}
          className={`group relative flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 ${job.glowColor}`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Gradient Icon Badge */}
            <div
              className={`grid size-11 place-items-center rounded-xl bg-gradient-to-br ${job.gradient} text-white shadow-md shrink-0`}
            >
              <job.icon className="size-5" />
            </div>

            {/* Title */}
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug truncate">
              {job.title}
            </h4>
          </div>

          {/* Active Target Indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
