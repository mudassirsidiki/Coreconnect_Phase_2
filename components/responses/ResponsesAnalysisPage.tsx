'use client'

import React, { useState, useMemo } from 'react'
import {
  MessageSquare, CheckCircle2, AlertCircle, XCircle,
  Calendar, CalendarDays, Table as TableIcon, Download,
  Search, Send, Phone, Mail, ArrowLeft, ArrowRight,
  Eye, Filter, Building2, Globe, SlidersHorizontal,
  ChevronRight, Clock, Plus, Check, MoreVertical
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { toast } from 'sonner'
import { formatDate, downloadCsv } from '@/lib/data'
import {
  seedResponseLeads,
  leadTeamMembers,
  type ResponseLeadRecord,
  type Channel
} from '@/lib/outreach-data'

// LinkedIn SVG Brand Icon
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  )
}

// Channel Badge Helper with custom styling
function ChannelBadge({ channel }: { channel: Channel }) {
  if (channel === 'Email') {
    return (
      <Badge variant="outline" className="gap-1 border-blue-200 bg-blue-50 text-[11px] font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
        <Mail className="size-3 text-blue-600" />
        Email
      </Badge>
    )
  }
  if (channel === 'LinkedIn') {
    return (
      <Badge variant="outline" className="gap-1 border-sky-200 bg-sky-50 text-[11px] font-semibold text-[#0a66c2] dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
        <LinkedInIcon className="size-3 text-[#0a66c2]" />
        LinkedIn
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
      <Phone className="size-3 text-emerald-600" />
      Calls
    </Badge>
  )
}

export interface ResponsesAnalysisPageProps {
  selectedIndustry?: string
  setSelectedIndustry?: (v: string) => void
  selectedRegion?: string
  setSelectedRegion?: (v: string) => void
  startDate?: string
  setStartDate?: (v: string) => void
  endDate?: string
  setEndDate?: (v: string) => void
  datePreset?: string
  setDatePreset?: (v: string) => void
  initialTab?: 'All' | 'Positive' | 'Prospect' | 'Negative'
  onBackToDashboard?: () => void
}

export function ResponsesAnalysisPage({
  selectedIndustry = 'All',
  selectedRegion = 'All',
  startDate = '',
  endDate = '',
  initialTab = 'All',
  onBackToDashboard
}: ResponsesAnalysisPageProps) {
  // Response Leads list in state (supports updating status)
  const [responseLeads, setResponseLeads] = useState<ResponseLeadRecord[]>(seedResponseLeads)

  // Active Sentiment Tab: 'All' | 'Positive' | 'Prospect' | 'Negative'
  const [activeTab, setActiveTab] = useState<'All' | 'Positive' | 'Prospect' | 'Negative'>(initialTab)
  const [viewMode, setViewMode] = useState<'tabular' | 'calendar'>('tabular')
  const [tableSearch, setTableSearch] = useState<string>('')
  const [tableChannelFilter, setTableChannelFilter] = useState<string>('All')

  // Detailed Modal / Drawer states
  const [selectedLeadRecord, setSelectedLeadRecord] = useState<ResponseLeadRecord | null>(null)
  const [selectedMeetingBriefing, setSelectedMeetingBriefing] = useState<ResponseLeadRecord | null>(null)

  // Calendar State (October 2026)
  const calendarMonth = 9 // 9 = October (0-indexed)
  const calendarYear = 2026

  // Filtered Response Leads based on top-level Industry, Region, and Date filters
  const filteredResponseLeads = useMemo(() => {
    return responseLeads.filter(r => {
      if (selectedIndustry !== 'All' && r.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && r.region !== selectedRegion) return false
      const rDate = r.responseDate || r.leadAddedDate
      if (startDate && rDate < startDate) return false
      if (endDate && rDate > endDate) return false
      return true
    })
  }, [responseLeads, selectedIndustry, selectedRegion, startDate, endDate])

  // Top Metric Counts
  const sentimentCounts = useMemo(() => {
    const positive = filteredResponseLeads.filter(r => r.response === 'Positive').length
    const prospect = filteredResponseLeads.filter(r => r.response === 'Prospect').length
    const negative = filteredResponseLeads.filter(r => r.response === 'Negative').length
    const total = filteredResponseLeads.length
    const positiveRate = total ? Math.round((positive / total) * 100) : 0
    return {
      Positive: positive,
      Prospect: prospect,
      Negative: negative,
      Total: total,
      positiveRate
    }
  }, [filteredResponseLeads])

  // Count of scheduled meetings in positive responses
  const positiveMeetingsCount = useMemo(() => {
    return filteredResponseLeads
      .filter(r => r.response === 'Positive' && r.meetingDetails?.meetingDate)
      .reduce((sum, r) => {
        if (r.meetingDetails?.meetingsList && r.meetingDetails.meetingsList.length > 0) {
          return sum + r.meetingDetails.meetingsList.length
        }
        return sum + 1
      }, 0)
  }, [filteredResponseLeads])

  // Filtered rows for the active tab, channel, and search query
  const tableFilteredLeads = useMemo(() => {
    return filteredResponseLeads.filter(r => {
      // 1. Tab filter
      if (activeTab !== 'All' && r.response !== activeTab) return false

      // 2. Channel filter
      if (tableChannelFilter !== 'All' && r.channel !== tableChannelFilter) return false

      // 3. Search query
      if (tableSearch.trim()) {
        const query = tableSearch.toLowerCase()
        const match =
          r.account.toLowerCase().includes(query) ||
          r.leadName.toLowerCase().includes(query) ||
          r.title.toLowerCase().includes(query) ||
          r.email.toLowerCase().includes(query) ||
          r.industry.toLowerCase().includes(query) ||
          r.region.toLowerCase().includes(query) ||
          r.actionStatus.toLowerCase().includes(query) ||
          (r.meetingDetails?.agenda || '').toLowerCase().includes(query) ||
          (r.meetingDetails?.attendees || '').toLowerCase().includes(query)
        if (!match) return false
      }

      return true
    })
  }, [filteredResponseLeads, activeTab, tableChannelFilter, tableSearch])

  // Calendar meetings (positive responses with meetings in October 2026)
  const scheduledCalendarMeetings = useMemo(() => {
    return filteredResponseLeads
      .filter(r => r.response === 'Positive' && r.meetingDetails?.meetingDate)
      .flatMap(r => {
        if (r.meetingDetails?.meetingsList && r.meetingDetails.meetingsList.length > 0) {
          return r.meetingDetails.meetingsList.map(m => ({
            lead: r,
            meeting: {
              ...r.meetingDetails!,
              type: m.type,
              meetingDate: m.date
            },
            date: m.date
          }))
        }
        return [{
          lead: r,
          meeting: r.meetingDetails!,
          date: r.meetingDetails!.meetingDate
        }]
      })
  }, [filteredResponseLeads])

  // Calendar Day Generation for October 2026 (Month 9: 31 days, starts Thursday = index 3)
  const calendarDays = useMemo(() => {
    const daysInMonth = 31
    const startDayOfWeek = 3 // Thursday (0 = Mon ... 3 = Thu)
    const cells: { day: number; dateStr: string; meetings: typeof scheduledCalendarMeetings }[] = []

    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, '0')
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${dayStr}`
      const matches = scheduledCalendarMeetings.filter(m => m.date === dateStr)
      cells.push({ day: d, dateStr, meetings: matches })
    }
    return { paddingDays: startDayOfWeek, cells }
  }, [calendarMonth, calendarYear, scheduledCalendarMeetings])

  // CSV Export for filtered responses
  const handleExportCsv = () => {
    const showMeetings = activeTab === 'Positive' || activeTab === 'All'
    const rows = tableFilteredLeads.map(r => {
      const record: Record<string, string> = {
        'Lead Added Date': r.leadAddedDate,
        'Lead': r.leadOwner || leadTeamMembers[r.id % leadTeamMembers.length],
        'Account Name': r.account,
        'Point of Contact': `${r.leadName} - ${r.title}`,
        'Response Date': r.responseDate,
        'Response Channel': r.channel
      }
      if (showMeetings) {
        record['Meetings'] = r.meetingDetails?.meetingsList
          ? r.meetingDetails.meetingsList.map(m => `${m.type}: ${m.date}`).join('; ')
          : (r.meetingDetails ? `${r.meetingDetails.type}: ${r.meetingDetails.meetingDate}` : 'N/A')
      }
      record['Notes'] = r.actionStatus + (r.meetingDetails?.agenda ? ` — ${r.meetingDetails.agenda}` : '')
      return record
    })
    downloadCsv(`responses-analysis-${activeTab.toLowerCase()}.csv`, rows)
    toast.success(`Exported ${tableFilteredLeads.length} response records to CSV`)
  }

  // Handle Action Status update
  const handleUpdateLeadAction = (id: number, newAction: string) => {
    setResponseLeads(prev =>
      prev.map(r => (r.id === id ? { ...r, actionStatus: newAction } : r))
    )
    if (selectedLeadRecord && selectedLeadRecord.id === id) {
      setSelectedLeadRecord(prev => (prev ? { ...prev, actionStatus: newAction } : null))
    }
    toast.success(`Action status updated to "${newAction}"`)
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER WITH BREADCRUMB & BACK BUTTON                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <ArrowLeft className="size-3.5 text-slate-700 dark:text-slate-300" />
                <span>Back to Dashboard</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#0B1F5C] text-xs font-black text-white dark:bg-[#FFC000] dark:text-[#0B1F5C]">
                  5
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
                  Responses Analysis
                </h1>
                <Badge className="bg-[#FFC000] text-[#0B1F5C] font-bold text-[10px] hover:bg-[#FFC000]/90">
                  Sentiment Telemetry
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                In-depth sentiment analysis, discovery meetings telemetry, prospect dispositions, and engagement outcomes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <Download className="size-3.5 text-slate-700 dark:text-slate-300" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. TOP 4 KPI CARDS (INTERACTIVE & FILTERING)                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: TOTAL RESPONSES */}
        <div
          onClick={() => setActiveTab('All')}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition hover:shadow-md ${
            activeTab === 'All'
              ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 dark:bg-blue-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-blue-500`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Responses
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <MessageSquare className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
            {sentimentCounts.Total}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{sentimentCounts.Positive} Positive</span>
            <span className="text-slate-300">·</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">{sentimentCounts.Prospect} Prospect</span>
            <span className="text-slate-300">·</span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">{sentimentCounts.Negative} Negative</span>
          </div>
        </div>

        {/* CARD 2: POSITIVE RESPONSES */}
        <div
          onClick={() => setActiveTab('Positive')}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition hover:shadow-md ${
            activeTab === 'Positive'
              ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-emerald-500`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Positive Responses
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {sentimentCounts.Positive}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {sentimentCounts.positiveRate}% Positive Rate
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {positiveMeetingsCount} Meetings Booked
            </span>
          </div>
        </div>

        {/* CARD 3: PROSPECT RESPONSES */}
        <div
          onClick={() => setActiveTab('Prospect')}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition hover:shadow-md ${
            activeTab === 'Prospect'
              ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 dark:bg-amber-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-amber-500`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Prospect Responses
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <AlertCircle className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {sentimentCounts.Prospect}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="font-semibold text-amber-700 dark:text-amber-300">
              In Nurture Pipeline
            </span>
            <span className="text-muted-foreground">Follow-ups Scheduled</span>
          </div>
        </div>

        {/* CARD 4: NEGATIVE RESPONSES */}
        <div
          onClick={() => setActiveTab('Negative')}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition hover:shadow-md ${
            activeTab === 'Negative'
              ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20 dark:bg-rose-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-rose-500`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Negative Responses
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <XCircle className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {sentimentCounts.Negative}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="font-semibold text-rose-700 dark:text-rose-300">
              Disqualified / Opt-outs
            </span>
            <span className="text-muted-foreground">Competitor / Budget</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. TABS & VIEW CONTROLS TOOLBAR                             */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Sentiment Selection Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('All')}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'All'
                  ? 'bg-white text-[#0B1F5C] shadow-xs dark:bg-slate-900 dark:text-[#FFC000]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>All Responses</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === 'All' ? 'bg-[#0B1F5C]/10 text-[#0B1F5C] dark:bg-[#FFC000]/20 dark:text-[#FFC000]' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {sentimentCounts.Total}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('Positive')}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'Positive'
                  ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              <span>Positive</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === 'Positive' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {sentimentCounts.Positive}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('Prospect')}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'Prospect'
                  ? 'bg-white text-amber-700 shadow-xs dark:bg-slate-900 dark:text-amber-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <AlertCircle className="size-3.5 text-amber-500" />
              <span>Prospect</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === 'Prospect' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {sentimentCounts.Prospect}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('Negative')}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'Negative'
                  ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <XCircle className="size-3.5 text-rose-500" />
              <span>Negative</span>
              <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                activeTab === 'Negative' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {sentimentCounts.Negative}
              </span>
            </button>
          </div>

          {/* View Mode & Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Tabular vs Calendar View Switcher */}
            {(activeTab === 'Positive' || activeTab === 'All') && (
              <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
                <button
                  onClick={() => setViewMode('tabular')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === 'tabular'
                      ? 'bg-[#0B1F5C] text-white shadow-2xs dark:bg-[#FFC000] dark:text-[#0B1F5C]'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <TableIcon className="size-3.5" />
                  Tabular View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    viewMode === 'calendar'
                      ? 'bg-[#0B1F5C] text-white shadow-2xs dark:bg-[#FFC000] dark:text-[#0B1F5C]'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <CalendarDays className="size-3.5" />
                  Calendar View
                </button>
              </div>
            )}

            {/* Filter Table by Channel */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Channel:</span>
              <Select value={tableChannelFilter} onValueChange={setTableChannelFilter}>
                <SelectTrigger className="h-8.5 w-32 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Channels</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Call">Calls</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
              <Input
                placeholder="Search account, lead, notes..."
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                className="h-8.5 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
              {tableSearch && (
                <button
                  type="button"
                  onClick={() => setTableSearch('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 4. CONTENT: TABULAR VIEW OR CALENDAR VIEW                   */}
        {/* ─────────────────────────────────────────────────────────── */}
        {viewMode === 'calendar' && (activeTab === 'Positive' || activeTab === 'All') ? (
          /* CALENDAR VIEW */
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    October 2026 Scheduled Meetings Calendar
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {scheduledCalendarMeetings.length} meetings booked across target enterprise accounts
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-[#10b981]" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">New Meeting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-[#f59e0b]" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Follow-up Meeting</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Day Headers (Mon - Sun) */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400">
                  <div className="py-2">MON</div>
                  <div className="py-2">TUE</div>
                  <div className="py-2">WED</div>
                  <div className="py-2">THU</div>
                  <div className="py-2">FRI</div>
                  <div className="py-2">SAT</div>
                  <div className="py-2">SUN</div>
                </div>

                {/* Day Matrix */}
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Padding empty cells for month start */}
                  {Array.from({ length: calendarDays.paddingDays }).map((_, i) => (
                    <div key={`pad-${i}`} className="min-h-24 rounded-lg bg-slate-50/50 p-2 dark:bg-slate-950/30" />
                  ))}

                  {/* Calendar Day Cells */}
                  {calendarDays.cells.map(cell => (
                    <div
                      key={cell.day}
                      className={`min-h-24 rounded-lg border p-2 transition flex flex-col justify-between ${
                        cell.meetings.length
                          ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-900/50 dark:bg-emerald-950/10'
                          : 'border-slate-100 bg-white hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${
                          cell.day === 15 ? 'grid size-5 place-items-center rounded-full bg-[#0B1F5C] text-white dark:bg-[#FFC000] dark:text-[#0B1F5C]' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {cell.day}
                        </span>
                        {cell.meetings.length > 0 && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {cell.meetings.length} booked
                          </span>
                        )}
                      </div>

                      {/* Meeting Event Chips */}
                      <div className="mt-1.5 flex flex-col gap-1">
                        {cell.meetings.map((item, idx) => {
                          const isNew = item.meeting.type === 'New Meeting'
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedMeetingBriefing(item.lead)}
                              className={`truncate rounded px-1.5 py-1 text-left text-[10px] font-semibold transition hover:brightness-95 cursor-pointer ${
                                isNew
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800'
                              }`}
                            >
                              <div className="truncate font-bold">{item.lead.account}</div>
                              <div className="flex items-center justify-between text-[9px] opacity-80">
                                <span>{item.meeting.meetingTime}</span>
                                <span className="uppercase">{isNew ? 'New' : 'Follow'}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TABULAR VIEW */
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:border-slate-800 dark:bg-slate-950/60">
                  <th className="px-4 py-3.5 whitespace-nowrap">Lead Added Date</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Lead</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Account Name</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Point of Contact</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Response Date</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">Response Channel</th>
                  {(activeTab === 'Positive' || activeTab === 'All') && (
                    <th className="px-4 py-3.5 whitespace-nowrap">Meetings</th>
                  )}
                  <th className="px-4 py-3.5 min-w-[220px]">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tableFilteredLeads.map(lead => {
                  const showMeetings = activeTab === 'Positive' || activeTab === 'All'
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        if (lead.response === 'Positive') {
                          setSelectedMeetingBriefing(lead)
                        } else {
                          setSelectedLeadRecord(lead)
                        }
                      }}
                      className="group transition hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                    >
                      {/* 1. Lead Added Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium text-xs">
                        {formatDate(lead.leadAddedDate)}
                      </td>

                      {/* 2. Lead */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {lead.leadOwner || leadTeamMembers[lead.id % leadTeamMembers.length]}
                        </span>
                      </td>

                      {/* 3. Account Name */}
                      <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white text-xs whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="grid size-6 shrink-0 place-items-center rounded bg-slate-100 text-[10px] font-bold text-[#0B1F5C] dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                            {lead.account.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{lead.account}</span>
                            <div className="flex items-center gap-1 mt-0.5 font-normal text-[10px] text-muted-foreground">
                              <span className="font-medium text-slate-600 dark:text-slate-400">{lead.industry}</span>
                              <span>·</span>
                              <span className="text-slate-500 dark:text-slate-400">{lead.region}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 4. Point of Contact */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {lead.leadName}
                          </div>
                          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {lead.title}
                          </div>
                        </div>
                      </td>

                      {/* 5. Response Date */}
                      <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap text-xs font-medium">
                        {formatDate(lead.responseDate)}
                      </td>

                      {/* 6. Response Channel */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <ChannelBadge channel={lead.channel} />
                      </td>

                      {/* 7. Meetings (only for Positive & All) */}
                      {showMeetings && (
                        <td className="px-4 py-3.5 align-top">
                          {lead.meetingDetails ? (
                            <div className="flex flex-col gap-1.5">
                              {lead.meetingDetails.meetingsList && lead.meetingDetails.meetingsList.length > 0 ? (
                                lead.meetingDetails.meetingsList.map((m, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-xs">
                                    <span
                                      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                                        m.type === 'New Meeting'
                                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                                          : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300'
                                      }`}
                                    >
                                      {m.type}
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                      {formatDate(m.date)}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span
                                    className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                                      lead.meetingDetails.type === 'New Meeting'
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300'
                                    }`}
                                  >
                                    {lead.meetingDetails.type}
                                  </span>
                                  <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                    {formatDate(lead.meetingDetails.meetingDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                      )}

                      {/* 8. Notes */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${
                              lead.response === 'Positive'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                                : lead.response === 'Prospect'
                                ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300'
                                : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {lead.actionStatus}
                          </span>
                          {lead.response === 'Positive' && lead.meetingDetails?.agenda && (
                            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2" title={lead.meetingDetails.agenda}>
                              {lead.meetingDetails.agenda}
                            </p>
                          )}
                          {lead.response === 'Prospect' && (
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              Active multi-touch nurture sequence. Awaiting follow-up response.
                            </p>
                          )}
                          {lead.response === 'Negative' && (
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              Logged objection & outreach paused per engagement policy.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {tableFilteredLeads.length === 0 && (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No records match the current sentiment or channel filters.
              </div>
            )}
          </div>
        )}

        {/* Table Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{tableFilteredLeads.length}</span> of {filteredResponseLeads.length} classified responses
            <span className="ml-2 font-medium text-slate-500">
              (Positive: {sentimentCounts.Positive} · Prospect: {sentimentCounts.Prospect} · Negative: {sentimentCounts.Negative})
            </span>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <Download className="size-3 text-slate-700 dark:text-slate-300" />
            <span>Export Filtered CSV</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. DRAWERS / MODALS FOR DETAILED INSPECTION                 */}
      {/* ─────────────────────────────────────────────────────────── */}

      {/* 1. POSITIVE RESPONSE MEETING BRIEFING DRAWER */}
      <Sheet open={!!selectedMeetingBriefing} onOpenChange={open => !open && setSelectedMeetingBriefing(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <CalendarDays className="size-4" />
              </div>
              <SheetTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
                Scheduled Meeting Briefing
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs">
              Discovery & follow-up meeting details from positive outreach response.
            </SheetDescription>
          </SheetHeader>

          {selectedMeetingBriefing && selectedMeetingBriefing.meetingDetails && (
            <div className="mt-5 space-y-5 text-xs">
              <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {selectedMeetingBriefing.account}
                </div>
                <div className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {selectedMeetingBriefing.leadName} · <span className="font-normal text-muted-foreground">{selectedMeetingBriefing.title}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Lead Owner:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedMeetingBriefing.leadOwner || 'Bilal Tahir'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className={`grid ${selectedMeetingBriefing.meetingDetails.meetingsList && selectedMeetingBriefing.meetingDetails.meetingsList.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                  {selectedMeetingBriefing.meetingDetails.meetingsList && selectedMeetingBriefing.meetingDetails.meetingsList.length > 0 ? (
                    selectedMeetingBriefing.meetingDetails.meetingsList.map((m, idx) => (
                      <div key={idx} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-muted-foreground text-[10px]">Meeting #{idx + 1}</span>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-semibold border ${
                              m.type === 'New Meeting'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60'
                                : 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60'
                            }`}
                          >
                            {m.type}
                          </Badge>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {formatDate(m.date)}
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                          {idx === 0 ? selectedMeetingBriefing.meetingDetails.meetingTime : '2:00 PM'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border p-3">
                      <div className="text-muted-foreground text-[10px]">Meeting Date & Time</div>
                      <div className="mt-1 font-bold text-slate-900 dark:text-white">
                        {formatDate(selectedMeetingBriefing.meetingDetails.meetingDate)}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {selectedMeetingBriefing.meetingDetails.meetingTime}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-muted-foreground text-[10px]">Agenda & Objectives</div>
                  <p className="mt-1.5 text-slate-800 dark:text-slate-200 leading-relaxed">
                    {selectedMeetingBriefing.meetingDetails.agenda}
                  </p>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-muted-foreground text-[10px]">Confirmed Attendees</div>
                  <p className="mt-1 text-slate-700 dark:text-slate-300">
                    {selectedMeetingBriefing.meetingDetails.attendees}
                  </p>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-muted-foreground text-[10px]">Conference Location</div>
                  <p className="mt-1 text-slate-700 dark:text-slate-300 font-medium">
                    {selectedMeetingBriefing.meetingDetails.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 text-xs font-semibold"
                  onClick={() => {
                    toast.success(`Calendar invitation resent to ${selectedMeetingBriefing.email}`)
                    setSelectedMeetingBriefing(null)
                  }}
                >
                  <Send className="mr-1.5 size-3.5" />
                  Send Calendar Invite
                </Button>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => {
                    toast.info('Meeting marked for rescheduling')
                    setSelectedMeetingBriefing(null)
                  }}
                >
                  Reschedule
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* 2. PROSPECT / NEGATIVE INSPECT LEAD DRAWER */}
      <Sheet open={!!selectedLeadRecord} onOpenChange={open => !open && setSelectedLeadRecord(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
              Lead Disposition Record
            </SheetTitle>
            <SheetDescription className="text-xs">
              Response details and follow-up disposition for {selectedLeadRecord?.account}.
            </SheetDescription>
          </SheetHeader>

          {selectedLeadRecord && (
            <div className="mt-5 space-y-4 text-xs">
              <div className="rounded-lg border p-3.5 bg-slate-50 dark:bg-slate-900">
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedLeadRecord.account}
                </div>
                <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                  {selectedLeadRecord.leadName} ({selectedLeadRecord.title})
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Lead Owner:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedLeadRecord.leadOwner || 'Bilal Tahir'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Response Channel:</span>
                  <ChannelBadge channel={selectedLeadRecord.channel} />
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Sentiment Classification:</span>
                  <Badge variant={selectedLeadRecord.response === 'Positive' ? 'default' : 'secondary'}>
                    {selectedLeadRecord.response}
                  </Badge>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Action Status:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedLeadRecord.actionStatus}
                  </span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Response Date:</span>
                  <span>{formatDate(selectedLeadRecord.responseDate)}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Lead Added Date:</span>
                  <span>{formatDate(selectedLeadRecord.leadAddedDate)}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Territory & Industry:</span>
                  <span>{selectedLeadRecord.region} · {selectedLeadRecord.industry}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  className="w-full text-xs font-semibold bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90"
                  onClick={() => {
                    handleUpdateLeadAction(selectedLeadRecord.id, 'Follow-up Scheduled')
                    setSelectedLeadRecord(null)
                  }}
                >
                  Mark for Follow-up
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => setSelectedLeadRecord(null)}
                >
                  Close Record
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

