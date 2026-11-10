'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  HardHat,
  Calculator,
  Compass,
  UserCheck,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react'

export interface PersonaItem {
  id: string
  title: string
  phase: string
  phaseNum: number
  roleBadge: string
  roleBadgeColor: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  focusArea: string
  valueProp: string
}

export const TARGET_PERSONAS: PersonaItem[] = [
  {
    id: 'precon',
    title: 'Pre-construction Manager',
    phase: 'Phase 1 · Project Initiation',
    phaseNum: 1,
    roleBadge: 'Strategic Sponsor',
    roleBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    icon: HardHat,
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    focusArea: 'Pre-con Planning & Scope Alignment',
    valueProp: 'Constructability reviews & BIM clash avoidance'
  },
  {
    id: 'estimator',
    title: 'Estimators',
    phase: 'Phase 2 · Commercial Bidding',
    phaseNum: 2,
    roleBadge: 'Commercial Gatekeeper',
    roleBadgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    icon: Calculator,
    iconBg: 'bg-amber-50 dark:bg-amber-950/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    focusArea: 'Quantity Takeoffs & Cost Modeling',
    valueProp: 'Accelerates bid modeling and secures contractor margin'
  },
  {
    id: 'engineer',
    title: 'Project Engineer',
    phase: 'Phase 3 · Technical Coordination',
    phaseNum: 3,
    roleBadge: 'Technical Evaluator',
    roleBadgeColor: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    icon: Compass,
    iconBg: 'bg-sky-50 dark:bg-sky-950/60',
    iconColor: 'text-sky-600 dark:text-sky-400',
    focusArea: 'MEP Framing & Submittal Approvals',
    valueProp: 'Eliminates field RFIs via automated 3D modeling'
  },
  {
    id: 'pm',
    title: 'Project Manager',
    phase: 'Phase 4 · Field Execution',
    phaseNum: 4,
    roleBadge: 'Operational Decision Maker',
    roleBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    icon: UserCheck,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    focusArea: 'Schedule Milestones & Final Sign-off',
    valueProp: 'Ensures on-time handover without rework or delay'
  }
]

export function TargetedPersonasCard() {
  const [activePersona, setActivePersona] = useState<string | null>(null)

  return (
    <div className="flex flex-col justify-between h-full gap-4">
      {/* ── TOP: Buying Committee Lifecycle Progression Bar ── */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="size-3 text-blue-600" />
            Buying Committee Lifecycle Flow
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Sequential Decision Path
          </span>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-4 gap-1.5 items-center">
          {TARGET_PERSONAS.map((p, idx) => {
            const isHovered = activePersona === p.id
            return (
              <div
                key={p.id}
                onMouseEnter={() => setActivePersona(p.id)}
                onMouseLeave={() => setActivePersona(null)}
                className={`flex flex-col items-center justify-center rounded-lg p-1.5 text-center transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-white shadow-xs font-bold scale-[1.03] dark:bg-slate-800'
                    : 'bg-white/60 hover:bg-white dark:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  <span className="grid size-4 place-items-center rounded-full bg-slate-200 text-[9px] font-extrabold text-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{p.title.split(' ')[0]}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 4 PERSONA CARDS (2x2 Grid) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto py-1">
        {TARGET_PERSONAS.map((persona) => {
          const isHovered = activePersona === persona.id
          return (
            <div
              key={persona.id}
              onMouseEnter={() => setActivePersona(persona.id)}
              onMouseLeave={() => setActivePersona(null)}
              className={`group flex flex-col justify-between rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                isHovered
                  ? 'border-blue-400 bg-blue-50/20 shadow-md scale-[1.01] dark:border-blue-700 dark:bg-blue-950/20'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs dark:border-slate-800 dark:bg-slate-900/60'
              }`}
            >
              <div>
                {/* Persona Header: Icon + Title + Phase */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`grid size-9 place-items-center rounded-lg ${persona.iconBg} ${persona.iconColor} shrink-0 shadow-2xs`}>
                      <persona.icon className="size-4.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug truncate">
                        {persona.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium block truncate">
                        {persona.phase}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role Classification Badge */}
                <div className="mb-2">
                  <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 border ${persona.roleBadgeColor}`}>
                    {persona.roleBadge}
                  </Badge>
                </div>

                {/* Focus Area */}
                <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200">Focus:</strong> {persona.focusArea}
                </div>
              </div>

              {/* Value Proposition Tag */}
              <div className="mt-2.5 border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800 flex items-center gap-1">
                <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                <span className="truncate">{persona.valueProp}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>Full buying committee coverage across pre-con, bidding, and field delivery</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Decision Alignment: 100%
        </span>
      </div>
    </div>
  )
}
