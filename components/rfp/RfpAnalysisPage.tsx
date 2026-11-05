'use client'

import React, { useState, useMemo } from 'react'
import {
  FileText, Search, Plus, Download, Filter, CheckCircle2,
  XCircle, Clock, FileCheck2, Calendar, Eye, Building2,
  Globe, SlidersHorizontal, ChevronRight, TrendingUp, DollarSign,
  BarChart3, ArrowLeft, ArrowRight, ArrowUpRight, MessageSquare,
  Edit3, Check, Sparkles, Layers, ShieldCheck
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  industries,
  regions,
  type Industry,
  type Region,
  formatDate,
  downloadCsv,
  money
} from '@/lib/data'
import {
  initialRfpData,
  type RfpRecord,
  type RfpStatus
} from '@/lib/rfp-data'

export interface RfpAnalysisPageProps {
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
  initialTab?: string
  onBackToDashboard?: () => void
}

export function RfpAnalysisPage({
  selectedIndustry = 'All',
  setSelectedIndustry,
  selectedRegion = 'All',
  setSelectedRegion,
  startDate = '',
  endDate = '',
  initialTab = 'All',
  onBackToDashboard
}: RfpAnalysisPageProps) {
  // RFP records state (supports adding, status updating, and feedback editing)
  const [rfps, setRfps] = useState<RfpRecord[]>(initialRfpData)

  // Active Tab Filter: 'All' | 'Researched' | 'Submitted' | 'Won' | 'Lost' | 'Pending' | 'Under Review'
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [statusFilter, setStatusFilter] = useState<'All' | RfpStatus>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Selected RFP for full details / feedback editor modal
  const [selectedRfp, setSelectedRfp] = useState<RfpRecord | null>(null)
  const [editFeedbackModalOpen, setEditFeedbackModalOpen] = useState(false)
  const [feedbackDraft, setFeedbackDraft] = useState('')

  // New RFP Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newClient, setNewClient] = useState('')
  const [newIndustry, setNewIndustry] = useState<Industry>('Banking')
  const [newRegion, setNewRegion] = useState<Region>('USA')
  const [newValue, setNewValue] = useState('850000')
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10))
  const [newDeadline, setNewDeadline] = useState('2026-11-30')
  const [newStatus, setNewStatus] = useState<RfpStatus>('Submitted')
  const [newScope, setNewScope] = useState('')
  const [newFeedback, setNewFeedback] = useState('')

  // Filtered RFP dataset reacting to Global Slicers (Industry, Region, Dates)
  const globalFilteredRfps = useMemo(() => {
    return rfps.filter(rfp => {
      if (selectedIndustry !== 'All' && rfp.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && rfp.region !== selectedRegion) return false
      if (startDate && rfp.date < startDate) return false
      if (endDate && rfp.date > endDate) return false
      return true
    })
  }, [rfps, selectedIndustry, selectedRegion, startDate, endDate])

  // Summary Metrics
  const totalCount = globalFilteredRfps.length
  const totalValue = useMemo(() => globalFilteredRfps.reduce((sum, r) => sum + r.contractValue, 0), [globalFilteredRfps])

  const researchedRfps = useMemo(() => globalFilteredRfps.filter(r => r.status === 'Researched' || r.status === 'Drafting'), [globalFilteredRfps])
  const researchedCount = researchedRfps.length
  const researchedValue = useMemo(() => researchedRfps.reduce((sum, r) => sum + r.contractValue, 0), [researchedRfps])
  const researchedIndustriesCount = useMemo(() => {
    return new Set(researchedRfps.map(r => r.industry)).size
  }, [researchedRfps])

  const submittedWonRfps = useMemo(() => globalFilteredRfps.filter(r => r.status === 'Won'), [globalFilteredRfps])
  const submittedWonCount = submittedWonRfps.length
  const submittedWonValue = useMemo(() => submittedWonRfps.reduce((sum, r) => sum + r.contractValue, 0), [submittedWonRfps])

  const submittedLostRfps = useMemo(() => globalFilteredRfps.filter(r => r.status === 'Lost'), [globalFilteredRfps])
  const submittedLostCount = submittedLostRfps.length

  const submittedActiveRfps = useMemo(() => globalFilteredRfps.filter(r => r.status === 'Submitted' || r.status === 'Under Review'), [globalFilteredRfps])
  const submittedActiveCount = submittedActiveRfps.length
  const submittedActiveValue = useMemo(() => submittedActiveRfps.reduce((sum, r) => sum + r.contractValue, 0), [submittedActiveRfps])

  const totalSubmittedGroupCount = submittedWonCount + submittedLostCount + submittedActiveCount
  const totalSubmittedGroupValue = useMemo(() => {
    return [...submittedWonRfps, ...submittedLostRfps, ...submittedActiveRfps].reduce((sum, r) => sum + r.contractValue, 0)
  }, [submittedWonRfps, submittedLostRfps, submittedActiveRfps])

  const winRate = useMemo(() => {
    const decided = submittedWonCount + submittedLostCount
    if (!decided) return totalSubmittedGroupCount > 0 ? 67 : 0
    return Math.round((submittedWonCount / decided) * 100)
  }, [submittedWonCount, submittedLostCount, totalSubmittedGroupCount])

  const pendingRfps = useMemo(() => globalFilteredRfps.filter(r => r.status === 'Pending'), [globalFilteredRfps])
  const pendingCount = pendingRfps.length
  const pendingValue = useMemo(() => pendingRfps.reduce((sum, r) => sum + r.contractValue, 0), [pendingRfps])

  // Table Filtered Dataset
  const tableFilteredRfps = useMemo(() => {
    return globalFilteredRfps.filter(rfp => {
      // 1. Tab filter
      if (activeTab === 'Researched' && rfp.status !== 'Researched' && rfp.status !== 'Drafting') return false
      if (activeTab === 'Submitted' && rfp.status !== 'Submitted' && rfp.status !== 'Under Review' && rfp.status !== 'Won' && rfp.status !== 'Lost') return false
      if (activeTab === 'Won' && rfp.status !== 'Won') return false
      if (activeTab === 'Lost' && rfp.status !== 'Lost') return false
      if (activeTab === 'Pending' && rfp.status !== 'Pending') return false
      if (activeTab === 'Under Review' && rfp.status !== 'Under Review' && rfp.status !== 'Drafting') return false

      // 2. Dropdown Status Filter
      if (statusFilter !== 'All' && rfp.status !== statusFilter) return false

      // 3. Search Query (Matches Name, Client, Scope, Feedback, Status, RFP #)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const feedbackText = (rfp.feedback || rfp.notes || '').toLowerCase()
        const match =
          rfp.clientName.toLowerCase().includes(q) ||
          rfp.title.toLowerCase().includes(q) ||
          rfp.rfpNumber.toLowerCase().includes(q) ||
          rfp.industry.toLowerCase().includes(q) ||
          rfp.region.toLowerCase().includes(q) ||
          rfp.scopeSummary.toLowerCase().includes(q) ||
          rfp.status.toLowerCase().includes(q) ||
          feedbackText.includes(q)
        if (!match) return false
      }

      return true
    })
  }, [globalFilteredRfps, activeTab, statusFilter, searchQuery])

  // Handle Quick Status Update
  const handleUpdateStatus = (id: string, nextStatus: RfpStatus) => {
    setRfps(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: nextStatus
          }
        }
        return item
      })
    )

    if (selectedRfp && selectedRfp.id === id) {
      setSelectedRfp(prev => (prev ? { ...prev, status: nextStatus } : null))
    }

    toast.success(`RFP status updated to "${nextStatus}"`)
  }

  // Handle Feedback Update
  const handleSaveFeedback = () => {
    if (!selectedRfp) return
    const updatedFeedback = feedbackDraft.trim() || 'No evaluation feedback comments logged.'

    setRfps(prev =>
      prev.map(item => {
        if (item.id === selectedRfp.id) {
          return {
            ...item,
            feedback: updatedFeedback
          }
        }
        return item
      })
    )

    setSelectedRfp(prev => (prev ? { ...prev, feedback: updatedFeedback } : null))
    setEditFeedbackModalOpen(false)
    toast.success('RFP evaluation feedback saved successfully!')
  }

  // Handle Create New RFP
  const handleCreateRfp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClient.trim() || !newTitle.trim()) {
      toast.error('Please enter client organization and RFP title')
      return
    }

    const nextNumber = `RFP-2026-${String(rfps.length + 81).padStart(3, '0')}`
    const newRecord: RfpRecord = {
      id: `RFP-${Date.now()}`,
      rfpNumber: nextNumber,
      title: newTitle.trim(),
      clientName: newClient.trim(),
      industry: newIndustry,
      region: newRegion,
      date: newDate || new Date().toISOString().slice(0, 10),
      submissionDeadline: newDeadline || '2026-11-30',
      contractValue: parseInt(newValue, 10) || 750000,
      status: newStatus,
      winProbability: newStatus === 'Won' ? 100 : newStatus === 'Lost' ? 0 : 75,
      leadOwner: 'Avery Miller',
      scopeSummary: newScope.trim() || 'Enterprise digital solution architecture, deliverables matrix, and integration scope.',
      deliverables: ['Architecture Specification', 'Security Compliance Checklist', 'Delivery Schedule'],
      complianceStatus: 'Fully Compliant',
      notes: 'Newly registered RFP proposal.',
      feedback: newFeedback.trim() || 'Preliminary technical evaluation underway; awaiting committee initial scoring.'
    }

    setRfps(prev => [newRecord, ...prev])
    setIsAddModalOpen(false)
    setNewTitle('')
    setNewClient('')
    setNewScope('')
    setNewFeedback('')
    toast.success(`RFP ${nextNumber} registered successfully!`)
  }

  // CSV Export
  const handleExportCsv = () => {
    const rows = tableFilteredRfps.map(r => ({
      'RFP Number': r.rfpNumber,
      'Client Name': r.clientName,
      'Proposal Title': r.title,
      'Date Published': r.date,
      'Submission Deadline': r.submissionDeadline,
      'Industry': r.industry,
      'Region': r.region,
      'Contract Value (USD)': r.contractValue,
      'Status': r.status,
      'Scope Summary': r.scopeSummary,
      'Evaluation Feedback': r.feedback || r.notes || '',
      'Lead Owner': r.leadOwner
    }))
    downloadCsv('rfp-analysis-register.csv', rows)
    toast.success(`Exported ${tableFilteredRfps.length} RFPs to CSV`)
  }

  // Status Badge Helper
  const getStatusBadge = (status: RfpStatus) => {
    switch (status) {
      case 'Won':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="size-3" />
            Won
          </span>
        )
      case 'Lost':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            <XCircle className="size-3" />
            Lost
          </span>
        )
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-300 bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
            <FileCheck2 className="size-3" />
            Submitted
          </span>
        )
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <Clock className="size-3" />
            Under Review
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="size-3" />
            Pending
          </span>
        )
      case 'Researched':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-300 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Search className="size-3" />
            Researched
          </span>
        )
      case 'Drafting':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <FileText className="size-3" />
            {status}
          </span>
        )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER RIBBON: TITLE & ACTION BUTTONS                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                  4
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
                  RFP's Analysis & Register
                </h1>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                In-depth proposal register showing Name, Date, Scope, Value, Status, and Client Evaluation Feedback.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <Download className="size-3.5 text-slate-700 dark:text-slate-300" />
              <span>Download CSV ({tableFilteredRfps.length})</span>
            </button>
            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="h-9 gap-1.5 bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C] dark:hover:bg-[#FFC000]/90 font-semibold shadow-xs text-xs cursor-pointer"
            >
              <Plus className="size-4" />
              Submit New RFP
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. THE 3 RFP PIPELINE CARDS (SAME AS DASHBOARD SECTION 4)   */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: RFP RESEARCHED */}
        <div
          onClick={() => setActiveTab(activeTab === 'Researched' ? 'All' : 'Researched')}
          className={`flex flex-col justify-between rounded-xl border p-5 shadow-xs transition hover:shadow-md cursor-pointer ${
            activeTab === 'Researched'
              ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20 dark:bg-indigo-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-indigo-500`}
        >
          <div>
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
        </div>

        {/* CARD 2: RFP SUBMITTED WITH (WON, LOST, IN PROGRESS IN SAME CARD) */}
        <div
          onClick={() => setActiveTab(activeTab === 'Submitted' ? 'All' : 'Submitted')}
          className={`flex flex-col justify-between rounded-xl border p-5 shadow-xs transition hover:shadow-md cursor-pointer ${
            activeTab === 'Submitted'
              ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-500/20 dark:bg-sky-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-sky-500`}
        >
          <div>
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
                {winRate}% Won
              </span>
            </div>

            {/* Headline Metric + Won, Lost, In-progress in the SAME card */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                {totalSubmittedGroupCount}
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
                    {submittedActiveCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: RFP PENDING */}
        <div
          onClick={() => setActiveTab(activeTab === 'Pending' ? 'All' : 'Pending')}
          className={`flex flex-col justify-between rounded-xl border p-5 shadow-xs transition hover:shadow-md cursor-pointer ${
            activeTab === 'Pending'
              ? 'border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 dark:bg-amber-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-amber-500`}
        >
          <div>
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
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. FILTER CONTROLS & SEARCH BAR                             */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('All')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'All'
                  ? 'bg-white text-[#0B1F5C] shadow-xs dark:bg-slate-900 dark:text-[#FFC000]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              All RFPs ({globalFilteredRfps.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Researched')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'Researched'
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Researched ({researchedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Submitted')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'Submitted'
                  ? 'bg-white text-sky-700 shadow-xs dark:bg-slate-900 dark:text-sky-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Submitted ({totalSubmittedGroupCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Won')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'Won'
                  ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Won ({submittedWonCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Lost')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'Lost'
                  ? 'bg-white text-rose-700 shadow-xs dark:bg-slate-900 dark:text-rose-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Lost ({submittedLostCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('Pending')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'Pending'
                  ? 'bg-white text-amber-700 shadow-xs dark:bg-slate-900 dark:text-amber-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>

          {/* Status Dropdown & Search Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Filter:
              </span>
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="h-8.5 w-36 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs font-semibold">All Statuses</SelectItem>
                  <SelectItem value="Won" className="text-xs">Won</SelectItem>
                  <SelectItem value="Submitted" className="text-xs">Submitted</SelectItem>
                  <SelectItem value="Under Review" className="text-xs">Under Review</SelectItem>
                  <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
                  <SelectItem value="Researched" className="text-xs">Researched</SelectItem>
                  <SelectItem value="Drafting" className="text-xs">Drafting</SelectItem>
                  <SelectItem value="Lost" className="text-xs">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search name, scope, feedback..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8.5 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
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
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. THE MAIN DATA TABLE                                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Showing {tableFilteredRfps.length} records
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Click on any row or feedback badge to view & edit details
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300 text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3.5 w-[130px] whitespace-nowrap">Date</th>
                <th className="px-4 py-3.5 min-w-[200px]">Name</th>
                <th className="px-4 py-3.5 min-w-[280px]">Scope</th>
                <th className="px-4 py-3.5 w-[130px] whitespace-nowrap">Value</th>
                <th className="px-4 py-3.5 w-[120px] whitespace-nowrap text-center">Status</th>
                <th className="px-4 py-3.5 min-w-[300px]">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
              {tableFilteredRfps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No RFP records match the current filters or search term.
                  </td>
                </tr>
              ) : (
                tableFilteredRfps.map(rfp => {
                  const feedbackText = rfp.feedback || rfp.notes || 'No evaluation committee feedback recorded yet.'
                  return (
                    <tr
                      key={rfp.id}
                      className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/60"
                    >
                      {/* Date */}
                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold text-xs">
                          <Calendar className="size-3.5 text-slate-400" />
                          <span>{formatDate(rfp.date)}</span>
                        </div>
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {rfp.clientName}
                        </div>
                      </td>

                      {/* Scope */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="flex flex-col gap-2">
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                            {rfp.scopeSummary}
                          </p>
                          {rfp.deliverables && rfp.deliverables.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {rfp.deliverables.map((d, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <span className="text-sm font-extrabold text-[#0B1F5C] dark:text-[#FFC000]">
                          {money(rfp.contractValue)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 align-top text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          {getStatusBadge(rfp.status)}
                        </div>
                      </td>

                      {/* Feedback */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="rounded-lg border border-slate-200/90 bg-slate-50/60 p-2.5 dark:border-slate-800 dark:bg-slate-850 relative group/fb">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-1.5">
                              <MessageSquare className="size-3.5 text-blue-600 dark:text-[#FFC000] shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-800 dark:text-slate-200 leading-normal italic">
                                "{feedbackText}"
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRfp(rfp)
                                setFeedbackDraft(feedbackText)
                                setEditFeedbackModalOpen(true)
                              }}
                              className="opacity-70 group-hover/fb:opacity-100 hover:text-blue-600 dark:hover:text-[#FFC000] p-0.5 transition"
                              title="Edit Feedback"
                            >
                              <Edit3 className="size-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. MODAL: VIEW & EDIT FEEDBACK / DETAILS                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Dialog open={editFeedbackModalOpen} onOpenChange={setEditFeedbackModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200">
                {selectedRfp?.rfpNumber}
              </span>
              <span className="text-xs text-muted-foreground">
                · Published {selectedRfp && formatDate(selectedRfp.date)}
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-[#0B1F5C] dark:text-white mt-1">
              {selectedRfp?.clientName}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {selectedRfp?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedRfp && (
            <div className="mt-4 space-y-4 text-xs">
              {/* Highlight Banner */}
              <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Industry & Region
                  </span>
                  <div className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                    {selectedRfp.industry} · {selectedRfp.region}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Contract Value
                  </span>
                  <div className="mt-0.5 text-base font-extrabold text-[#0B1F5C] dark:text-[#FFC000]">
                    {money(selectedRfp.contractValue)}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Current Status
                  </span>
                  <div className="mt-0.5">
                    {getStatusBadge(selectedRfp.status)}
                  </div>
                </div>
              </div>

              {/* Scope & Deliverables */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide text-[10px]">
                  Project Scope & Technical Specification
                </span>
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedRfp.scopeSummary}
                </p>
                {selectedRfp.deliverables && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {selectedRfp.deliverables.map((deliv, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      >
                        ✓ {deliv}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Update Outcome Status:
                </label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {(['Researched', 'Drafting', 'Under Review', 'Submitted', 'Pending', 'Won', 'Lost'] as RfpStatus[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedRfp.id, st)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        selectedRfp.status === st
                          ? 'bg-[#0B1F5C] text-white shadow-xs dark:bg-[#FFC000] dark:text-[#0B1F5C]'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evaluation Feedback Editor */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>6- Client & Committee Evaluation Feedback:</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    Enter remarks, oral defense outcomes, or loss debrief notes
                  </span>
                </label>
                <Textarea
                  value={feedbackDraft}
                  onChange={e => setFeedbackDraft(e.target.value)}
                  rows={4}
                  placeholder="e.g. Committee highlighted strong compliance posture and API architecture; cleared first stage..."
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditFeedbackModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveFeedback}
              className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C]"
            >
              Save Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 6. MODAL: SUBMIT NEW RFP                                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
              Submit New Request For Proposal (RFP)
            </DialogTitle>
            <DialogDescription className="text-xs">
              Add proposal tender details including Name, Date, Scope, Value, Status, and Initial Feedback.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRfp} className="flex flex-col gap-3 mt-2 text-xs">
            {/* 1- Name: Client Organization & Title */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Client Organization Name *
                </label>
                <Input
                  value={newClient}
                  onChange={e => setNewClient(e.target.value)}
                  placeholder="e.g. Apex Financial Authority"
                  required
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  RFP Proposal Title *
                </label>
                <Input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Enterprise Cloud ERP Modernization"
                  required
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            {/* Industry & Region */}
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

            {/* 2- Date & Deadline */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  2- Proposal Date
                </label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

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
            </div>

            {/* 4- Value & 5- Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  4- Contract Value (USD) *
                </label>
                <Input
                  type="number"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  placeholder="850000"
                  required
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  5- Status *
                </label>
                <Select value={newStatus} onValueChange={(v: RfpStatus) => setNewStatus(v)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Researched', 'Drafting', 'Under Review', 'Submitted', 'Pending', 'Won', 'Lost'].map(st => (
                      <SelectItem key={st} value={st} className="text-xs">
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 3- Scope */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                3- Project Scope & Technical Requirements
              </label>
              <Textarea
                value={newScope}
                onChange={e => setNewScope(e.target.value)}
                rows={2}
                placeholder="Key technical scope, deliverables, and architecture requirements..."
                className="mt-1 text-xs"
              />
            </div>

            {/* 6- Feedback */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                6- Initial Evaluation Feedback / Notes
              </label>
              <Textarea
                value={newFeedback}
                onChange={e => setNewFeedback(e.target.value)}
                rows={2}
                placeholder="Initial feedback comments from procurement or client evaluation..."
                className="mt-1 text-xs"
              />
            </div>

            <DialogFooter className="mt-2">
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
                Submit RFP
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
