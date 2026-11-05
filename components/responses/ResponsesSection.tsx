'use client'

import React, { useMemo } from 'react'
import {
  MessageSquare, CheckCircle2, AlertCircle, XCircle,
  Download, BarChart3, ArrowRight, CalendarDays
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { downloadCsv } from '@/lib/data'
import { seedResponseLeads } from '@/lib/outreach-data'

export interface ResponsesSectionProps {
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
  globalSearch?: string
  onNavigateToResponsesAnalysis?: (tab?: 'All' | 'Positive' | 'Prospect' | 'Negative') => void
}

export function ResponsesSection({
  selectedIndustry = 'All',
  selectedRegion = 'All',
  startDate = '',
  endDate = '',
  globalSearch = '',
  onNavigateToResponsesAnalysis
}: ResponsesSectionProps) {
  // Filtered Response Leads reacting to Global Slicers (Industry, Region, Date Range)
  const filteredResponseLeads = useMemo(() => {
    return seedResponseLeads.filter(r => {
      if (selectedIndustry !== 'All' && r.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && r.region !== selectedRegion) return false
      const rDate = r.responseDate || r.leadAddedDate
      if (startDate && rDate < startDate) return false
      if (endDate && rDate > endDate) return false
      if (globalSearch && !`${r.leadName} ${r.account} ${r.email}`.toLowerCase().includes(globalSearch.toLowerCase())) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate, globalSearch])

  // Metric counts
  const totalCount = filteredResponseLeads.length
  const positiveCount = filteredResponseLeads.filter(r => r.response === 'Positive').length
  const prospectCount = filteredResponseLeads.filter(r => r.response === 'Prospect').length
  const negativeCount = filteredResponseLeads.filter(r => r.response === 'Negative').length

  const positiveRate = totalCount ? Math.round((positiveCount / totalCount) * 100) : 0

  const bookedMeetingsCount = useMemo(() => {
    return filteredResponseLeads
      .filter(r => r.response === 'Positive' && r.meetingDetails?.meetingDate)
      .reduce((sum, r) => {
        if (r.meetingDetails?.meetingsList && r.meetingDetails.meetingsList.length > 0) {
          return sum + r.meetingDetails.meetingsList.length
        }
        return sum + 1
      }, 0)
  }, [filteredResponseLeads])

  const handleExportCsv = () => {
    const rows = filteredResponseLeads.map(r => ({
      'Account Name': r.account,
      'Lead Name': r.leadName,
      'Title': r.title,
      'Email': r.email,
      'Industry': r.industry,
      'Region': r.region,
      'Channel': r.channel,
      'Response Sentiment': r.response,
      'Action Status': r.actionStatus,
      'Response Date': r.responseDate,
      'Lead Added Date': r.leadAddedDate
    }))
    downloadCsv('responses-register.csv', rows)
    toast.success('Responses register CSV exported successfully')
  }

  return (
    <section id="section-response" className="scroll-mt-56 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. SECTION HEADING: 5- RESPONSES                            */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-6.5 items-center justify-center rounded-lg bg-[#0B1F5C] text-xs font-black text-white dark:bg-[#FFC000] dark:text-[#0B1F5C] shadow-2xs">
              5
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
              5- Responses
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Sentiment classifications, scheduled discovery meetings, and prospect dispositions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onNavigateToResponsesAnalysis && (
            <Button
              size="sm"
              onClick={() => onNavigateToResponsesAnalysis('All')}
              className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C] dark:hover:bg-[#FFC000]/90 font-semibold gap-1.5 shadow-xs text-xs cursor-pointer"
            >
              <BarChart3 className="size-4" />
              See Details
              <ArrowRight className="size-3.5" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs font-medium gap-1.5 cursor-pointer"
          >
            <Download className="size-3.5" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. THE 4 RESPONSES CARDS ON DASHBOARD                       */}
      {/*    1- Total Responses                                       */}
      {/*    2- Positive Responses                                    */}
      {/*    3- Prospect Responses                                    */}
      {/*    4- Negative Responses                                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: TOTAL RESPONSES */}
        <Card
          onClick={() => onNavigateToResponsesAnalysis?.('All')}
          className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-blue-500 cursor-pointer group"
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Responses
              </span>
              <div className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 group-hover:scale-105 transition-transform">
                <MessageSquare className="size-4.5" />
              </div>
            </div>

            <div className="mt-2 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
              {totalCount}
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-2.5 dark:border-slate-800">
              ({positiveCount} Positive · {prospectCount} Prospect · {negativeCount} Negative)
            </p>
          </div>
        </Card>

        {/* CARD 2: POSITIVE RESPONSES */}
        <Card
          onClick={() => onNavigateToResponsesAnalysis?.('Positive')}
          className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-emerald-500 cursor-pointer group"
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Positive Responses
              </span>
              <div className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="size-4.5" />
              </div>
            </div>

            <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {positiveCount}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5 dark:border-slate-800">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                {positiveRate}% Positive Rate
              </span>
              <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                <CalendarDays className="size-3 text-emerald-600 dark:text-emerald-400" />
                {bookedMeetingsCount} Meetings
              </span>
            </div>
          </div>
        </Card>

        {/* CARD 3: PROSPECT RESPONSES */}
        <Card
          onClick={() => onNavigateToResponsesAnalysis?.('Prospect')}
          className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-amber-500 cursor-pointer group"
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Prospect Responses
              </span>
              <div className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 group-hover:scale-105 transition-transform">
                <AlertCircle className="size-4.5" />
              </div>
            </div>

            <div className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {prospectCount}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5 dark:border-slate-800">
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                In Nurture Pipeline
              </span>
              <span className="text-muted-foreground">
                Follow-ups Scheduled
              </span>
            </div>
          </div>
        </Card>

        {/* CARD 4: NEGATIVE RESPONSES */}
        <Card
          onClick={() => onNavigateToResponsesAnalysis?.('Negative')}
          className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-rose-500 cursor-pointer group"
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Negative Responses
              </span>
              <div className="grid size-9 place-items-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 group-hover:scale-105 transition-transform">
                <XCircle className="size-4.5" />
              </div>
            </div>

            <div className="mt-2 text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {negativeCount}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2.5 dark:border-slate-800">
              <span className="font-semibold text-rose-700 dark:text-rose-300">
                Disqualified Leads
              </span>
              <span className="text-muted-foreground">
                Opt-outs & Budget Freezes
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
