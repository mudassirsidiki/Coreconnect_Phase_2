'use client'

import React from 'react'
import {
  Calendar,
  Clock,
  CalendarDays,
  User,
  Building2,
  MapPin,
  Sparkles,
  CheckCircle2,
  CalendarClock
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

/* ─────────────────────────────────────────────────────────────
    1. WEEKLY MEETING TIME CARD
───────────────────────────────────────────────────────────── */
export function WeeklyMeetingCard() {
  const meetingSlots = [
    {
      id: 'friday',
      time: 'Friday - 2:00 PM EST',
      label: 'Weekly Wrap-up & Review',
      gradient: 'from-blue-600 to-indigo-600',
      icon: CalendarClock,
      badgeText: '2:00 PM EST',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
    },
    {
      id: 'tuesday',
      time: 'Tuesday - 10:30 AM EST',
      label: 'Pipeline & Sprint Huddle',
      gradient: 'from-violet-600 to-purple-700',
      icon: CalendarDays,
      badgeText: '10:30 AM EST',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
    }
  ]

  return (
    <div className="flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-3 my-auto py-1">
        {meetingSlots.map((slot) => (
          <div
            key={slot.id}
            className="group relative flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 p-3.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`grid size-11 place-items-center rounded-xl bg-gradient-to-br ${slot.gradient} text-white shadow-md shrink-0`}
              >
                <slot.icon className="size-5" />
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug truncate">
                  {slot.time}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {slot.label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className={`text-xs font-bold ${slot.badgeColor}`}>
                {slot.badgeText}
              </Badge>
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>Cadence: 2 weekly syncs scheduled</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Timezone: EST
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
    2. POINT OF CONTACT CARD
───────────────────────────────────────────────────────────── */
export function PointOfContactCard() {
  return (
    <div className="flex flex-col justify-between h-full gap-4">
      <div className="my-auto py-1 flex flex-col gap-3">
        {/* Profile Card */}
        <div className="flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 p-4 shadow-2xs dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Avatar Initials Badge */}
            <div className="grid size-13 place-items-center rounded-2xl bg-gradient-to-br from-[#0B1F5C] via-blue-700 to-indigo-600 text-white text-xl font-black shadow-md shrink-0">
              S
            </div>

            <div className="min-w-0">
              <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                Sebastien
              </h4>
            </div>
          </div>

          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-xs font-bold gap-1.5 px-2.5 py-1 shrink-0">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Liaison
          </Badge>
        </div>

        {/* Responsibilities Callout */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-800 dark:text-slate-200 font-bold">Key Focus:</strong> Dedicated lead for campaign execution, weekly stakeholder meetings, and pipeline coordination.
        </div>
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>Designated Client Liaison</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Availability: Mon – Fri
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
    3. UPCOMING CONFERENCES / TRADE SHOWS CARD
───────────────────────────────────────────────────────────── */
export function UpcomingConferencesCard() {
  const conferences = [
    {
      id: 'calgary',
      name: 'Buildex Calgary',
      date: 'Oct 21–22, 2026',
      location: 'Calgary, AB',
      gradient: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
    },
    {
      id: 'vancouver',
      name: 'Buildex Vancouver',
      date: 'Feb 11–12, 2027',
      location: 'Vancouver, BC',
      gradient: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
    },
    {
      id: 'toronto',
      name: 'Buildex Show in Toronto',
      date: 'Dec 2–3, 2026',
      location: 'Toronto, ON',
      gradient: 'from-emerald-600 to-teal-700',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
    }
  ]

  return (
    <div className="flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-2.5 my-auto py-1">
        {conferences.map((conf) => (
          <div
            key={conf.id}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 p-3 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${conf.gradient} text-white shadow-md shrink-0`}
              >
                <Building2 className="size-4.5" />
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug truncate">
                  {conf.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="size-3 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {conf.location}
                  </span>
                </div>
              </div>
            </div>

            <Badge variant="outline" className={`text-xs font-bold shrink-0 ${conf.badgeColor}`}>
              {conf.date}
            </Badge>
          </div>
        ))}
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>3 Industry trade shows scheduled</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Target: In-Person GTM
        </span>
      </div>
    </div>
  )
}

