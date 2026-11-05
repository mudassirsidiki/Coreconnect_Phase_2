'use client'

import React, { useState, useMemo } from 'react'
import {
  Mail, PhoneCall, TrendingUp, Building2, Globe, Send, BarChart3, ArrowRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  type Industry, type Region, type Channel
} from '@/lib/data'
import {
  seedEmailLogs, seedLinkedInLogs, seedCallLogs, seedResponseLeads
} from '@/lib/outreach-data'
import { type OpportunityStage } from '@/lib/opportunities-data'

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
  startDate?: string
  setStartDate?: (v: string) => void
  endDate?: string
  setEndDate?: (v: string) => void
  datePreset?: string
  setDatePreset?: (v: string) => void
  selectedStageTab?: 'All' | OpportunityStage
  setSelectedStageTab?: (v: 'All' | OpportunityStage) => void
  onNavigateToOutreachAnalysis?: () => void
}

export function OutreachSection({
  selectedIndustry = 'All',
  selectedRegion = 'All',
  startDate = '',
  endDate = '',
  onNavigateToOutreachAnalysis
}: OutreachSectionProps = {}) {
  const [isLinkedInHovered, setIsLinkedInHovered] = useState(false)
  const [isNewCallHovered, setIsNewCallHovered] = useState(false)
  const [isFollowUpCallHovered, setIsFollowUpCallHovered] = useState(false)

  // 1. Filtered email logs
  const filteredEmailLogs = useMemo(() => {
    return seedEmailLogs.filter(log => {
      if (selectedIndustry !== 'All' && log.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && log.region !== selectedRegion) return false
      if (startDate && log.date < startDate) return false
      if (endDate && log.date > endDate) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate])

  // 2. Filtered LinkedIn logs
  const filteredLinkedInLogs = useMemo(() => {
    return seedLinkedInLogs.filter(log => {
      if (selectedIndustry !== 'All' && log.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && log.region !== selectedRegion) return false
      if (startDate && log.date < startDate) return false
      if (endDate && log.date > endDate) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate])

  // 3. Filtered Call logs
  const filteredCallLogs = useMemo(() => {
    return seedCallLogs.filter(log => {
      if (selectedIndustry !== 'All' && log.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && log.region !== selectedRegion) return false
      if (startDate && log.date < startDate) return false
      if (endDate && log.date > endDate) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate])

  // 4. Filtered response leads
  const filteredResponseLeads = useMemo(() => {
    return seedResponseLeads.filter(lead => {
      if (selectedIndustry !== 'All' && lead.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && lead.region !== selectedRegion) return false
      const rDate = lead.responseDate || lead.leadAddedDate
      if (startDate && rDate < startDate) return false
      if (endDate && rDate > endDate) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate])

  // Overall aggregate counts
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

  // Sentiment counts
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

  // Email channel metrics
  const emailMetrics = useMemo(() => {
    const newEmails = filteredEmailLogs.filter(e => e.type === 'New Email').length
    const followUpEmails = filteredEmailLogs.filter(e => e.type === 'Follow-up Email').length
    const opened = filteredEmailLogs.filter(e => e.status === 'Opened' || e.status === 'Replied').length
    const openRate = filteredEmailLogs.length ? Math.round((opened / filteredEmailLogs.length) * 100) : 0
    return { total: filteredEmailLogs.length, newEmails, followUpEmails, openRate }
  }, [filteredEmailLogs])

  // LinkedIn channel metrics
  const linkedInMetrics = useMemo(() => {
    const connectionRequests = filteredLinkedInLogs.filter(l => l.type === 'Connection Request').length
    const directMessages = filteredLinkedInLogs.filter(l => l.type === 'Direct Message').length
    const acceptanceRate = 72 // High-performing B2B LinkedIn acceptance benchmark
    return { total: filteredLinkedInLogs.length, connectionRequests, directMessages, acceptanceRate }
  }, [filteredLinkedInLogs])

  // Call channel metrics
  const callMetrics = useMemo(() => {
    const newCalls = filteredCallLogs.filter(c => c.type === 'New Call').length
    const followUpCalls = filteredCallLogs.filter(c => c.type === 'Follow-up Call').length
    const voicemails = filteredCallLogs.filter(c => c.outcome === 'Voicemail').length
    const connected = filteredCallLogs.filter(c => c.outcome === 'Connected').length
    const connectRate = filteredCallLogs.length ? Math.round((connected / filteredCallLogs.length) * 100) : 0
    return { total: filteredCallLogs.length, newCalls, followUpCalls, voicemails, connectRate }
  }, [filteredCallLogs])

  // Email sub-type response breakdowns (New Emails vs Follow-up Emails)
  const newEmailResponseStats = useMemo(() => {
    const list = filteredResponseLeads.filter(r => r.channel === 'Email' && r.outreachType === 'New Outreach')
    const positive = list.filter(r => r.response === 'Positive').length
    const prospect = list.filter(r => r.response === 'Prospect').length
    const negative = list.filter(r => r.response === 'Negative').length
    return { total: list.length, positive, prospect, negative }
  }, [filteredResponseLeads])

  const followUpEmailResponseStats = useMemo(() => {
    const list = filteredResponseLeads.filter(r => r.channel === 'Email' && r.outreachType === 'Follow-up')
    const positive = list.filter(r => r.response === 'Positive').length
    const prospect = list.filter(r => r.response === 'Prospect').length
    const negative = list.filter(r => r.response === 'Negative').length
    return { total: list.length, positive, prospect, negative }
  }, [filteredResponseLeads])

  return (
    <section id="section-outreach" className="scroll-mt-56 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. SECTION HEADING: 2- OUTREACH                             */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-6.5 items-center justify-center rounded-lg bg-[#0B1F5C] text-xs font-black text-white dark:bg-[#FFC000] dark:text-[#0B1F5C] shadow-2xs">
              2
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
              2- Outreach
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Multi-channel outreach execution, response rates, and regional touchpoint coverage
          </p>
        </div>
        {onNavigateToOutreachAnalysis && (
          <Button
            size="sm"
            onClick={onNavigateToOutreachAnalysis}
            className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C] dark:hover:bg-[#FFC000]/90 font-semibold gap-1.5 shadow-xs text-xs cursor-pointer"
          >
            <BarChart3 className="size-4" />
            See Details
            <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. OVERVIEW KPI CARDS                                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Outreaches Made */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 shadow-2xs transition hover:shadow-xs dark:border-slate-800 dark:bg-slate-800/50 border-t-2 border-t-blue-500">
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

        {/* Card 2: Positive Response Rate */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 shadow-2xs transition hover:shadow-xs dark:border-slate-800 dark:bg-slate-800/50 border-t-2 border-t-emerald-500">
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

        {/* Card 3: Unique Industries Outreached */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 shadow-2xs transition hover:shadow-xs dark:border-slate-800 dark:bg-slate-800/50 border-t-2 border-t-amber-500">
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

        {/* Card 4: Unique Regions Outreached */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 shadow-2xs transition hover:shadow-xs dark:border-slate-800 dark:bg-slate-800/50 border-t-2 border-t-purple-500">
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
      {/* 3. OUTREACH CHANNELS BREAKDOWN                              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-950/40">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Channel Breakdown
            </span>
            <span className="text-[11px] text-muted-foreground">
              (Email · LinkedIn · Calls)
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* EMAIL CHANNEL CARD */}
          <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-2xs transition hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-blue-500">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-lg bg-blue-50 text-[#0B1F5C] dark:bg-blue-950/80 dark:text-blue-300">
                    <Mail className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Email Outreach
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      {emailMetrics.total} Total Sequences
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="border-blue-200 bg-blue-50/70 text-[10px] font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
                  {emailMetrics.openRate}% Open
                </Badge>
              </div>

              {/* TWO PARTS: 1- TOTAL EMAILS & 2- FOLLOW UP EMAILS */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                {/* 1- TOTAL NEW EMAILS */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-850/60">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Total New Emails
                    </div>
                    <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                      {emailMetrics.newEmails}
                    </div>
                  </div>

                  {/* Breakdown for Total New Emails: Positive, Negative, Prospect */}
                  <div className="mt-3.5 border-t border-slate-200/70 pt-2.5 dark:border-slate-750">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between rounded-md bg-emerald-50/90 px-2 py-1 text-xs dark:bg-emerald-950/50">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">Positive</span>
                        <span className="font-extrabold text-emerald-800 dark:text-emerald-200">{newEmailResponseStats.positive}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-rose-50/90 px-2 py-1 text-xs dark:bg-rose-950/50">
                        <span className="font-semibold text-rose-700 dark:text-rose-400 text-[11px]">Negative</span>
                        <span className="font-extrabold text-rose-800 dark:text-rose-200">{newEmailResponseStats.negative}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-amber-50/90 px-2 py-1 text-xs dark:bg-amber-950/50">
                        <span className="font-semibold text-amber-700 dark:text-amber-400 text-[11px]">Prospect</span>
                        <span className="font-extrabold text-amber-800 dark:text-amber-200">{newEmailResponseStats.prospect}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2- FOLLOW UP EMAILS */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-850/60">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Follow-up Emails
                    </div>
                    <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                      {emailMetrics.followUpEmails}
                    </div>
                  </div>

                  {/* Breakdown for Follow Up Emails: Positive, Negative, Prospect */}
                  <div className="mt-3.5 border-t border-slate-200/70 pt-2.5 dark:border-slate-750">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between rounded-md bg-emerald-50/90 px-2 py-1 text-xs dark:bg-emerald-950/50">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">Positive</span>
                        <span className="font-extrabold text-emerald-800 dark:text-emerald-200">{followUpEmailResponseStats.positive}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-rose-50/90 px-2 py-1 text-xs dark:bg-rose-950/50">
                        <span className="font-semibold text-rose-700 dark:text-rose-400 text-[11px]">Negative</span>
                        <span className="font-extrabold text-rose-800 dark:text-rose-200">{followUpEmailResponseStats.negative}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-amber-50/90 px-2 py-1 text-xs dark:bg-amber-950/50">
                        <span className="font-semibold text-amber-700 dark:text-amber-400 text-[11px]">Prospect</span>
                        <span className="font-extrabold text-amber-800 dark:text-amber-200">{followUpEmailResponseStats.prospect}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* LINKEDIN CHANNEL CARD */}
          <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-2xs transition hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-sky-500 overflow-visible">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-xl bg-sky-50 text-[#0a66c2] dark:bg-sky-950/80 dark:text-sky-300">
                    <LinkedInIcon className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      LinkedIn Engagement
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      {linkedInMetrics.total} Total Touches
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="border-sky-200 bg-sky-50/70 text-[10px] font-bold text-[#0a66c2] dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
                  Active
                </Badge>
              </div>

              {/* TWO PARTS: 1- CONNECTION REQUESTS & 2- DIRECT MESSAGES */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                {/* 1- CONNECTION REQUESTS */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-850/60">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Connection Requests
                    </div>
                    <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                      {linkedInMetrics.connectionRequests}
                    </div>
                  </div>

                  {/* Below 25: Acceptance Rate with a good percentage */}
                  <div className="mt-3.5 border-t border-slate-200/70 pt-2.5 dark:border-slate-750">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Acceptance Rate
                    </span>
                    <div className="flex items-center justify-between rounded-md bg-emerald-50/90 px-2 py-1 text-xs dark:bg-emerald-950/50">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px] flex items-center gap-1">
                        <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400" />
                        Accepted
                      </span>
                      <span className="font-extrabold text-emerald-800 dark:text-emerald-200 text-xs">
                        {linkedInMetrics.acceptanceRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2- DIRECT MESSAGES */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-850/60 relative">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Direct Messages
                    </div>
                    <div className="mt-0.5 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                      {linkedInMetrics.directMessages}
                    </div>
                  </div>

                  {/* Below 25: Total Responses (20) with Hover Popup */}
                  <div className="mt-3.5 border-t border-slate-200/70 pt-2.5 dark:border-slate-750">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Responses
                    </span>

                    {/* Hover Trigger with Popup */}
                    <div
                      className="group/popup relative inline-block w-full cursor-pointer"
                      onMouseEnter={() => setIsLinkedInHovered(true)}
                      onMouseLeave={() => setIsLinkedInHovered(false)}
                    >
                      <div className="flex items-center justify-between rounded-md bg-sky-50/90 hover:bg-sky-100/90 px-2 py-1 text-xs transition-colors border border-sky-100 dark:border-sky-900/60 dark:bg-sky-950/50 dark:hover:bg-sky-900/60">
                        <span className="font-semibold text-sky-800 dark:text-sky-300 text-[11px] flex items-center gap-1">
                          Total Responses
                          <span className="text-[10px] text-sky-500 font-normal">ⓘ</span>
                        </span>
                        <span className="font-extrabold text-sky-900 dark:text-sky-100 text-xs bg-sky-200/60 dark:bg-sky-900/80 px-1.5 py-0.2 rounded">
                          20
                        </span>
                      </div>

                      {/* Hover Popup of Positive, Prospect, and Negative */}
                      <div
                        className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl transition-all duration-200 z-50 dark:border-slate-700 dark:bg-slate-900 ${
                          isLinkedInHovered
                            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                            : 'opacity-0 invisible translate-y-1.5'
                        } group-hover/popup:pointer-events-auto group-hover/popup:opacity-100 group-hover/popup:visible group-hover/popup:translate-y-0`}
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            DM Responses
                          </span>
                          <span className="text-[10px] font-extrabold text-[#0B1F5C] dark:text-white">
                            20 Total
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between rounded-md bg-emerald-50/90 px-2 py-0.5 text-xs dark:bg-emerald-950/50">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">Positive</span>
                            <span className="font-extrabold text-emerald-800 dark:text-emerald-200">14</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-amber-50/90 px-2 py-0.5 text-xs dark:bg-amber-950/50">
                            <span className="font-semibold text-amber-700 dark:text-amber-400 text-[11px]">Prospect</span>
                            <span className="font-extrabold text-amber-800 dark:text-amber-200">4</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-rose-50/90 px-2 py-0.5 text-xs dark:bg-rose-950/50">
                            <span className="font-semibold text-rose-700 dark:text-rose-400 text-[11px]">Negative</span>
                            <span className="font-extrabold text-rose-800 dark:text-rose-200">2</span>
                          </div>
                        </div>
                        {/* Caret pointing down */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px size-0 border-x-4 border-x-transparent border-t-4 border-t-white dark:border-t-slate-900" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* CALLS CHANNEL CARD */}
          <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-2xs transition hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-emerald-500 overflow-visible">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                    <PhoneCall className="size-4.5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Voice & Phone Calls
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      {callMetrics.total} Total Calls
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50/70 text-[10px] font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {callMetrics.connectRate}% Connect
                </Badge>
              </div>

              {/* THREE PARTS: 1- NEW CALLS, 2- FOLLOW-UP CALLS, 3- VOICEMAILS */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800">
                {/* 1- NEW CALLS */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 sm:p-3 dark:border-slate-800 dark:bg-slate-850/60 relative">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                      New Calls
                    </div>
                    <div className="mt-0.5 text-2xl font-extrabold text-[#0B1F5C] dark:text-white">
                      {callMetrics.newCalls}
                    </div>
                  </div>

                  {/* Below New Calls: Total Responses with Hover Popup */}
                  <div className="mt-3.5 border-t border-slate-200/70 pt-2.5 dark:border-slate-750">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Responses
                    </span>

                    {/* Hover Trigger with Popup */}
                    <div
                      className="group/popupNew relative inline-block w-full cursor-pointer"
                      onMouseEnter={() => setIsNewCallHovered(true)}
                      onMouseLeave={() => setIsNewCallHovered(false)}
                    >
                      <div className="flex items-center justify-between rounded-md bg-emerald-50/90 hover:bg-emerald-100/90 px-1.5 py-1 text-xs transition-colors border border-emerald-200/70 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 shadow-2xs">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-300 text-[10px] flex items-center gap-0.5 truncate">
                          Total
                          <span className="text-[9px] text-emerald-600 font-normal">ⓘ</span>
                        </span>
                        <span className="font-extrabold text-emerald-900 dark:text-emerald-100 text-xs bg-emerald-200/60 dark:bg-emerald-900/80 px-1 py-0.2 rounded shrink-0">
                          12
                        </span>
                      </div>

                      {/* Hover Popup of Positive, Prospect, and Negative */}
                      <div
                        className={`pointer-events-none absolute bottom-full left-0 mb-2 w-48 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl transition-all duration-200 z-50 dark:border-slate-700 dark:bg-slate-900 ${
                          isNewCallHovered
                            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                            : 'opacity-0 invisible translate-y-1.5'
                        } group-hover/popupNew:pointer-events-auto group-hover/popupNew:opacity-100 group-hover/popupNew:visible group-hover/popupNew:translate-y-0`}
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            New Call Responses
                          </span>
                          <span className="text-[10px] font-extrabold text-[#0B1F5C] dark:text-white">
                            12 Total
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between rounded-md bg-emerald-50/90 px-2 py-0.5 text-xs dark:bg-emerald-950/50">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">Positive</span>
                            <span className="font-extrabold text-emerald-800 dark:text-emerald-200">8</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-amber-50/90 px-2 py-0.5 text-xs dark:bg-amber-950/50">
                            <span className="font-semibold text-amber-700 dark:text-amber-400 text-[11px]">Prospect</span>
                            <span className="font-extrabold text-amber-800 dark:text-amber-200">3</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-rose-50/90 px-2 py-0.5 text-xs dark:bg-rose-950/50">
                            <span className="font-semibold text-rose-700 dark:text-rose-400 text-[11px]">Negative</span>
                            <span className="font-extrabold text-rose-800 dark:text-rose-200">1</span>
                          </div>
                        </div>
                        <div className="absolute top-full left-6 -mt-px size-0 border-x-4 border-x-transparent border-t-4 border-t-white dark:border-t-slate-900" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2- FOLLOW-UP CALLS */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 sm:p-3 dark:border-slate-800 dark:bg-slate-850/60 relative">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                      Follow-ups
                    </div>
                    <div className="mt-0.5 text-2xl font-extrabold text-[#0B1F5C] dark:text-white">
                      {callMetrics.followUpCalls}
                    </div>
                  </div>

                  {/* Below Follow-up Calls: Total Responses with Hover Popup */}
                  <div className="mt-3.5 border-t border-slate-200/70 pt-2.5 dark:border-slate-750">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Responses
                    </span>

                    {/* Hover Trigger with Popup */}
                    <div
                      className="group/popupFol relative inline-block w-full cursor-pointer"
                      onMouseEnter={() => setIsFollowUpCallHovered(true)}
                      onMouseLeave={() => setIsFollowUpCallHovered(false)}
                    >
                      <div className="flex items-center justify-between rounded-md bg-emerald-50/90 hover:bg-emerald-100/90 px-1.5 py-1 text-xs transition-colors border border-emerald-200/70 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 shadow-2xs">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-300 text-[10px] flex items-center gap-0.5 truncate">
                          Total
                          <span className="text-[9px] text-emerald-600 font-normal">ⓘ</span>
                        </span>
                        <span className="font-extrabold text-emerald-900 dark:text-emerald-100 text-xs bg-emerald-200/60 dark:bg-emerald-900/80 px-1 py-0.2 rounded shrink-0">
                          8
                        </span>
                      </div>

                      {/* Hover Popup of Positive, Prospect, and Negative */}
                      <div
                        className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl transition-all duration-200 z-50 dark:border-slate-700 dark:bg-slate-900 ${
                          isFollowUpCallHovered
                            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                            : 'opacity-0 invisible translate-y-1.5'
                        } group-hover/popupFol:pointer-events-auto group-hover/popupFol:opacity-100 group-hover/popupFol:visible group-hover/popupFol:translate-y-0`}
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Follow-up Responses
                          </span>
                          <span className="text-[10px] font-extrabold text-[#0B1F5C] dark:text-white">
                            8 Total
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between rounded-md bg-emerald-50/90 px-2 py-0.5 text-xs dark:bg-emerald-950/50">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">Positive</span>
                            <span className="font-extrabold text-emerald-800 dark:text-emerald-200">6</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-amber-50/90 px-2 py-0.5 text-xs dark:bg-amber-950/50">
                            <span className="font-semibold text-amber-700 dark:text-amber-400 text-[11px]">Prospect</span>
                            <span className="font-extrabold text-amber-800 dark:text-amber-200">1</span>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-rose-50/90 px-2 py-0.5 text-xs dark:bg-rose-950/50">
                            <span className="font-semibold text-rose-700 dark:text-rose-400 text-[11px]">Negative</span>
                            <span className="font-extrabold text-rose-800 dark:text-rose-200">1</span>
                          </div>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px size-0 border-x-4 border-x-transparent border-t-4 border-t-white dark:border-t-slate-900" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3- VOICEMAILS (NOTHING ON VOICEMAILS) */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 sm:p-3 dark:border-slate-800 dark:bg-slate-850/60">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                      Voicemails
                    </div>
                    <div className="mt-0.5 text-2xl font-extrabold text-[#0B1F5C] dark:text-white">
                      {callMetrics.voicemails}
                    </div>
                  </div>

                  {/* Empty bottom section to maintain height alignment without any breakdown or popup */}
                  <div className="mt-3.5 border-t border-slate-200/40 pt-2.5 dark:border-slate-800">
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block py-1 text-center">
                      —
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
