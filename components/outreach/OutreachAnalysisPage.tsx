'use client'

import React, { useState, useMemo } from 'react'
import {
  Mail, PhoneCall, Table as TableIcon, Download, Search,
  ChevronLeft, Building2, Globe, Send, TrendingUp, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  industries, regions, type Industry, type Region,
  industryRegionMap, downloadCsv
} from '@/lib/data'
import {
  seedEmailLogs, seedLinkedInLogs, seedCallLogs, seedResponseLeads
} from '@/lib/outreach-data'

// LinkedIn SVG Brand Icon
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  )
}

export interface OutreachAnalysisPageProps {
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
  onBackToDashboard?: () => void
}

export function OutreachAnalysisPage({
  selectedIndustry = 'All',
  setSelectedIndustry,
  selectedRegion = 'All',
  setSelectedRegion,
  startDate = '',
  endDate = '',
  onBackToDashboard
}: OutreachAnalysisPageProps) {
  // Tab / Slicer state: 'All' | 'Email' | 'LinkedIn' | 'Call'
  const [activeChannelTab, setActiveChannelTab] = useState<'All' | 'Email' | 'LinkedIn' | 'Call'>('All')

  // Sub-view: 'industry' | 'region'
  const [subView, setSubView] = useState<'industry' | 'region'>('industry')

  // Search filter inside tables
  const [searchQuery, setSearchQuery] = useState('')

  // Channel slicer flags for table columns
  const showEmail = activeChannelTab === 'All' || activeChannelTab === 'Email'
  const showLinkedIn = activeChannelTab === 'All' || activeChannelTab === 'LinkedIn'
  const showCalls = activeChannelTab === 'All' || activeChannelTab === 'Call'
  const showTotal = activeChannelTab === 'All'

  // ───────────────────────────────────────────────────────────
  // Filtered Datasets based on top-level Industry, Region & Date
  // ───────────────────────────────────────────────────────────
  const filteredEmailLogs = useMemo(() => {
    return seedEmailLogs.filter(e => {
      if (selectedIndustry !== 'All' && e.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && e.region !== selectedRegion) return false
      if (startDate && e.date < startDate) return false
      if (endDate && e.date > endDate) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate])

  const filteredLinkedInLogs = useMemo(() => {
    return seedLinkedInLogs.filter(l => {
      if (selectedIndustry !== 'All' && l.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && l.region !== selectedRegion) return false
      if (startDate && l.date < startDate) return false
      if (endDate && l.date > endDate) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate])

  const filteredCallLogs = useMemo(() => {
    return seedCallLogs.filter(c => {
      if (selectedIndustry !== 'All' && c.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && c.region !== selectedRegion) return false
      if (startDate && c.date < startDate) return false
      if (endDate && c.date > endDate) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate])

  const filteredResponseLeads = useMemo(() => {
    return seedResponseLeads.filter(r => {
      if (selectedIndustry !== 'All' && r.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && r.region !== selectedRegion) return false
      const rDate = r.responseDate || r.leadAddedDate
      if (startDate && rDate < startDate) return false
      if (endDate && rDate > endDate) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate])

  // Aggregate Metrics
  const emailMetrics = useMemo(() => {
    const newEmails = filteredEmailLogs.filter(e => e.type === 'New Email').length
    const followUpEmails = filteredEmailLogs.filter(e => e.type === 'Follow-up Email').length
    const opened = filteredEmailLogs.filter(e => e.status === 'Opened' || e.status === 'Replied').length
    const total = filteredEmailLogs.length
    const openRate = total ? Math.round((opened / total) * 100) : 0
    return { newEmails, followUpEmails, total, openRate }
  }, [filteredEmailLogs])

  const linkedInMetrics = useMemo(() => {
    const connectionRequests = filteredLinkedInLogs.filter(l => l.type === 'Connection Request').length
    const directMessages = filteredLinkedInLogs.filter(l => l.type === 'Direct Message').length
    const total = filteredLinkedInLogs.length
    return { connectionRequests, directMessages, total }
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

  const totalOutreachesCount = filteredEmailLogs.length + filteredLinkedInLogs.length + filteredCallLogs.length

  const uniqueIndustriesCount = useMemo(() => {
    const set = new Set<string>()
    filteredEmailLogs.forEach(l => set.add(l.industry))
    filteredLinkedInLogs.forEach(l => set.add(l.industry))
    filteredCallLogs.forEach(l => set.add(l.industry))
    return set.size
  }, [filteredEmailLogs, filteredLinkedInLogs, filteredCallLogs])

  const uniqueRegionsCount = useMemo(() => {
    const set = new Set<string>()
    filteredEmailLogs.forEach(l => set.add(l.region))
    filteredLinkedInLogs.forEach(l => set.add(l.region))
    filteredCallLogs.forEach(l => set.add(l.region))
    return set.size
  }, [filteredEmailLogs, filteredLinkedInLogs, filteredCallLogs])

  const sentimentCounts = useMemo(() => {
    const counts = { Positive: 0, Prospect: 0, Negative: 0, Total: filteredResponseLeads.length }
    filteredResponseLeads.forEach(r => {
      const resp = r.response || (r as any).sentiment
      if (resp === 'Positive') counts.Positive++
      else if (resp === 'Prospect') counts.Prospect++
      else if (resp === 'Negative') counts.Negative++
    })
    return counts
  }, [filteredResponseLeads])

  const positiveResponses = filteredResponseLeads.filter(r => (r.response || (r as any).sentiment) === 'Positive').length
  const responseRate = sentimentCounts.Total ? Math.round((sentimentCounts.Positive / sentimentCounts.Total) * 100) : 0

  // ───────────────────────────────────────────────────────────
  // Industry Aggregation for Tables
  // ───────────────────────────────────────────────────────────
  const industrySummary = useMemo(() => {
    return industries.map(ind => {
      const eLogs = filteredEmailLogs.filter(e => e.industry === ind)
      const lLogs = filteredLinkedInLogs.filter(l => l.industry === ind)
      const cLogs = filteredCallLogs.filter(c => c.industry === ind)
      const rLeads = filteredResponseLeads.filter(r => r.industry === ind)

      const emailTotal = eLogs.length
      const emailNew = eLogs.filter(e => e.type === 'New Email').length
      const emailFollowup = eLogs.filter(e => e.type === 'Follow-up Email').length

      const linkedInTotal = lLogs.length
      const linkedInReq = lLogs.filter(l => l.type === 'Connection Request').length
      const linkedInDm = lLogs.filter(l => l.type === 'Direct Message').length

      const callTotal = cLogs.length
      const callNew = cLogs.filter(c => c.type === 'New Call').length
      const callFollowup = cLogs.filter(c => c.type === 'Follow-up Call').length
      const callVoicemail = cLogs.filter(c => c.outcome === 'Voicemail').length

      const grandTotal = emailTotal + linkedInTotal + callTotal
      const positive = rLeads.filter(r => r.response === 'Positive').length
      const convRate = grandTotal ? Math.round((positive / grandTotal) * 100) : 0

      return {
        industry: ind,
        region: industryRegionMap[ind] || 'USA',
        emailTotal,
        emailNew,
        emailFollowup,
        linkedInTotal,
        linkedInReq,
        linkedInDm,
        callTotal,
        callNew,
        callFollowup,
        callVoicemail,
        grandTotal,
        positive,
        convRate
      }
    })
  }, [filteredEmailLogs, filteredLinkedInLogs, filteredCallLogs, filteredResponseLeads])

  const filteredIndustrySummary = useMemo(() => {
    if (!searchQuery.trim()) return industrySummary
    const q = searchQuery.toLowerCase()
    return industrySummary.filter(
      r => r.industry.toLowerCase().includes(q) || r.region.toLowerCase().includes(q)
    )
  }, [industrySummary, searchQuery])

  // Summary Totals for Table Footer
  const summaryTotals = useMemo(() => {
    return filteredIndustrySummary.reduce(
      (acc, row) => ({
        emailNew: acc.emailNew + row.emailNew,
        emailFollowup: acc.emailFollowup + row.emailFollowup,
        emailTotal: acc.emailTotal + row.emailTotal,
        linkedInReq: acc.linkedInReq + row.linkedInReq,
        linkedInDm: acc.linkedInDm + row.linkedInDm,
        linkedInTotal: acc.linkedInTotal + row.linkedInTotal,
        callNew: acc.callNew + row.callNew,
        callFollowup: acc.callFollowup + row.callFollowup,
        callVoicemail: acc.callVoicemail + row.callVoicemail,
        callTotal: acc.callTotal + row.callTotal,
        grandTotal: acc.grandTotal + row.grandTotal,
        positive: acc.positive + row.positive,
      }),
      {
        emailNew: 0,
        emailFollowup: 0,
        emailTotal: 0,
        linkedInReq: 0,
        linkedInDm: 0,
        linkedInTotal: 0,
        callNew: 0,
        callFollowup: 0,
        callVoicemail: 0,
        callTotal: 0,
        grandTotal: 0,
        positive: 0,
      }
    )
  }, [filteredIndustrySummary])

  // ───────────────────────────────────────────────────────────
  // Region Aggregation for Tables
  // ───────────────────────────────────────────────────────────
  const regionSummary = useMemo(() => {
    return regions.map(reg => {
      const eLogs = filteredEmailLogs.filter(e => e.region === reg)
      const lLogs = filteredLinkedInLogs.filter(l => l.region === reg)
      const cLogs = filteredCallLogs.filter(c => c.region === reg)
      const rLeads = filteredResponseLeads.filter(r => r.region === reg)

      const emailTotal = eLogs.length
      const emailNew = eLogs.filter(e => e.type === 'New Email').length
      const emailFollowup = eLogs.filter(e => e.type === 'Follow-up Email').length

      const linkedInTotal = lLogs.length
      const linkedInReq = lLogs.filter(l => l.type === 'Connection Request').length
      const linkedInDm = lLogs.filter(l => l.type === 'Direct Message').length

      const callTotal = cLogs.length
      const callNew = cLogs.filter(c => c.type === 'New Call').length
      const callFollowup = cLogs.filter(c => c.type === 'Follow-up Call').length
      const callVoicemail = cLogs.filter(c => c.outcome === 'Voicemail').length

      const grandTotal = emailTotal + linkedInTotal + callTotal
      const positive = rLeads.filter(r => r.response === 'Positive').length
      const convRate = grandTotal ? Math.round((positive / grandTotal) * 100) : 0

      const regionIndustries = industries.filter(ind => industryRegionMap[ind] === reg)

      return {
        region: reg,
        industries: regionIndustries,
        emailTotal,
        emailNew,
        emailFollowup,
        linkedInTotal,
        linkedInReq,
        linkedInDm,
        callTotal,
        callNew,
        callFollowup,
        callVoicemail,
        grandTotal,
        positive,
        convRate,
        share: totalOutreachesCount ? Math.round((grandTotal / totalOutreachesCount) * 100) : 0
      }
    })
  }, [filteredEmailLogs, filteredLinkedInLogs, filteredCallLogs, filteredResponseLeads, totalOutreachesCount])

  const filteredRegionSummary = useMemo(() => {
    if (!searchQuery.trim()) return regionSummary
    const q = searchQuery.toLowerCase()
    return regionSummary.filter(
      r =>
        r.region.toLowerCase().includes(q) ||
        r.industries.some(ind => ind.toLowerCase().includes(q))
    )
  }, [regionSummary, searchQuery])

  const regionSummaryTotals = useMemo(() => {
    return filteredRegionSummary.reduce(
      (acc, row) => ({
        emailNew: acc.emailNew + row.emailNew,
        emailFollowup: acc.emailFollowup + row.emailFollowup,
        emailTotal: acc.emailTotal + row.emailTotal,
        linkedInReq: acc.linkedInReq + row.linkedInReq,
        linkedInDm: acc.linkedInDm + row.linkedInDm,
        linkedInTotal: acc.linkedInTotal + row.linkedInTotal,
        callNew: acc.callNew + row.callNew,
        callFollowup: acc.callFollowup + row.callFollowup,
        callVoicemail: acc.callVoicemail + row.callVoicemail,
        callTotal: acc.callTotal + row.callTotal,
        grandTotal: acc.grandTotal + row.grandTotal,
        positive: acc.positive + row.positive,
      }),
      {
        emailNew: 0,
        emailFollowup: 0,
        emailTotal: 0,
        linkedInReq: 0,
        linkedInDm: 0,
        linkedInTotal: 0,
        callNew: 0,
        callFollowup: 0,
        callVoicemail: 0,
        callTotal: 0,
        grandTotal: 0,
        positive: 0,
      }
    )
  }, [filteredRegionSummary])

  // CSV Exporter for Sliced Views
  const handleExportCsv = () => {
    if (subView === 'region') {
      const rows = filteredRegionSummary.map(r => {
        const row: Record<string, any> = {
          'Regions Targeted': r.region,
          'Industries Targeted': r.industries.join(', '),
        }
        if (showEmail) {
          row['Email Outreach (New Emails)'] = r.emailNew
          row['Email Outreach (Follow-up Emails)'] = r.emailFollowup
          row['Email Outreach (Total)'] = r.emailTotal
        }
        if (showLinkedIn) {
          row['LinkedIn Outreach (Connection Requests)'] = r.linkedInReq
          row['LinkedIn Outreach (Direct Messages)'] = r.linkedInDm
          row['LinkedIn Outreach (Total)'] = r.linkedInTotal
        }
        if (showCalls) {
          row['Calls Outreach (New Calls)'] = r.callNew
          row['Calls Outreach (Follow-ups)'] = r.callFollowup
          row['Calls Outreach (Voicemails)'] = r.callVoicemail
          row['Calls Outreach (Total)'] = r.callTotal
        }
        if (showTotal) {
          row['Total Outreaches'] = r.grandTotal
        }
        return row
      })
      downloadCsv('outreach-region-analysis.csv', rows)
      toast.success(`Exported region outreach analysis`)
    } else {
      const rows = filteredIndustrySummary.map(r => {
        const row: Record<string, any> = {
          'Industries Targeted': r.industry,
          'Regions Targeted': r.region,
        }
        if (showEmail) {
          row['Email Outreach (New Emails)'] = r.emailNew
          row['Email Outreach (Follow-up Emails)'] = r.emailFollowup
          row['Email Outreach (Total)'] = r.emailTotal
        }
        if (showLinkedIn) {
          row['LinkedIn Outreach (Connection Requests)'] = r.linkedInReq
          row['LinkedIn Outreach (Direct Messages)'] = r.linkedInDm
          row['LinkedIn Outreach (Total)'] = r.linkedInTotal
        }
        if (showCalls) {
          row['Calls Outreach (New Calls)'] = r.callNew
          row['Calls Outreach (Follow-ups)'] = r.callFollowup
          row['Calls Outreach (Voicemails)'] = r.callVoicemail
          row['Calls Outreach (Total)'] = r.callTotal
        }
        if (showTotal) {
          row['Total Outreaches'] = r.grandTotal
        }
        return row
      })
      downloadCsv('outreach-analysis-breakdown.csv', rows)
      toast.success(`Exported outreach analysis breakdown matrix`)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. PROMINENT PAGE HEADER WITH BACK BUTTON & TELEMETRY       */}
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
                <ChevronLeft className="size-4 text-slate-700 dark:text-slate-300" />
                <span>Back to Dashboard</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#0B1F5C] text-xs font-black text-white dark:bg-[#FFC000] dark:text-[#0B1F5C]">
                  2
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
                  Outreach Analysis
                </h1>
                <Badge className="bg-[#FFC000] text-[#0B1F5C] font-bold text-[10px] hover:bg-[#FFC000]/90">
                  Multichannel Telemetry
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Multichannel outbound telemetry and touchpoint dispatch logs across 8 target industries and 3 regions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-[#0B1F5C] shadow-xs hover:bg-slate-100 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-[#FFC000] dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <Download className="size-3.5 text-[#0B1F5C] dark:text-[#FFC000]" />
              <span>Download Table CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. TOP KPI OVERVIEW CARDS                                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Outreaches Made */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Outreaches Made
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Send className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
            {totalOutreachesCount.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            ({filteredEmailLogs.length} Email · {filteredLinkedInLogs.length} LinkedIn · {filteredCallLogs.length} Calls)
          </p>
        </div>

        {/* Card 2: Positive response rate */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Positive response rate
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
            {sentimentCounts.Total ? Math.round((sentimentCounts.Positive / sentimentCounts.Total) * 100) : 0}%
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {sentimentCounts.Positive} Positive across all touchpoints
          </p>
        </div>

        {/* Card 3: Unique industries outreached */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Unique industries outreached
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Building2 className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
            {uniqueIndustriesCount}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Outreach coverage across 8 verticals
          </p>
        </div>

        {/* Card 4: Unique regions outreached */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Unique regions outreached
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Globe className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
            {uniqueRegionsCount}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            USA · Canada · Saudi Arabia
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. CHANNELS SLICERS & VIEWS TOOLBAR */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Main Channel Slicers */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-800">
            <button
              onClick={() => setActiveChannelTab('All')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                activeChannelTab === 'All'
                  ? 'bg-[#0B1F5C] text-white shadow-xs dark:bg-[#FFC000] dark:text-[#0B1F5C]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <TableIcon className="size-3.5" />
              <span>All Channels ({totalOutreachesCount})</span>
            </button>

            <button
              onClick={() => setActiveChannelTab('Email')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                activeChannelTab === 'Email'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300'
              }`}
            >
              <Mail className="size-3.5" />
              <span>Email ({filteredEmailLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveChannelTab('LinkedIn')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                activeChannelTab === 'LinkedIn'
                  ? 'bg-[#0a66c2] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0a66c2] dark:text-slate-400 dark:hover:text-sky-300'
              }`}
            >
              <LinkedInIcon className="size-3.5" />
              <span>LinkedIn ({filteredLinkedInLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveChannelTab('Call')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                activeChannelTab === 'Call'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-300'
              }`}
            >
              <PhoneCall className="size-3.5" />
              <span>Voice Calls ({filteredCallLogs.length})</span>
            </button>
          </div>

          {/* Sub-view Switcher (Industry vs Region) */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setSubView('industry')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                subView === 'industry'
                  ? 'bg-white text-[#0B1F5C] shadow-xs dark:bg-slate-900 dark:text-[#FFC000]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Building2 className="size-3.5" />
              Industry Breakdown
            </button>
            <button
              onClick={() => setSubView('region')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                subView === 'region'
                  ? 'bg-white text-[#0B1F5C] shadow-xs dark:bg-slate-900 dark:text-[#FFC000]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Globe className="size-3.5" />
              Region Breakdown
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Showing breakdown by {subView === 'industry' ? '8 target industries' : '3 regions'}
              {activeChannelTab !== 'All' && (
                <span className="ml-1.5 inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  Slicer Active: {activeChannelTab === 'Email' ? 'Email Outreach' : activeChannelTab === 'LinkedIn' ? 'LinkedIn Outreach' : 'Voice Calls'}
                </span>
              )}
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
            <Input
              placeholder="Search by industry or region..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 3. TABLE RENDERING ACCORDING TO ACTIVE VIEW */}
        {/* ─────────────────────────────────────────────────────────── */}

        {/* VIEW 1: COMPREHENSIVE OUTREACH BREAKDOWN MATRIX */}
        {subView === 'industry' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                {/* TIER 1: MAIN HEADINGS */}
                <tr className="border-b bg-slate-100/90 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <th rowSpan={2} className="px-4 py-3 align-middle border-r border-slate-200 dark:border-slate-700">
                    Industries Targeted
                  </th>
                  <th rowSpan={2} className="px-4 py-3 align-middle border-r border-slate-200 dark:border-slate-700">
                    Regions Targeted
                  </th>

                  {/* Email Outreach Heading */}
                  {showEmail && (
                    <th colSpan={3} className="px-3 py-2 text-center text-blue-900 bg-blue-50/90 border-r border-b border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60">
                      Email Outreach
                    </th>
                  )}

                  {/* LinkedIn Outreach Heading */}
                  {showLinkedIn && (
                    <th colSpan={3} className="px-3 py-2 text-center text-sky-900 bg-sky-50/90 border-r border-b border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900/60">
                      LinkedIn Outreach
                    </th>
                  )}

                  {/* Calls Outreach Heading */}
                  {showCalls && (
                    <th colSpan={4} className="px-3 py-2 text-center text-emerald-900 bg-emerald-50/90 border-r border-b border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60">
                      Calls Outreach
                    </th>
                  )}

                  {/* Total Outreaches Heading (Shown in All Channels mode) */}
                  {showTotal && (
                    <th rowSpan={2} className="px-4 py-3 text-right align-middle font-black text-[#0B1F5C] dark:text-[#FFC000] border-l border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90">
                      Total Outreaches
                    </th>
                  )}
                </tr>

                {/* TIER 2: SUB-COLUMNS BREAKDOWN */}
                <tr className="border-b bg-slate-50 text-[10.5px] font-semibold text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                  {/* Email Sub-columns */}
                  {showEmail && (
                    <>
                      <th className="px-2.5 py-2 text-center text-blue-800 bg-blue-50/40 dark:bg-blue-950/20 dark:text-blue-300">
                        New Emails
                      </th>
                      <th className="px-2.5 py-2 text-center text-blue-800 bg-blue-50/40 dark:bg-blue-950/20 dark:text-blue-300">
                        Follow-up Emails
                      </th>
                      <th className="px-2.5 py-2 text-center font-bold text-blue-950 bg-blue-100/60 border-r border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-900">
                        {activeChannelTab === 'Email' ? 'Total Email Outreaches' : 'Total'}
                      </th>
                    </>
                  )}

                  {/* LinkedIn Sub-columns */}
                  {showLinkedIn && (
                    <>
                      <th className="px-2.5 py-2 text-center text-sky-800 bg-sky-50/40 dark:bg-sky-950/20 dark:text-sky-300">
                        Connection Requests
                      </th>
                      <th className="px-2.5 py-2 text-center text-sky-800 bg-sky-50/40 dark:bg-sky-950/20 dark:text-sky-300">
                        Direct Messages
                      </th>
                      <th className="px-2.5 py-2 text-center font-bold text-sky-950 bg-sky-100/60 border-r border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-900">
                        {activeChannelTab === 'LinkedIn' ? 'Total LinkedIn Outreaches' : 'Total'}
                      </th>
                    </>
                  )}

                  {/* Calls Sub-columns */}
                  {showCalls && (
                    <>
                      <th className="px-2.5 py-2 text-center text-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                        New Calls
                      </th>
                      <th className="px-2.5 py-2 text-center text-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                        Follow-ups
                      </th>
                      <th className="px-2.5 py-2 text-center text-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                        Voicemails
                      </th>
                      <th className="px-2.5 py-2 text-center font-bold text-emerald-950 bg-emerald-100/60 border-r border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-900">
                        {activeChannelTab === 'Call' ? 'Total Calls Outreaches' : 'Total'}
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredIndustrySummary.map(row => (
                  <tr key={row.industry} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    {/* 1- Industry Targeted */}
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-[#0B1F5C] dark:bg-slate-800 dark:text-[#FFC000]">
                          {row.industry.slice(0, 2).toUpperCase()}
                        </span>
                        <span>{row.industry}</span>
                      </div>
                    </td>

                    {/* 2- Region Targeted */}
                    <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-800">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                        {row.region}
                      </span>
                    </td>

                    {/* 3- Email Outreach Breakdown */}
                    {showEmail && (
                      <>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-blue-50/15">
                          {row.emailNew}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-blue-50/15">
                          {row.emailFollowup}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums font-bold text-blue-900 dark:text-blue-300 bg-blue-50/40 border-r border-slate-100 dark:border-slate-800">
                          {row.emailTotal}
                        </td>
                      </>
                    )}

                    {/* 4- LinkedIn Outreach Breakdown */}
                    {showLinkedIn && (
                      <>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-sky-50/15">
                          {row.linkedInReq}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-sky-50/15">
                          {row.linkedInDm}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums font-bold text-sky-900 dark:text-sky-300 bg-sky-50/40 border-r border-slate-100 dark:border-slate-800">
                          {row.linkedInTotal}
                        </td>
                      </>
                    )}

                    {/* 5- Calls Outreach Breakdown */}
                    {showCalls && (
                      <>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-emerald-50/15">
                          {row.callNew}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-emerald-50/15">
                          {row.callFollowup}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-emerald-50/15">
                          {row.callVoicemail}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-50/40 border-r border-slate-100 dark:border-slate-800">
                          {row.callTotal}
                        </td>
                      </>
                    )}

                    {/* Total Outreaches (Only shown in All Channels mode) */}
                    {showTotal && (
                      <td className="px-4 py-3 text-right font-black text-[#0B1F5C] dark:text-[#FFC000] tabular-nums border-l border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                        {row.grandTotal}
                      </td>
                    )}
                  </tr>
                ))}

                {filteredIndustrySummary.length === 0 && (
                  <tr>
                    <td colSpan={13} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No industries match the search query.
                    </td>
                  </tr>
                )}
              </tbody>

              {/* SUMMARY TOTAL FOOTER ROW */}
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-100/95 font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                  <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">
                    Total ({filteredIndustrySummary.length} Industries)
                  </td>
                  <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-normal">
                    Across 3 Regions
                  </td>

                  {/* Email Totals */}
                  {showEmail && (
                    <>
                      <td className="px-2.5 py-3 text-center tabular-nums text-blue-900 dark:text-blue-300 bg-blue-100/40">
                        {summaryTotals.emailNew}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums text-blue-900 dark:text-blue-300 bg-blue-100/40">
                        {summaryTotals.emailFollowup}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums font-black text-blue-950 dark:text-blue-200 bg-blue-200/50 border-r border-slate-200 dark:border-slate-700">
                        {summaryTotals.emailTotal}
                      </td>
                    </>
                  )}

                  {/* LinkedIn Totals */}
                  {showLinkedIn && (
                    <>
                      <td className="px-2.5 py-3 text-center tabular-nums text-sky-900 dark:text-sky-300 bg-sky-100/40">
                        {summaryTotals.linkedInReq}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums text-sky-900 dark:text-sky-300 bg-sky-100/40">
                        {summaryTotals.linkedInDm}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums font-black text-sky-950 dark:text-sky-200 bg-sky-200/50 border-r border-slate-200 dark:border-slate-700">
                        {summaryTotals.linkedInTotal}
                      </td>
                    </>
                  )}

                  {/* Calls Totals */}
                  {showCalls && (
                    <>
                      <td className="px-2.5 py-3 text-center tabular-nums text-emerald-900 dark:text-emerald-300 bg-emerald-100/40">
                        {summaryTotals.callNew}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums text-emerald-900 dark:text-emerald-300 bg-emerald-100/40">
                        {summaryTotals.callFollowup}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums text-emerald-900 dark:text-emerald-300 bg-emerald-100/40">
                        {summaryTotals.callVoicemail}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums font-black text-emerald-950 dark:text-emerald-200 bg-emerald-200/50 border-r border-slate-200 dark:border-slate-700">
                        {summaryTotals.callTotal}
                      </td>
                    </>
                  )}

                  {/* Grand Total */}
                  {showTotal && (
                    <td className="px-4 py-3 text-right font-black text-[#0B1F5C] dark:text-[#FFC000] tabular-nums border-l border-slate-200 dark:border-slate-700 bg-slate-200/60 dark:bg-slate-700/60 text-sm">
                      {summaryTotals.grandTotal}
                    </td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* VIEW 2: REGION BREAKDOWN TABLE (MATCHING INDUSTRY BREAKDOWN MATRIX) */}
        {subView === 'region' && (
          <div className="overflow-x-auto rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                {/* TIER 1: MAIN HEADINGS */}
                <tr className="border-b bg-slate-100/90 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <th rowSpan={2} className="px-4 py-3 align-middle border-r border-slate-200 dark:border-slate-700">
                    Regions Targeted
                  </th>
                  <th rowSpan={2} className="px-4 py-3 align-middle border-r border-slate-200 dark:border-slate-700">
                    Industries Targeted
                  </th>

                  {/* Email Outreach Heading */}
                  {showEmail && (
                    <th colSpan={3} className="px-3 py-2 text-center text-blue-900 bg-blue-50/90 border-r border-b border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900/60">
                      Email Outreach
                    </th>
                  )}

                  {/* LinkedIn Outreach Heading */}
                  {showLinkedIn && (
                    <th colSpan={3} className="px-3 py-2 text-center text-sky-900 bg-sky-50/90 border-r border-b border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900/60">
                      LinkedIn Outreach
                    </th>
                  )}

                  {/* Calls Outreach Heading */}
                  {showCalls && (
                    <th colSpan={4} className="px-3 py-2 text-center text-emerald-900 bg-emerald-50/90 border-r border-b border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60">
                      Calls Outreach
                    </th>
                  )}

                  {/* Total Outreaches Heading (Shown in All Channels mode) */}
                  {showTotal && (
                    <th rowSpan={2} className="px-4 py-3 text-right align-middle font-black text-[#0B1F5C] dark:text-[#FFC000] border-l border-slate-200 dark:border-slate-700 bg-slate-100/90 dark:bg-slate-800/90">
                      Total Outreaches
                    </th>
                  )}
                </tr>

                {/* TIER 2: SUB-COLUMNS BREAKDOWN */}
                <tr className="border-b bg-slate-50 text-[10.5px] font-semibold text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                  {/* Email Sub-columns */}
                  {showEmail && (
                    <>
                      <th className="px-2.5 py-2 text-center text-blue-800 bg-blue-50/40 dark:bg-blue-950/20 dark:text-blue-300">
                        New Emails
                      </th>
                      <th className="px-2.5 py-2 text-center text-blue-800 bg-blue-50/40 dark:bg-blue-950/20 dark:text-blue-300">
                        Follow-up Emails
                      </th>
                      <th className="px-2.5 py-2 text-center font-bold text-blue-950 bg-blue-100/60 border-r border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-900">
                        {activeChannelTab === 'Email' ? 'Total Email Outreaches' : 'Total'}
                      </th>
                    </>
                  )}

                  {/* LinkedIn Sub-columns */}
                  {showLinkedIn && (
                    <>
                      <th className="px-2.5 py-2 text-center text-sky-800 bg-sky-50/40 dark:bg-sky-950/20 dark:text-sky-300">
                        Connection Requests
                      </th>
                      <th className="px-2.5 py-2 text-center text-sky-800 bg-sky-50/40 dark:bg-sky-950/20 dark:text-sky-300">
                        Direct Messages
                      </th>
                      <th className="px-2.5 py-2 text-center font-bold text-sky-950 bg-sky-100/60 border-r border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-900">
                        {activeChannelTab === 'LinkedIn' ? 'Total LinkedIn Outreaches' : 'Total'}
                      </th>
                    </>
                  )}

                  {/* Calls Sub-columns */}
                  {showCalls && (
                    <>
                      <th className="px-2.5 py-2 text-center text-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                        New Calls
                      </th>
                      <th className="px-2.5 py-2 text-center text-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                        Follow-ups
                      </th>
                      <th className="px-2.5 py-2 text-center text-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                        Voicemails
                      </th>
                      <th className="px-2.5 py-2 text-center font-bold text-emerald-950 bg-emerald-100/60 border-r border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-900">
                        {activeChannelTab === 'Call' ? 'Total Calls Outreaches' : 'Total'}
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRegionSummary.map(row => (
                  <tr key={row.region} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Region Targeted */}
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 items-center justify-center rounded bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-[#FFC000]">
                          <Globe className="size-3.5" />
                        </span>
                        <span className="font-bold text-sm text-[#0B1F5C] dark:text-white">{row.region}</span>
                      </div>
                    </td>

                    {/* Industries Targeted in this region */}
                    <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap gap-1">
                        {row.industries.map(ind => (
                          <span key={ind} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Email Outreach Breakdown */}
                    {showEmail && (
                      <>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-blue-50/15">
                          {row.emailNew}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-blue-50/15">
                          {row.emailFollowup}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums font-bold text-blue-900 dark:text-blue-300 bg-blue-50/40 border-r border-slate-100 dark:border-slate-800">
                          {row.emailTotal}
                        </td>
                      </>
                    )}

                    {/* LinkedIn Outreach Breakdown */}
                    {showLinkedIn && (
                      <>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-sky-50/15">
                          {row.linkedInReq}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-sky-50/15">
                          {row.linkedInDm}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums font-bold text-sky-900 dark:text-sky-300 bg-sky-50/40 border-r border-slate-100 dark:border-slate-800">
                          {row.linkedInTotal}
                        </td>
                      </>
                    )}

                    {/* Calls Outreach Breakdown */}
                    {showCalls && (
                      <>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-emerald-50/15">
                          {row.callNew}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-emerald-50/15">
                          {row.callFollowup}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums text-slate-700 dark:text-slate-300 bg-emerald-50/15">
                          {row.callVoicemail}
                        </td>
                        <td className="px-2.5 py-3 text-center tabular-nums font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-50/40 border-r border-slate-100 dark:border-slate-800">
                          {row.callTotal}
                        </td>
                      </>
                    )}

                    {/* Total Outreaches (Only shown in All Channels mode) */}
                    {showTotal && (
                      <td className="px-4 py-3 text-right font-black text-[#0B1F5C] dark:text-[#FFC000] tabular-nums border-l border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                        {row.grandTotal}
                      </td>
                    )}
                  </tr>
                ))}

                {filteredRegionSummary.length === 0 && (
                  <tr>
                    <td colSpan={13} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No regions match the search query.
                    </td>
                  </tr>
                )}
              </tbody>

              {/* SUMMARY TOTAL FOOTER ROW */}
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-100/95 font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                  <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700">
                    Total ({filteredRegionSummary.length} Regions)
                  </td>
                  <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-normal">
                    Across 8 Industries
                  </td>

                  {/* Email Totals */}
                  {showEmail && (
                    <>
                      <td className="px-2.5 py-3 text-center tabular-nums text-blue-900 dark:text-blue-300 bg-blue-100/40">
                        {regionSummaryTotals.emailNew}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums text-blue-900 dark:text-blue-300 bg-blue-100/40">
                        {regionSummaryTotals.emailFollowup}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums font-black text-blue-950 dark:text-blue-200 bg-blue-200/50 border-r border-slate-200 dark:border-slate-700">
                        {regionSummaryTotals.emailTotal}
                      </td>
                    </>
                  )}

                  {/* LinkedIn Totals */}
                  {showLinkedIn && (
                    <>
                      <td className="px-2.5 py-3 text-center tabular-nums text-sky-900 dark:text-sky-300 bg-sky-100/40">
                        {regionSummaryTotals.linkedInReq}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums text-sky-900 dark:text-sky-300 bg-sky-100/40">
                        {regionSummaryTotals.linkedInDm}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums font-black text-sky-950 dark:text-sky-200 bg-sky-200/50 border-r border-slate-200 dark:border-slate-700">
                        {regionSummaryTotals.linkedInTotal}
                      </td>
                    </>
                  )}

                  {/* Calls Totals */}
                  {showCalls && (
                    <>
                      <td className="px-2.5 py-3 text-center tabular-nums text-emerald-900 dark:text-emerald-300 bg-emerald-100/40">
                        {regionSummaryTotals.callNew}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums text-emerald-900 dark:text-emerald-300 bg-emerald-100/40">
                        {regionSummaryTotals.callFollowup}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums text-emerald-900 dark:text-emerald-300 bg-emerald-100/40">
                        {regionSummaryTotals.callVoicemail}
                      </td>
                      <td className="px-2.5 py-3 text-center tabular-nums font-black text-emerald-950 dark:text-emerald-200 bg-emerald-200/50 border-r border-slate-200 dark:border-slate-700">
                        {regionSummaryTotals.callTotal}
                      </td>
                    </>
                  )}

                  {/* Grand Total */}
                  {showTotal && (
                    <td className="px-4 py-3 text-right font-black text-[#0B1F5C] dark:text-[#FFC000] tabular-nums border-l border-slate-200 dark:border-slate-700 bg-slate-200/60 dark:bg-slate-700/60 text-sm">
                      {regionSummaryTotals.grandTotal}
                    </td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
