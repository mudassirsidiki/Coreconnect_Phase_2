'use client'

import React from 'react'
import { Mail, PhoneCall } from 'lucide-react'

export interface ChannelItem {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  glowColor: string
}

export const OUTREACH_CHANNELS: ChannelItem[] = [
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    gradient: 'from-blue-600 to-indigo-600',
    glowColor: 'group-hover:border-blue-400 dark:group-hover:border-blue-600'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.53-1.53c0-.85-.68-1.54-1.53-1.54-.85 0-1.54.69-1.54 1.54 0 .85.69 1.53 1.54 1.53m1.39 9.97v-8.37H5.07v8.37h2.78Z" />
      </svg>
    ),
    gradient: 'from-[#0077B5] to-[#005582]',
    glowColor: 'group-hover:border-sky-400 dark:group-hover:border-sky-600'
  },
  {
    id: 'calls',
    name: 'Calls',
    icon: PhoneCall,
    gradient: 'from-violet-600 to-purple-700',
    glowColor: 'group-hover:border-purple-400 dark:group-hover:border-purple-600'
  }
]

export function OutreachStrategyCard() {
  return (
    <div className="flex flex-col gap-3.5 my-auto py-2">
      {OUTREACH_CHANNELS.map((ch) => (
        <div
          key={ch.id}
          className={`group relative flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 ${ch.glowColor}`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Gradient Icon Badge */}
            <div
              className={`grid size-11 place-items-center rounded-xl bg-gradient-to-br ${ch.gradient} text-white shadow-md shrink-0`}
            >
              <ch.icon className="size-5" />
            </div>

            {/* Channel Name */}
            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {ch.name}
            </h4>
          </div>

          {/* Active Channel Indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Channel
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
