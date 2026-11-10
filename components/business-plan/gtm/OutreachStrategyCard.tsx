'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Mail,
  PhoneCall,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Send
} from 'lucide-react'

export interface ChannelItem {
  id: string
  name: string
  label: string
  volumeShare: number
  cadence: string
  metric: string
  accentColor: string
  badgeColor: string
  icon: React.ComponentType<{ className?: string }>
}

export const OUTREACH_CHANNELS: ChannelItem[] = [
  {
    id: 'email',
    name: 'Email',
    label: 'Cold & Warm Cadences',
    volumeShare: 45,
    cadence: '3-Touch Personalized Sequence',
    metric: '99.2% Deliverability Rate',
    accentColor: '#1D4ED8',
    badgeColor: 'bg-blue-600 text-white',
    icon: Mail
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    label: 'Social Selling & InMail',
    volumeShare: 30,
    cadence: 'Executive Connection + Content',
    metric: '38% Connection Rate',
    accentColor: '#0284C7',
    badgeColor: 'bg-sky-600 text-white',
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53c0-.85-.68-1.54-1.53-1.54-.85 0-1.54.69-1.54 1.54 0 .85.69 1.53 1.54 1.53m1.39 9.97v-8.37H5.07v8.37h2.78Z" />
      </svg>
    )
  },
  {
    id: 'calls',
    name: 'Calls',
    label: 'Direct Voice & Qualification',
    volumeShare: 25,
    cadence: 'Live Discovery & Follow-ups',
    metric: 'Direct Meeting Conversions',
    accentColor: '#7C3AED',
    badgeColor: 'bg-purple-600 text-white',
    icon: PhoneCall
  }
]

export interface CadenceStep {
  day: string
  channel: string
  action: string
  color: string
}

export const CADENCE_STEPS: CadenceStep[] = [
  { day: 'Day 1', channel: 'LinkedIn', action: 'Profile View & InMail', color: '#0284C7' },
  { day: 'Day 3', channel: 'Email', action: 'Personalized Intro + Deck', color: '#1D4ED8' },
  { day: 'Day 7', channel: 'Calls', action: 'Discovery Call Attempt', color: '#7C3AED' },
  { day: 'Day 10', channel: 'LinkedIn', action: 'Case Study Asset Share', color: '#0284C7' },
  { day: 'Day 14', channel: 'Call + Email', action: 'Executive Sync / Meeting', color: '#059669' }
]

export function OutreachStrategyCard() {
  const [activeChannel, setActiveChannel] = useState<string | null>(null)

  return (
    <div className="flex flex-col justify-between h-full gap-4">
      {/* ── 3 ACTIVE CHANNEL CARDS ── */}
      <div className="flex flex-col gap-2.5 my-auto py-1">
        {OUTREACH_CHANNELS.map((ch) => {
          const isHovered = activeChannel === ch.id
          return (
            <div
              key={ch.id}
              onMouseEnter={() => setActiveChannel(ch.id)}
              onMouseLeave={() => setActiveChannel(null)}
              className={`group flex flex-col gap-2 rounded-xl border p-3 transition-all duration-200 cursor-pointer ${
                isHovered
                  ? 'border-blue-400 bg-blue-50/20 shadow-md scale-[1.01] dark:border-blue-700 dark:bg-blue-950/20'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs dark:border-slate-800 dark:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="grid size-8 place-items-center rounded-lg shadow-2xs shrink-0"
                    style={{ backgroundColor: `${ch.accentColor}15`, color: ch.accentColor }}
                  >
                    <ch.icon className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {ch.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                        · {ch.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">
                      {ch.cadence}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {ch.volumeShare}%
                  </span>
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-50 text-[10px] font-bold gap-1 px-1.5 py-0.5 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                    <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </Badge>
                </div>
              </div>

              {/* Channel Volume Progress Meter */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-300 group-hover:brightness-110"
                  style={{
                    width: `${ch.volumeShare}%`,
                    backgroundColor: ch.accentColor
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── BOTTOM: 14-Day Omnichannel Cadence Sequence Stepper ── */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Zap className="size-3 text-amber-500" />
            14-Day Multi-Touch Cadence Workflow
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            Omnichannel Cadence
          </span>
        </div>

        {/* 5-Step Connected Timeline */}
        <div className="grid grid-cols-5 gap-1.5 items-center">
          {CADENCE_STEPS.map((step, idx) => (
            <div
              key={step.day}
              className="flex flex-col items-center justify-center rounded-lg bg-white p-1.5 text-center shadow-2xs border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700/60"
            >
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {step.day}
              </span>
              <span
                className="text-[10px] font-extrabold truncate mt-0.5"
                style={{ color: step.color }}
              >
                {step.channel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>Continuous automated multi-channel sequencing</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Orchestration: 100% Active
        </span>
      </div>
    </div>
  )
}
