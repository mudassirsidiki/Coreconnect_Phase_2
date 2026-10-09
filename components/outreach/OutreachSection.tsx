'use client'

import React, { useState, useMemo } from 'react'
import {
  Mail, Phone, PhoneCall, Voicemail, Calendar, CalendarDays,
  Table as TableIcon, Filter, Download, Search, Eye, MoreHorizontal,
  CheckCircle2, XCircle, AlertCircle, Clock, ArrowUpRight,
  ChevronRight, ChevronLeft, Plus, Building2, Sparkles, TrendingUp,
  BarChart3, Users, Layers, Send, FileText, RefreshCw, SlidersHorizontal,
  ExternalLink, Check, Copy, ArrowRight, MessageSquare, ShieldCheck
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { industries, regions, channels, industryRegionMap, type Industry, type Region, type Channel, formatDate, downloadCsv } from '@/lib/data'
import {
  seedEmailLogs, seedLinkedInLogs, seedCallLogs, seedResponseLeads,
  type EmailLog, type LinkedInLog, type CallLog, type ResponseLeadRecord, type ScheduledMeetingDetails
} from '@/lib/outreach-data'

// LinkedIn Brand Icon
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  )
}

export interface OutreachSectionProps {
  selectedIndustry?: string
  setSelectedIndustry?: (v: string) => void
  selectedRegion?: string
  setSelectedRegion?: (v: string) => void
}

export function OutreachSection({
  selectedIndustry: propSelectedIndustry,
  setSelectedIndustry: propSetSelectedIndustry,
  selectedRegion: propSelectedRegion,
  setSelectedRegion: propSetSelectedRegion
}: OutreachSectionProps = {}) {
  // Filters
  const [internalIndustry, setInternalIndustry] = useState<string>('All')
  const [internalRegion, setInternalRegion] = useState<string>('All')

  const selectedIndustry = propSelectedIndustry !== undefined ? propSelectedIndustry : internalIndustry
  const setSelectedIndustry = propSetSelectedIndustry ?? setInternalIndustry
  const selectedRegion = propSelectedRegion !== undefined ? propSelectedRegion : internalRegion
  const setSelectedRegion = propSetSelectedRegion ?? setInternalRegion
  const [globalSearch, setGlobalSearch] = useState<string>('')

  // Middle Section Drill-down state
  const [emailDrawerOpen, setEmailDrawerOpen] = useState(false)
  const [linkedInDrawerOpen, setLinkedInDrawerOpen] = useState(false)
  const [callDrawerOpen, setCallDrawerOpen] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null)
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)

  // Section 3 & 4 Response Classification & Views
  const [responseTab, setResponseTab] = useState<'Positive' | 'Prospect' | 'Negative'>('Positive')
  const [positiveViewMode, setPositiveViewMode] = useState<'tabular' | 'calendar'>('tabular')
  const [tableSearch, setTableSearch] = useState<string>('')
  const [tableChannelFilter, setTableChannelFilter] = useState<string>('All')

  // Outreach by Industry & Region Breakdown table state
  const [breakdownViewMode, setBreakdownViewMode] = useState<'industry-summary' | 'segments'>('industry-summary')
  const [breakdownSearch, setBreakdownSearch] = useState<string>('')

  // Detailed Modal / Drawer states
  const [selectedLeadRecord, setSelectedLeadRecord] = useState<ResponseLeadRecord | null>(null)
  const [selectedMeetingBriefing, setSelectedMeetingBriefing] = useState<ResponseLeadRecord | null>(null)
  const [wireframeModalOpen, setWireframeModalOpen] = useState(false)

  // Calendar State
  const [calendarMonth, setCalendarMonth] = useState<number>(9) // 9 = October (0-indexed)
  const calendarYear = 2026

  // Filtered Datasets based on top-level Industry & Region filters
  const filteredEmailLogs = useMemo(() => {
    return seedEmailLogs.filter(e => {
      if (selectedIndustry !== 'All' && e.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && e.region !== selectedRegion) return false
      if (globalSearch && !`${e.leadName} ${e.account} ${e.subject}`.toLowerCase().includes(globalSearch.toLowerCase())) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, globalSearch])

  const filteredLinkedInLogs = useMemo(() => {
    return seedLinkedInLogs.filter(l => {
      if (selectedIndustry !== 'All' && l.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && l.region !== selectedRegion) return false
      if (globalSearch && !`${l.leadName} ${l.account}`.toLowerCase().includes(globalSearch.toLowerCase())) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, globalSearch])

  const filteredCallLogs = useMemo(() => {
    return seedCallLogs.filter(c => {
      if (selectedIndustry !== 'All' && c.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && c.region !== selectedRegion) return false
      if (globalSearch && !`${c.leadName} ${c.account}`.toLowerCase().includes(globalSearch.toLowerCase())) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, globalSearch])

  const filteredResponseLeads = useMemo(() => {
    return seedResponseLeads.filter(r => {
      if (selectedIndustry !== 'All' && r.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && r.region !== selectedRegion) return false
      if (globalSearch && !`${r.leadName} ${r.account} ${r.email}`.toLowerCase().includes(globalSearch.toLowerCase())) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, globalSearch])

  // Top Section: High-Level Metrics
  const uniqueIndustriesCount = useMemo(() => {
    const set = new Set<string>()
    filteredEmailLogs.forEach(e => set.add(e.industry))
    filteredLinkedInLogs.forEach(l => set.add(l.industry))
    filteredCallLogs.forEach(c => set.add(c.industry))
    return set.size
  }, [filteredEmailLogs, filteredLinkedInLogs, filteredCallLogs])

  const uniqueRegionsCount = useMemo(() => {
    const set = new Set<string>()
    filteredEmailLogs.forEach(e => set.add(e.region))
    filteredLinkedInLogs.forEach(l => set.add(l.region))
    filteredCallLogs.forEach(c => set.add(c.region))
    return set.size
  }, [filteredEmailLogs, filteredLinkedInLogs, filteredCallLogs])

  const totalOutreachesCount = useMemo(() => {
    return filteredEmailLogs.length + filteredLinkedInLogs.length + filteredCallLogs.length
  }, [filteredEmailLogs, filteredLinkedInLogs, filteredCallLogs])

  // Outreach aggregated by 8 industries and 3 regions (Total: 160)
  const industrySummaryRows = useMemo(() => {
    const allLogs = [
      ...filteredEmailLogs.map(e => ({ industry: e.industry, region: e.region, medium: 'Email' as const })),
      ...filteredLinkedInLogs.map(l => ({ industry: l.industry, region: l.region, medium: 'LinkedIn' as const })),
      ...filteredCallLogs.map(c => ({ industry: c.industry, region: c.region, medium: 'Call' as const }))
    ]

    let list = industries.map(ind => {
      const inInd = allLogs.filter(x => x.industry === ind)
      const region = industryRegionMap[ind]
      const email = inInd.filter(x => x.medium === 'Email').length
      const linkedIn = inInd.filter(x => x.medium === 'LinkedIn').length
      const call = inInd.filter(x => x.medium === 'Call').length
      const total = inInd.length
      return { industry: ind, region, email, linkedIn, call, total }
    })

    if (breakdownSearch.trim()) {
      const q = breakdownSearch.toLowerCase()
      list = list.filter(r => r.industry.toLowerCase().includes(q) || r.region.toLowerCase().includes(q))
    }

    return list
  }, [filteredEmailLogs, filteredLinkedInLogs, filteredCallLogs, breakdownSearch])

  const industrySummaryTotals = useMemo(() => {
    return industrySummaryRows.reduce(
      (acc, r) => {
        acc.email += r.email
        acc.linkedIn += r.linkedIn
        acc.call += r.call
        acc.total += r.total
        return acc
      },
      { email: 0, linkedIn: 0, call: 0, total: 0 }
    )
  }, [industrySummaryRows])

  // Aggregated Data: Outreach by Industry and Region
  const industryRegionMatrix = useMemo(() => {
    const map = new Map<string, { industry: string; region: string; email: number; linkedIn: number; call: number; total: number }>()

    filteredEmailLogs.forEach(e => {
      const key = `${e.industry}__${e.region}`
      const existing = map.get(key) || { industry: e.industry, region: e.region, email: 0, linkedIn: 0, call: 0, total: 0 }
      existing.email += 1
      existing.total += 1
      map.set(key, existing)
    })

    filteredLinkedInLogs.forEach(l => {
      const key = `${l.industry}__${l.region}`
      const existing = map.get(key) || { industry: l.industry, region: l.region, email: 0, linkedIn: 0, call: 0, total: 0 }
      existing.linkedIn += 1
      existing.total += 1
      map.set(key, existing)
    })

    filteredCallLogs.forEach(c => {
      const key = `${c.industry}__${c.region}`
      const existing = map.get(key) || { industry: c.industry, region: c.region, email: 0, linkedIn: 0, call: 0, total: 0 }
      existing.call += 1
      existing.total += 1
      map.set(key, existing)
    })

    let list = Array.from(map.values())

    if (breakdownSearch.trim()) {
      const q = breakdownSearch.toLowerCase()
      list = list.filter(r => r.industry.toLowerCase().includes(q) || r.region.toLowerCase().includes(q))
    }

    list.sort((a, b) => b.total - a.total || a.industry.localeCompare(b.industry))
    return list
  }, [filteredEmailLogs, filteredLinkedInLogs, filteredCallLogs, breakdownSearch])

  const matrixTotals = useMemo(() => {
    return industryRegionMatrix.reduce(
      (acc, r) => {
        acc.email += r.email
        acc.linkedIn += r.linkedIn
        acc.call += r.call
        acc.total += r.total
        return acc
      },
      { email: 0, linkedIn: 0, call: 0, total: 0 }
    )
  }, [industryRegionMatrix])

  // Middle Section Channel Metrics
  const emailMetrics = useMemo(() => {
    const newEmails = filteredEmailLogs.filter(e => e.type === 'New Email').length
    const followUpEmails = filteredEmailLogs.filter(e => e.type === 'Follow-up Email').length
    const total = filteredEmailLogs.length
    const opened = filteredEmailLogs.filter(e => e.status === 'Opened' || e.status === 'Clicked' || e.status === 'Replied').length
    const replied = filteredEmailLogs.filter(e => e.status === 'Replied').length
    const openRate = total ? Math.round((opened / total) * 100) : 0
    const replyRate = total ? Math.round((replied / total) * 100) : 0
    return { newEmails, followUpEmails, total, openRate, replyRate }
  }, [filteredEmailLogs])

  const linkedInMetrics = useMemo(() => {
    const connectionRequests = filteredLinkedInLogs.filter(l => l.type === 'Connection Request').length
    const directMessages = filteredLinkedInLogs.filter(l => l.type === 'Direct Message').length
    const total = filteredLinkedInLogs.length
    const connected = filteredLinkedInLogs.filter(l => l.status === 'Connected' || l.status === 'Replied').length
    const replied = filteredLinkedInLogs.filter(l => l.status === 'Replied').length
    const acceptRate = total ? Math.round((connected / total) * 100) : 0
    const replyRate = total ? Math.round((replied / total) * 100) : 0
    return { connectionRequests, directMessages, total, acceptRate, replyRate }
  }, [filteredLinkedInLogs])

  const callMetrics = useMemo(() => {
    const newCalls = filteredCallLogs.filter(c => c.type === 'New Call').length
    const followUpCalls = filteredCallLogs.filter(c => c.type === 'Follow-up Call').length
    const voicemails = filteredCallLogs.filter(c => c.outcome === 'Voicemail').length
    const total = filteredCallLogs.length
    const connected = filteredCallLogs.filter(c => c.outcome === 'Connected').length
    const connectRate = total ? Math.round((connected / total) * 100) : 0
    return { newCalls, followUpCalls, voicemails, total, connectRate }
  }, [filteredCallLogs])


  const sentimentCounts = useMemo(() => {
    return {
      Positive: filteredResponseLeads.filter(r => r.response === 'Positive').length,
      Prospect: filteredResponseLeads.filter(r => r.response === 'Prospect').length,
      Negative: filteredResponseLeads.filter(r => r.response === 'Negative').length,
      Total: filteredResponseLeads.length
    }
  }, [filteredResponseLeads])

  // Section 4: Filtered rows for the active response tab
  const activeTabLeads = useMemo(() => {
    return filteredResponseLeads.filter(r => {
      if (r.response !== responseTab) return false
      if (tableChannelFilter !== 'All' && r.channel !== tableChannelFilter) return false
      if (tableSearch) {
        const query = tableSearch.toLowerCase()
        const match = r.account.toLowerCase().includes(query) ||
          r.leadName.toLowerCase().includes(query) ||
          r.actionStatus.toLowerCase().includes(query) ||
          (r.meetingDetails?.agenda || '').toLowerCase().includes(query)
        if (!match) return false
      }
      return true
    })
  }, [filteredResponseLeads, responseTab, tableChannelFilter, tableSearch])

  // Calendar meetings (positive responses with meetings in October 2026)
  const scheduledCalendarMeetings = useMemo(() => {
    return filteredResponseLeads
      .filter(r => r.response === 'Positive' && r.meetingDetails?.meetingDate)
      .map(r => ({
        lead: r,
        meeting: r.meetingDetails!,
        date: r.meetingDetails!.meetingDate
      }))
  }, [filteredResponseLeads])

  // Calendar Day Generation for October 2026 (Month 9: 31 days, starts Thursday)
  const calendarDays = useMemo(() => {
    const daysInMonth = 31
    const startDayOfWeek = 3 // Thursday (0 = Sun, 1 = Mon ... 4 = Thu) -> using Mon as day 0: Thu is 3
    const cells: { day: number; dateStr: string; meetings: typeof scheduledCalendarMeetings }[] = []
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, '0')
      const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${dayStr}`
      const matches = scheduledCalendarMeetings.filter(m => m.date === dateStr)
      cells.push({ day: d, dateStr, meetings: matches })
    }
    return { paddingDays: startDayOfWeek, cells }
  }, [calendarMonth, calendarYear, scheduledCalendarMeetings])

  return (
    <div className="flex flex-col gap-8">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. TOP SECTION: HIGH-LEVEL METRICS & FILTERS */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {/* Header Ribbon */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
            Outreach
          </h2>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Total Outreaches Made */}
          <Card className="border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div>
                <span className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                  Total Outreaches Made
                </span>
                <div className="mt-2 text-4xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
                  {totalOutreachesCount}
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                ({filteredEmailLogs.length} Email · {filteredLinkedInLogs.length} LinkedIn · {filteredCallLogs.length} Calls)
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Positive Response Rate */}
          <Card className="border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div>
                <span className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                  Positive response rate
                </span>
                <div className="mt-2 text-4xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
                  {sentimentCounts.Total ? Math.round((sentimentCounts.Positive / sentimentCounts.Total) * 100) : 0}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Unique Industries Outreached */}
          <Card className="border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div>
                <span className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                  Unique industries outreached
                </span>
                <div className="mt-2 text-4xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
                  {uniqueIndustriesCount}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Unique Regions Outreached */}
          <Card className="border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div>
                <span className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                  Unique regions outreached
                </span>
                <div className="mt-2 text-4xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
                  {uniqueRegionsCount}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* OUTREACH BY INDUSTRY & REGION TABLE */}
        {/* ─────────────────────────────────────────────────────────── */}
        <Card className="border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TableIcon className="size-4 text-[#0B1F5C] dark:text-[#FFC000]" />
                <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                  Outreach Across 8 Industries & 3 Regions
                </CardTitle>
                <Badge className="bg-[#0B1F5C] text-white dark:bg-[#FFC000] dark:text-[#0B1F5C] text-xs font-bold">
                  Total: {industrySummaryTotals.total} Outreaches
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Distribution across 8 target industries, 3 regions (USA, Canada, Saudi Arabia), and 3 communication mediums.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
                <Input
                  value={breakdownSearch}
                  onChange={e => setBreakdownSearch(e.target.value)}
                  placeholder="Filter industry or region..."
                  className="h-8 w-48 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Export CSV */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium gap-1.5 border-slate-200 dark:border-slate-700"
                onClick={() => {
                  downloadCsv('outreach-8-industries-report.csv', industrySummaryRows.map(r => ({
                    Industry: r.industry,
                    Region: r.region,
                    Email: r.email,
                    LinkedIn: r.linkedIn,
                    Call: r.call,
                    'Total Outreaches': r.total
                  })))
                  toast.success('Outreach data exported to CSV')
                }}
              >
                <Download className="size-3.5" />
                CSV
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
                    <th className="px-5 py-3.5">Industry</th>
                    <th className="px-5 py-3.5">Region</th>
                    <th className="px-4 py-3.5 text-center text-blue-700 dark:text-blue-300">
                      <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" /> Email</span>
                    </th>
                    <th className="px-4 py-3.5 text-center text-[#0a66c2] dark:text-sky-300">
                      <span className="inline-flex items-center gap-1.5"><LinkedInIcon className="size-3.5" /> LinkedIn</span>
                    </th>
                    <th className="px-4 py-3.5 text-center text-emerald-700 dark:text-emerald-300">
                      <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" /> Call</span>
                    </th>
                    <th className="px-5 py-3.5 text-right">Total Outreaches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {industrySummaryRows.map((row) => (
                    <tr
                      key={row.industry}
                      className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/50"
                    >
                      <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">
                        {row.industry}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {row.region}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-blue-700 dark:text-blue-300">
                        {row.email}
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-[#0a66c2] dark:text-sky-300">
                        {row.linkedIn}
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-emerald-700 dark:text-emerald-300">
                        {row.call}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center justify-center min-w-8 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0B1F5C]/10 text-[#0B1F5C] dark:bg-white/10 dark:text-[#FFC000]">
                          {row.total}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {industrySummaryRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                        No industries matching "{breakdownSearch}".
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Total Summary Row (Sums up to 160) */}
                {industrySummaryRows.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-slate-50/90 font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white text-xs uppercase tracking-wider">
                      <td className="px-5 py-3.5">Total (8 Industries)</td>
                      <td className="px-5 py-3.5 text-muted-foreground font-semibold lowercase tracking-normal">
                        3 regions (USA, Canada, Saudi Arabia)
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-blue-700 dark:text-blue-300">
                        {industrySummaryTotals.email}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#0a66c2] dark:text-sky-300">
                        {industrySummaryTotals.linkedIn}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-emerald-700 dark:text-emerald-300">
                        {industrySummaryTotals.call}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Badge className="bg-[#0B1F5C] text-white dark:bg-[#FFC000] dark:text-[#0B1F5C] text-xs font-extrabold px-3 py-1">
                          {industrySummaryTotals.total}
                        </Badge>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. MIDDLE SECTION: OUTREACH CHANNELS & DRILL-DOWN VIEWS */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0B1F5C] dark:text-white">
              Outreach Channels
            </h3>
            <p className="text-xs text-muted-foreground">
              Direct telemetry across primary engagement channels.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* EMAIL CHANNEL CARD */}
          <Card className="border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-4">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-lg bg-blue-50 text-[#0B1F5C] dark:bg-blue-950/80 dark:text-blue-300">
                  <Mail className="size-4.5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Email Outreach
                </h4>
              </div>

              {/* Metrics */}
              <div className="mt-3.5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Total New Emails
                  </div>
                  <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                    {emailMetrics.newEmails}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Follow-up Emails
                  </div>
                  <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                    {emailMetrics.followUpEmails}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* LINKEDIN CHANNEL CARD */}
          <Card className="border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-4">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-sky-50 text-[#0a66c2] dark:bg-sky-950/80 dark:text-sky-300">
                  <LinkedInIcon className="size-4.5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  LinkedIn Engagement
                </h4>
              </div>

              {/* Metrics */}
              <div className="mt-3.5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Connection Requests
                  </div>
                  <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                    {linkedInMetrics.connectionRequests}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Direct Messages
                  </div>
                  <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                    {linkedInMetrics.directMessages}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* CALLS CHANNEL CARD */}
          <Card className="border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-4">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                  <PhoneCall className="size-4.5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Voice & Phone Calls
                </h4>
              </div>

              {/* Metrics */}
              <div className="mt-3.5 grid grid-cols-3 gap-2.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    New Calls
                  </div>
                  <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                    {callMetrics.newCalls}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Follow-ups
                  </div>
                  <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                    {callMetrics.followUpCalls}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Voicemails
                  </div>
                  <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                    {callMetrics.voicemails}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. RESPONSE DETAIL TABLES (TABS & VIEWS) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Card className="border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardContent className="p-6">
          <div>
            {/* Dedicated Response Sentiment Tabs */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  onClick={() => setResponseTab('Positive')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                    responseTab === 'Positive'
                      ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Positive Responses</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    responseTab === 'Positive' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {sentimentCounts.Positive}
                  </span>
                </button>

                <button
                  onClick={() => setResponseTab('Prospect')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                    responseTab === 'Prospect'
                      ? 'bg-white text-amber-700 shadow-sm dark:bg-slate-900 dark:text-amber-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <AlertCircle className="size-3.5 text-amber-500" />
                  <span>Prospect Responses</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    responseTab === 'Prospect' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {sentimentCounts.Prospect}
                  </span>
                </button>

                <button
                  onClick={() => setResponseTab('Negative')}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                    responseTab === 'Negative'
                      ? 'bg-white text-rose-700 shadow-sm dark:bg-slate-900 dark:text-rose-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <XCircle className="size-3.5 text-rose-500" />
                  <span>Negative Responses</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    responseTab === 'Negative' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {sentimentCounts.Negative}
                  </span>
                </button>
              </div>

              {/* View Switcher Controls (Enabled specifically for Positive Responses) */}
              <div className="flex items-center gap-2">
                {responseTab === 'Positive' && (
                  <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
                    <button
                      onClick={() => setPositiveViewMode('tabular')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        positiveViewMode === 'tabular'
                          ? 'bg-[#0B1F5C] text-white shadow-2xs dark:bg-[#FFC000] dark:text-[#0B1F5C]'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      <TableIcon className="size-3.5" />
                      Tabular View
                    </button>
                    <button
                      onClick={() => setPositiveViewMode('calendar')}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        positiveViewMode === 'calendar'
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
                <Select value={tableChannelFilter} onValueChange={setTableChannelFilter}>
                  <SelectTrigger className="h-8 w-32 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="All Channels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Channels</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Call">Calls</SelectItem>
                  </SelectContent>
                </Select>

                {/* Table Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 size-3.5 text-slate-400" />
                  <Input
                    placeholder="Search responses..."
                    value={tableSearch}
                    onChange={e => setTableSearch(e.target.value)}
                    className="h-8 w-44 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Table or Calendar Content rendering */}
            <div className="mt-5">
              {/* Positive Tab in Calendar View Mode */}
              {responseTab === 'Positive' && positiveViewMode === 'calendar' ? (
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
                                    className={`truncate rounded px-1.5 py-1 text-left text-[10px] font-semibold transition hover:brightness-95 ${
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
                /* TABULAR VIEW (Either Positive Enhanced Table OR Prospect/Negative Clean Table) */
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:border-slate-800 dark:bg-slate-950/60">
                        {responseTab === 'Positive' ? (
                          <>
                            {/* Positive Responses Enhanced Table Columns */}
                            <th className="px-4 py-3.5">Lead Added Date</th>
                            <th className="px-4 py-3.5">Account Name</th>
                            <th className="px-4 py-3.5">Point of Contact (Lead)</th>
                            <th className="px-4 py-3.5">Response Date</th>
                            <th className="px-4 py-3.5">Response Channel</th>
                            <th className="px-4 py-3.5">Action Status</th>
                            <th className="px-4 py-3.5">Meetings Scheduled</th>
                            <th className="px-4 py-3.5">Meeting Sub-details</th>
                            <th className="px-4 py-3.5 text-right">Action</th>
                          </>
                        ) : (
                          <>
                            {/* Prospect & Negative Responses Clean Table Columns */}
                            <th className="px-4 py-3.5">Account Name</th>
                            <th className="px-4 py-3.5">Lead Name</th>
                            <th className="px-4 py-3.5">Response Date</th>
                            <th className="px-4 py-3.5">Response Channel</th>
                            <th className="px-4 py-3.5">Action Status</th>
                            <th className="px-4 py-3.5">Lead Added Date</th>
                            <th className="px-4 py-3.5 text-right">Details</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {activeTabLeads.map(lead => {
                        return (
                          <tr
                            key={lead.id}
                            className="group transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          >
                            {responseTab === 'Positive' ? (
                              <>
                                {/* Col 1: Lead Added Date */}
                                <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                                  {formatDate(lead.leadAddedDate)}
                                </td>

                                {/* Col 2: Account Name */}
                                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                                  <div className="flex items-center gap-2">
                                    <div className="grid size-6 place-items-center rounded bg-slate-100 text-[10px] font-bold text-[#0B1F5C] dark:bg-slate-800 dark:text-slate-300">
                                      {lead.account.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span>{lead.account}</span>
                                  </div>
                                </td>

                                {/* Col 3: Point of Contact (Lead) */}
                                <td className="px-4 py-3.5">
                                  <div>
                                    <div className="font-semibold text-slate-900 dark:text-white">
                                      {lead.leadName}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">{lead.title}</div>
                                  </div>
                                </td>

                                {/* Col 4: Response Date */}
                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                  {formatDate(lead.responseDate)}
                                </td>

                                {/* Col 5: Response Channel */}
                                <td className="px-4 py-3.5">
                                  <ChannelBadge channel={lead.channel} />
                                </td>

                                {/* Col 6: Action Status */}
                                <td className="px-4 py-3.5">
                                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 font-medium text-[11px]">
                                    {lead.actionStatus}
                                  </Badge>
                                </td>

                                {/* Col 7: Meetings Scheduled */}
                                <td className="px-4 py-3.5">
                                  <div className="flex items-center gap-1.5">
                                    <CalendarDays className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                      {lead.meetingsScheduled || '1 Meeting'}
                                    </span>
                                  </div>
                                </td>

                                {/* Col 8: Meeting Sub-details (Meeting Date, Follow-up Meeting Date, Type) */}
                                <td className="px-4 py-3.5">
                                  {lead.meetingDetails ? (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="secondary"
                                          className={`text-[10px] font-semibold ${
                                            lead.meetingDetails.type === 'New Meeting'
                                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                          }`}
                                        >
                                          {lead.meetingDetails.type}
                                        </Badge>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                                          {formatDate(lead.meetingDetails.meetingDate)}
                                        </span>
                                      </div>
                                      <div className="text-[11px] text-muted-foreground">
                                        Follow-up: <span className="font-medium text-slate-600 dark:text-slate-400">{formatDate(lead.meetingDetails.followUpMeetingDate)}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">Pending slot</span>
                                  )}
                                </td>

                                {/* Col 9: Action */}
                                <td className="px-4 py-3.5 text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-[11px] font-semibold border-slate-200 hover:bg-slate-100 dark:border-slate-700"
                                    onClick={() => setSelectedMeetingBriefing(lead)}
                                  >
                                    Briefing
                                  </Button>
                                </td>
                              </>
                            ) : (
                              <>
                                {/* Prospect & Negative Table Columns */}
                                {/* Col 1: Account Name */}
                                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                                  <div className="flex items-center gap-2">
                                    <div className="grid size-6 place-items-center rounded bg-slate-100 text-[10px] font-bold text-[#0B1F5C] dark:bg-slate-800 dark:text-slate-300">
                                      {lead.account.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span>{lead.account}</span>
                                  </div>
                                </td>

                                {/* Col 2: Lead Name */}
                                <td className="px-4 py-3.5">
                                  <div>
                                    <div className="font-semibold text-slate-900 dark:text-white">
                                      {lead.leadName}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">{lead.email}</div>
                                  </div>
                                </td>

                                {/* Col 3: Response Date */}
                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                  {formatDate(lead.responseDate)}
                                </td>

                                {/* Col 4: Response Channel */}
                                <td className="px-4 py-3.5">
                                  <ChannelBadge channel={lead.channel} />
                                </td>

                                {/* Col 5: Action Status */}
                                <td className="px-4 py-3.5">
                                  <Badge
                                    variant="outline"
                                    className={`text-[11px] font-semibold ${
                                      responseTab === 'Prospect'
                                        ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300'
                                        : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300'
                                    }`}
                                  >
                                    {lead.actionStatus}
                                  </Badge>
                                </td>

                                {/* Col 6: Lead Added Date */}
                                <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                                  {formatDate(lead.leadAddedDate)}
                                </td>

                                {/* Col 7: Details Trigger */}
                                <td className="px-4 py-3.5 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-[11px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400"
                                    onClick={() => setSelectedLeadRecord(lead)}
                                  >
                                    Inspect
                                  </Button>
                                </td>
                              </>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  {activeTabLeads.length === 0 && (
                    <div className="py-12 text-center text-xs text-muted-foreground">
                      No records match the current sentiment or channel filters.
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-950/40">
                    <span>Showing {activeTabLeads.length} of {filteredResponseLeads.length} classified responses</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[11px]"
                      onClick={() => {
                        downloadCsv(`${responseTab.toLowerCase()}-responses.csv`, activeTabLeads)
                        toast.success(`${responseTab} response records exported`)
                      }}
                    >
                      <Download className="mr-1 size-3" />
                      Download Table CSV
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* DRILL-DOWN DRAWERS (SHEETS) & MODALS */}
      {/* ─────────────────────────────────────────────────────────── */}

      {/* 1. EMAIL DRILL-DOWN SHEET */}
      <Sheet open={emailDrawerOpen} onOpenChange={setEmailDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded bg-blue-50 text-[#0B1F5C] dark:bg-blue-950 dark:text-blue-300">
                <Mail className="size-4" />
              </div>
              <SheetTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
                Email Sent Logs & Detailed Drill-Down
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs">
              Complete dispatch audit of New Emails vs Follow-up sequences across outbound campaigns.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border bg-slate-50 p-2.5 dark:bg-slate-900">
                <span className="text-muted-foreground">New Emails Sent:</span>{' '}
                <b className="text-slate-900 dark:text-white">{emailMetrics.newEmails}</b>
              </div>
              <div className="rounded-lg border bg-slate-50 p-2.5 dark:bg-slate-900">
                <span className="text-muted-foreground">Follow-up Emails Sent:</span>{' '}
                <b className="text-slate-900 dark:text-white">{emailMetrics.followUpEmails}</b>
              </div>
            </div>

            <div className="space-y-2">
              {filteredEmailLogs.map(item => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs transition hover:border-[#0B1F5C] dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
                  onClick={() => setSelectedEmail(item)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-semibold ${
                          item.type === 'New Email'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {item.type}
                      </Badge>
                      <h5 className="mt-1 font-semibold text-slate-900 dark:text-white text-xs">
                        {item.subject}
                      </h5>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${
                        item.status === 'Replied'
                          ? 'border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'Opened'
                          ? 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <div className="mt-2 text-[11px] text-muted-foreground line-clamp-2">
                    {item.snippet}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t pt-2 text-[11px] text-muted-foreground">
                    <span>To: <b>{item.leadName}</b> ({item.account})</span>
                    <span>{formatDate(item.date)} at {item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 2. LINKEDIN DRILL-DOWN SHEET */}
      <Sheet open={linkedInDrawerOpen} onOpenChange={setLinkedInDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded bg-sky-50 text-[#0a66c2] dark:bg-sky-950 dark:text-sky-300">
                <LinkedInIcon className="size-4" />
              </div>
              <SheetTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
                LinkedIn Activity Breakdown
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs">
              Live audit of Connection Requests Sent and Executive Direct Messages.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border bg-slate-50 p-2.5 dark:bg-slate-900">
                <span className="text-muted-foreground">Connection Requests:</span>{' '}
                <b className="text-slate-900 dark:text-white">{linkedInMetrics.connectionRequests}</b>
              </div>
              <div className="rounded-lg border bg-slate-50 p-2.5 dark:bg-slate-900">
                <span className="text-muted-foreground">Direct Messages Sent:</span>{' '}
                <b className="text-slate-900 dark:text-white">{linkedInMetrics.directMessages}</b>
              </div>
            </div>

            <div className="space-y-2">
              {filteredLinkedInLogs.map(item => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-semibold ${
                          item.type === 'Connection Request'
                            ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {item.type}
                      </Badge>
                      <h5 className="mt-1 font-semibold text-slate-900 dark:text-white text-xs">
                        {item.leadName} · <span className="font-normal text-muted-foreground">{item.account}</span>
                      </h5>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {item.status}
                    </Badge>
                  </div>

                  <div className="mt-2 rounded bg-slate-50 p-2.5 text-[11px] text-slate-700 italic dark:bg-slate-950 dark:text-slate-300">
                    &ldquo;{item.snippet}&rdquo;
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Industry: {item.industry}</span>
                    <span>{formatDate(item.date)} at {item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 3. CALLS DRILL-DOWN SHEET */}
      <Sheet open={callDrawerOpen} onOpenChange={setCallDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <PhoneCall className="size-4" />
              </div>
              <SheetTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
                Call Logs & Call Outcomes
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs">
              Audit logs of New Calls Made, Follow-up Calls Made, and Voicemails Left with dispositions.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border bg-slate-50 p-2 dark:bg-slate-900 text-center">
                <div className="text-muted-foreground text-[10px]">New Calls</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{callMetrics.newCalls}</div>
              </div>
              <div className="rounded-lg border bg-slate-50 p-2 dark:bg-slate-900 text-center">
                <div className="text-muted-foreground text-[10px]">Follow-up Calls</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{callMetrics.followUpCalls}</div>
              </div>
              <div className="rounded-lg border bg-slate-50 p-2 dark:bg-slate-900 text-center">
                <div className="text-muted-foreground text-[10px]">Voicemails</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{callMetrics.voicemails}</div>
              </div>
            </div>

            <div className="space-y-2">
              {filteredCallLogs.map(item => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 cursor-pointer hover:border-emerald-600 transition"
                  onClick={() => setSelectedCall(item)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {item.type}
                        </Badge>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Duration: {item.duration}
                        </span>
                      </div>
                      <h5 className="mt-1 font-semibold text-slate-900 dark:text-white text-xs">
                        {item.leadName} ({item.account})
                      </h5>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${
                        item.outcome === 'Connected'
                          ? 'border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.outcome === 'Voicemail'
                          ? 'border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {item.outcome}
                    </Badge>
                  </div>

                  <p className="mt-2 text-[11px] text-muted-foreground">
                    <b>Outcome Notes:</b> {item.notes}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground border-t pt-2">
                    <span>Region: {item.region}</span>
                    <span>{formatDate(item.date)} at {item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 4. POSITIVE RESPONSE MEETING BRIEFING DRAWER */}
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
                <div className="mt-1 text-muted-foreground">{selectedMeetingBriefing.email}</div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border p-3">
                    <div className="text-muted-foreground text-[10px]">Meeting Date & Time</div>
                    <div className="mt-1 font-bold text-slate-900 dark:text-white">
                      {formatDate(selectedMeetingBriefing.meetingDetails.meetingDate)}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {selectedMeetingBriefing.meetingDetails.meetingTime}
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="text-muted-foreground text-[10px]">Follow-up Meeting Date</div>
                    <div className="mt-1 font-bold text-slate-900 dark:text-white">
                      {formatDate(selectedMeetingBriefing.meetingDetails.followUpMeetingDate)}
                    </div>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                      Reserved slot
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="text-muted-foreground text-[10px]">Meeting Type</div>
                  <Badge className="mt-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                    {selectedMeetingBriefing.meetingDetails.type}
                  </Badge>
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

      {/* 5. PROSPECT / NEGATIVE INSPECT LEAD DRAWER */}
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
                <div className="text-muted-foreground text-[11px] mt-1">
                  {selectedLeadRecord.email}
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

              <Button
                className="w-full text-xs font-semibold mt-4"
                onClick={() => {
                  toast.success(`Action updated for ${selectedLeadRecord.leadName}`)
                  setSelectedLeadRecord(null)
                }}
              >
                Update Action Status
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* 6. WIREFRAME & ARCHITECTURE DIALOG */}
      <Dialog open={wireframeModalOpen} onOpenChange={setWireframeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
              Outreach UI Wireframe & Component Breakdown
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete layout wireframe, component mapping, and state breakdown designed to match HubSpot / Salesforce Lightning / Linear.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-4 text-xs">
            <div className="rounded-lg border bg-slate-50 p-3.5 dark:bg-slate-900 leading-relaxed font-mono text-[11px]">
              <div className="font-bold text-slate-800 dark:text-slate-200">[Section 1: Top] High-Level Metrics & Filters</div>
              <div className="text-muted-foreground pl-3">├── Filters: Industry Select, Region Select, Reset, Quick CSV Export</div>
              <div className="text-muted-foreground pl-3">└── KPI Cards: Unique Industries (12) | Unique Regions (6) | Total Outreaches (160) | Conversion %</div>
              <div className="mt-2 font-bold text-slate-800 dark:text-slate-200">[Section 2: Middle] Outreach Channels & Drill-down Views</div>
              <div className="text-muted-foreground pl-3">├── Email Card: New Emails | Follow-up Emails | Open Rate | [Drawer -> Sent Email Logs]</div>
              <div className="text-muted-foreground pl-3">├── LinkedIn Card: Connection Requests | Direct Messages | Acceptance Rate | [Drawer -> Breakdown]</div>
              <div className="text-muted-foreground pl-3">└── Calls Card: New Calls | Follow-up Calls | Voicemails | [Drawer -> Call Logs & Outcomes]</div>
              <div className="mt-2 font-bold text-slate-800 dark:text-slate-200">[Section 3: Analytics] Response Tracking & Classification</div>
              <div className="text-muted-foreground pl-3">├── Sentiment Bar Chart: Channel vs Sentiment (Positive / Prospect / Negative)</div>
              <div className="text-muted-foreground pl-3">└── Tabs: &quot;Prospect Responses&quot; | &quot;Negative Responses&quot; | &quot;Positive Responses&quot;</div>
              <div className="mt-2 font-bold text-slate-800 dark:text-slate-200">[Section 4: Tables] Response Detail Tables</div>
              <div className="text-muted-foreground pl-3">├── Prospect & Negative View: Account, Lead, Response Date, Channel, Action Status, Added Date</div>
              <div className="text-muted-foreground pl-3">└── Positive View: Enhanced Table with Meeting Sub-details (Meeting Date, Follow-up, Type)</div>
              <div className="text-muted-foreground pl-6">└── View Switcher: [Tabular View] &lt;=&gt; [Calendar View for Scheduled Meetings]</div>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setWireframeModalOpen(false)}>Close Specifications</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
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
