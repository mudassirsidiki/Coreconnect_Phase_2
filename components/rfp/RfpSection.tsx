'use client'

import React, { useState, useMemo } from 'react'
import {
  FileText, CheckCircle2, Clock,
  FileCheck2, Download, Plus, Search,
  XCircle, BarChart3, ChevronRight, Briefcase, ArrowRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { industries, regions, type Industry, type Region, downloadCsv, money, formatDate } from '@/lib/data'
import {
  initialRfpData,
  type RfpRecord,
  type RfpStatus
} from '@/lib/rfp-data'

export interface RfpSectionProps {
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
  onNavigateToRfpAnalysis?: (category?: string) => void
}

export function RfpSection({
  selectedIndustry = 'All',
  selectedRegion = 'All',
  startDate = '',
  endDate = '',
  onNavigateToRfpAnalysis
}: RfpSectionProps) {
  const [rfpList, setRfpList] = useState<RfpRecord[]>(initialRfpData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Breakdown Modal state (opens when clicking any card's detail button)
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false)
  const [modalCategory, setModalCategory] = useState<'All' | 'Researched' | 'Submitted' | 'Pending'>('All')
  const [modalSearch, setModalSearch] = useState('')

  // New RFP Form state
  const [newTitle, setNewTitle] = useState('')
  const [newClient, setNewClient] = useState('')
  const [newIndustry, setNewIndustry] = useState<Industry>('Banking')
  const [newRegion, setNewRegion] = useState<Region>('USA')
  const [newValue, setNewValue] = useState('750000')
  const [newDeadline, setNewDeadline] = useState('2026-11-30')
  const [newStatus, setNewStatus] = useState<RfpStatus>('Drafting')
  const [newLeadOwner, setNewLeadOwner] = useState('Avery Miller')
  const [newScope, setNewScope] = useState('')

  // Filtered dataset reacting to top-level Slicers (Industry, Region, Date Range)
  const filteredRfps = useMemo(() => {
    return rfpList.filter(rfp => {
      if (selectedIndustry !== 'All' && rfp.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && rfp.region !== selectedRegion) return false
      if (startDate && rfp.date < startDate) return false
      if (endDate && rfp.date > endDate) return false
      return true
    })
  }, [rfpList, selectedIndustry, selectedRegion, startDate, endDate])

  // ───────────────────────────────────────────────────────────
  // THE 3 SPECIFIC RFP PIPELINE METRIC CARDS
  // 1. RFP Researched
  // 2. RFP Submitted with (won, lost, in progress in same card)
  // 3. RFP Pending
  // ───────────────────────────────────────────────────────────

  // 1. RFP Researched
  const researchedRfps = useMemo(() => {
    return filteredRfps.filter(r => r.status === 'Researched' || r.status === 'Drafting')
  }, [filteredRfps])
  const researchedCount = researchedRfps.length
  const researchedValue = useMemo(() => {
    return researchedRfps.reduce((sum, r) => sum + r.contractValue, 0)
  }, [researchedRfps])
  const researchedIndustriesCount = useMemo(() => {
    return new Set(researchedRfps.map(r => r.industry)).size
  }, [researchedRfps])

  // 2. RFP Submitted (with won, lost, in progress in same card)
  const submittedWonRfps = useMemo(() => filteredRfps.filter(r => r.status === 'Won'), [filteredRfps])
  const submittedLostRfps = useMemo(() => filteredRfps.filter(r => r.status === 'Lost'), [filteredRfps])
  const submittedInProgressRfps = useMemo(() => {
    return filteredRfps.filter(r => r.status === 'Submitted' || r.status === 'Under Review')
  }, [filteredRfps])

  const submittedWonCount = submittedWonRfps.length
  const submittedLostCount = submittedLostRfps.length
  const submittedInProgressCount = submittedInProgressRfps.length
  const totalSubmittedCount = submittedWonCount + submittedLostCount + submittedInProgressCount
  const totalSubmittedValue = useMemo(() => {
    return [...submittedWonRfps, ...submittedLostRfps, ...submittedInProgressRfps].reduce((sum, r) => sum + r.contractValue, 0)
  }, [submittedWonRfps, submittedLostRfps, submittedInProgressRfps])

  const submittedWinRate = useMemo(() => {
    const decided = submittedWonCount + submittedLostCount
    if (!decided) return totalSubmittedCount > 0 ? 67 : 0
    return Math.round((submittedWonCount / decided) * 100)
  }, [submittedWonCount, submittedLostCount, totalSubmittedCount])

  // 3. RFP Pending
  const pendingRfps = useMemo(() => {
    return filteredRfps.filter(r => r.status === 'Pending')
  }, [filteredRfps])
  const pendingCount = pendingRfps.length
  const pendingValue = useMemo(() => {
    return pendingRfps.reduce((sum, r) => sum + r.contractValue, 0)
  }, [pendingRfps])

  // Open detail breakdown dialog
  const handleOpenBreakdown = (category: 'All' | 'Researched' | 'Submitted' | 'Pending') => {
    setModalCategory(category)
    setModalSearch('')
    setBreakdownModalOpen(true)
  }

  // Filtered RFP list inside modal
  const modalFilteredRfps = useMemo(() => {
    return filteredRfps.filter(r => {
      if (modalCategory === 'Researched' && r.status !== 'Researched' && r.status !== 'Drafting') return false
      if (modalCategory === 'Submitted' && r.status !== 'Won' && r.status !== 'Lost' && r.status !== 'Submitted' && r.status !== 'Under Review') return false
      if (modalCategory === 'Pending' && r.status !== 'Pending') return false

      if (modalSearch.trim()) {
        const q = modalSearch.toLowerCase()
        const matchTitle = r.title.toLowerCase().includes(q)
        const matchClient = r.clientName.toLowerCase().includes(q)
        const matchNumber = r.rfpNumber.toLowerCase().includes(q)
        const matchIndustry = r.industry.toLowerCase().includes(q)
        const matchRegion = r.region.toLowerCase().includes(q)
        const matchStatus = r.status.toLowerCase().includes(q)
        if (!matchTitle && !matchClient && !matchNumber && !matchIndustry && !matchRegion && !matchStatus) return false
      }
      return true
    })
  }, [filteredRfps, modalCategory, modalSearch])

  // CSV Export
  const handleExportCsv = (recordsToExport: RfpRecord[] = filteredRfps) => {
    const rows = recordsToExport.map(r => ({
      'RFP Number': r.rfpNumber,
      'Title': r.title,
      'Client': r.clientName,
      'Industry': r.industry,
      'Region': r.region,
      'Contract Value': r.contractValue,
      'Submission Deadline': r.submissionDeadline,
      'Status': r.status,
      'Win Probability (%)': r.winProbability,
      'Lead Owner': r.leadOwner,
      'Compliance': r.complianceStatus,
      'Notes': r.notes
    }))
    downloadCsv('request-for-proposals-register.csv', rows)
    toast.success(`Exported ${recordsToExport.length} RFPs to CSV`)
  }

  // Create RFP
  const handleCreateRfp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newClient.trim()) {
      toast.error('Please enter RFP title and client organization')
      return
    }

    const nextNumber = `RFP-2026-${String(rfpList.length + 80).padStart(3, '0')}`
    const newRecord: RfpRecord = {
      id: `RFP-${Date.now()}`,
      rfpNumber: nextNumber,
      title: newTitle.trim(),
      clientName: newClient.trim(),
      industry: newIndustry,
      region: newRegion,
      date: new Date().toISOString().slice(0, 10),
      submissionDeadline: newDeadline,
      contractValue: parseInt(newValue, 10) || 500000,
      status: newStatus,
      winProbability: 75,
      leadOwner: newLeadOwner,
      scopeSummary: newScope.trim() || 'Comprehensive technical RFP response and architecture roadmap.',
      deliverables: ['Technical Approach', 'Pricing Schedule', 'Security Compliance Matrix'],
      complianceStatus: 'Fully Compliant',
      notes: 'New RFP registered in pipeline.'
    }

    setRfpList(prev => [newRecord, ...prev])
    setIsAddModalOpen(false)
    setNewTitle('')
    setNewClient('')
    setNewScope('')
    toast.success(`RFP ${nextNumber} registered successfully!`)
  }

  return (
    <section id="section-rfp" className="scroll-mt-56 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. SECTION HEADING: 4- REQUEST FOR PROPOSALS                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-6.5 items-center justify-center rounded-lg bg-[#0B1F5C] text-xs font-black text-white dark:bg-[#FFC000] dark:text-[#0B1F5C] shadow-2xs">
              4
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
              4- Request for proposals
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            RFP pipeline tracking, proposal drafting stages, tender submissions, and win rates
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onNavigateToRfpAnalysis && (
            <Button
              size="sm"
              onClick={() => onNavigateToRfpAnalysis('All')}
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
            onClick={() => handleExportCsv(filteredRfps)}
            className="text-xs font-medium gap-1.5 cursor-pointer"
          >
            <Download className="size-3.5" />
            Download RFP Register
          </Button>
          <Button
            size="sm"
            className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C] dark:hover:bg-[#FFC000]/90 font-semibold gap-1.5 shadow-xs cursor-pointer text-xs"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="size-4" />
            Submit New RFP
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. THE 3 RFP PIPELINE CARDS                                 */}
      {/*    1- RFP Researched                                        */}
      {/*    2- RFP Submitted (Won, Lost, In-progress in same card)   */}
      {/*    3- RFP Pending                                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: RFP RESEARCHED */}
        <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-indigo-500">
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                <Search className="size-4.5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                RFP Researched
              </h4>
            </div>

            {/* Headline Metric */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                {researchedCount}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateToRfpAnalysis ? onNavigateToRfpAnalysis('Researched') : handleOpenBreakdown('Researched')}
              className="w-full justify-between font-semibold text-xs border-indigo-200/80 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:hover:text-indigo-300 transition-all shadow-2xs cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <BarChart3 className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                Click to See Details
              </span>
              <ChevronRight className="size-3.5 text-slate-400" />
            </Button>
          </div>
        </Card>

        {/* CARD 2: RFP SUBMITTED WITH (WON, LOST, IN PROGRESS IN SAME CARD) */}
        <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-sky-500">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400">
                  <FileCheck2 className="size-4.5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  RFP Submitted
                </h4>
              </div>
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800">
                {submittedWinRate}% Won
              </span>
            </div>

            {/* Headline Metric + Won, Lost, In-progress in the SAME card */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                {totalSubmittedCount}
              </div>

              {/* Sub-categories in same card: Won, Lost, In progress */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    Won
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {submittedWonCount}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 font-bold">·</span>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-rose-700 dark:text-rose-300">
                    Lost
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {submittedLostCount}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 font-bold">·</span>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300">
                    In-progress
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {submittedInProgressCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateToRfpAnalysis ? onNavigateToRfpAnalysis('Submitted') : handleOpenBreakdown('Submitted')}
              className="w-full justify-between font-semibold text-xs border-sky-200/80 bg-white hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:hover:text-sky-300 transition-all shadow-2xs cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="size-3.5 text-sky-600 dark:text-sky-400" />
                Click to See Details
              </span>
              <ChevronRight className="size-3.5 text-slate-400" />
            </Button>
          </div>
        </Card>

        {/* CARD 3: RFP PENDING */}
        <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-amber-500">
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
                <Clock className="size-4.5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                RFP Pending
              </h4>
            </div>

            {/* Headline Metric */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                {pendingCount}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateToRfpAnalysis ? onNavigateToRfpAnalysis('Pending') : handleOpenBreakdown('Pending')}
              className="w-full justify-between font-semibold text-xs border-amber-200/80 bg-white hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:hover:text-amber-300 transition-all shadow-2xs cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-600 dark:text-amber-400" />
                Click to See Details
              </span>
              <ChevronRight className="size-3.5 text-slate-400" />
            </Button>
          </div>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. BREAKDOWN MODAL (TABULAR DETAILS)                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Dialog open={breakdownModalOpen} onOpenChange={setBreakdownModalOpen}>
        <DialogContent
          className="w-[96vw] max-w-[1550px] sm:max-w-[96vw] md:max-w-[96vw] lg:max-w-[1500px] xl:max-w-[1600px] max-h-[92vh] flex flex-col p-0 overflow-hidden border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          style={{ width: '96vw', maxWidth: '1600px' }}
        >
          {/* Header */}
          <div className="border-b border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#0B1F5C] dark:bg-slate-800 dark:text-[#FFC000] border border-blue-100/80 dark:border-slate-700">
                  <FileText className="size-4.5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                    Request For Proposal (RFP) Breakdown
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Detailed telemetry across Researched, Submitted, and Pending proposal solicitations.
                  </DialogDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 pr-8 sm:pr-10">
                <Button
                  size="sm"
                  onClick={() => handleExportCsv(modalFilteredRfps)}
                  className="h-8 gap-1.5 px-3 text-xs font-semibold !bg-black !text-white hover:!bg-neutral-800 dark:!bg-black dark:!text-white border border-black shadow-xs cursor-pointer shrink-0"
                >
                  <Download className="size-3.5 text-white" />
                  Download CSV
                </Button>
              </div>
            </div>

            {/* Modal Category Switcher & Search Bar */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setModalCategory('All')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${modalCategory === 'All'
                      ? 'bg-white text-[#0B1F5C] shadow-xs dark:bg-slate-900 dark:text-[#FFC000]'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                >
                  All RFPs ({filteredRfps.length})
                </button>
                <button
                  type="button"
                  onClick={() => setModalCategory('Researched')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${modalCategory === 'Researched'
                      ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                >
                  Researched ({researchedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setModalCategory('Submitted')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${modalCategory === 'Submitted'
                      ? 'bg-white text-sky-700 shadow-xs dark:bg-slate-900 dark:text-sky-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                >
                  Submitted ({totalSubmittedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setModalCategory('Pending')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${modalCategory === 'Pending'
                      ? 'bg-white text-amber-700 shadow-xs dark:bg-slate-900 dark:text-amber-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                >
                  Pending ({pendingCount})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search RFPs by client, scope..."
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  className="h-8 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
                {modalSearch && (
                  <button
                    type="button"
                    onClick={() => setModalSearch('')}
                    className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Modal Table Content */}
          <div className="p-5 overflow-y-auto max-h-[calc(90vh-210px)]">
            <div className="overflow-x-auto rounded-lg border border-slate-200/90 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800/80 dark:text-slate-400">
                    <th className="px-3 py-2.5">RFP #</th>
                    <th className="px-3 py-2.5">Client & Scope</th>
                    <th className="px-3 py-2.5">Industry</th>
                    <th className="px-3 py-2.5">Region</th>
                    <th className="px-3 py-2.5">Value</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Lead Owner</th>
                    <th className="px-3 py-2.5">Deadline</th>
                    <th className="px-3 py-2.5">Key Deliverables</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {modalFilteredRfps.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-xs text-muted-foreground">
                        No RFPs match the current filter or search criteria.
                      </td>
                    </tr>
                  ) : (
                    modalFilteredRfps.map(rfp => (
                      <tr key={rfp.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                        <td className="px-3 py-2.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {rfp.rfpNumber}
                        </td>
                        <td className="px-3 py-2.5 max-w-xs">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {rfp.clientName}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate" title={rfp.title}>
                            {rfp.title}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                          {rfp.industry}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            {rfp.region}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-[#0B1F5C] dark:text-[#FFC000]">
                          {money(rfp.contractValue)}
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${rfp.status === 'Won'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                                : rfp.status === 'Lost'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                  : rfp.status === 'Submitted'
                                    ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                                    : rfp.status === 'Pending'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                              }`}
                          >
                            {rfp.status === 'Won' && <CheckCircle2 className="size-3" />}
                            {rfp.status === 'Lost' && <XCircle className="size-3" />}
                            {rfp.status === 'Submitted' && <FileCheck2 className="size-3" />}
                            {rfp.status === 'Pending' && <Clock className="size-3" />}
                            {rfp.status === 'Researched' && <Search className="size-3" />}
                            {rfp.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-700 dark:text-slate-300">
                          {rfp.leadOwner}
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                          {formatDate(rfp.submissionDeadline)}
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={rfp.deliverables.join(', ')}>
                          {rfp.deliverables.join(', ')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter className="border-t border-slate-100 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/60">
            <Button variant="outline" size="sm" onClick={() => setBreakdownModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. SUBMIT NEW RFP MODAL                                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
              Register New Request For Proposal (RFP)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Log active solicitations, tender bid budgets, and proposal submission timelines
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRfp} className="flex flex-col gap-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                RFP Title / Project Scope *
              </label>
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Enterprise Cloud ERP Transformation"
                required
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Client Organization *
                </label>
                <Input
                  value={newClient}
                  onChange={e => setNewClient(e.target.value)}
                  placeholder="e.g. Meridian Bank"
                  required
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Contract Value (USD) *
                </label>
                <Input
                  type="number"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  placeholder="750000"
                  required
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Industry
                </label>
                <Select value={newIndustry} onValueChange={(v: Industry) => setNewIndustry(v)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(ind => (
                      <SelectItem key={ind} value={ind} className="text-xs">
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Region
                </label>
                <Select value={newRegion} onValueChange={(v: Region) => setNewRegion(v)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(reg => (
                      <SelectItem key={reg} value={reg} className="text-xs">
                        {reg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Submission Deadline
                </label>
                <Input
                  type="date"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Initial Status
                </label>
                <Select value={newStatus} onValueChange={(v: RfpStatus) => setNewStatus(v)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Drafting', 'Under Review', 'Researched', 'Submitted', 'Pending', 'Won', 'Lost'].map(st => (
                      <SelectItem key={st} value={st} className="text-xs">
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Scope Summary & Technical Requirements
              </label>
              <textarea
                value={newScope}
                onChange={e => setNewScope(e.target.value)}
                rows={3}
                placeholder="Key deliverables, required certifications, evaluation committee criteria..."
                className="mt-1 w-full rounded-md border border-slate-200 bg-transparent p-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C]"
              >
                Register RFP
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
