'use client'

import React, { useState, useMemo } from 'react'
import {
  type OpportunityRecord,
  type OpportunityStage,
  type OpportunityStatus,
  initialOpportunities,
  getReasonToLostOrWin
} from '@/lib/opportunities-data'
import { industries, regions, type Industry, type Region, formatDate, downloadCsv, money } from '@/lib/data'
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
  Briefcase,
  Search,
  Plus,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  FileCheck2,
  Calendar,
  Eye,
  Building2,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  FileText,
  DollarSign,
  BarChart3,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check
} from 'lucide-react'

export interface OpportunitiesAnalysisPageProps {
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

export function OpportunitiesAnalysisPage({
  selectedIndustry = 'All',
  setSelectedIndustry,
  selectedRegion = 'All',
  setSelectedRegion,
  startDate = '',
  endDate = '',
  onBackToDashboard
}: OpportunitiesAnalysisPageProps) {
  // Opportunities state (supports status updating and adding)
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(initialOpportunities)

  // Stage Tab Filter: 'All' | 'RFP Researched' | 'RFP Submitted' | 'RFP Pending' | 'Won' | 'Submitted' | 'In-progress'
  const [activeTab, setActiveTab] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | OpportunityStatus | 'In-progress'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Selected Opportunity for details modal
  const [selectedOpp, setSelectedOpp] = useState<OpportunityRecord | null>(null)

  // Dialog State for Adding a New Opportunity
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newAccount, setNewAccount] = useState('')
  const [newIndustry, setNewIndustry] = useState<Industry>('Banking')
  const [newContactName, setNewContactName] = useState('')
  const [newContactTitle, setNewContactTitle] = useState('')
  const [newContactEmail, setNewContactEmail] = useState('')
  const [newStatus, setNewStatus] = useState<OpportunityStatus>('Researched')
  const [newComments, setNewComments] = useState('')
  const [newMeetingType, setNewMeetingType] = useState<'Discovery' | 'Executive Briefing' | 'Demo' | 'Follow-up'>('Discovery')
  const [newValue, setNewValue] = useState('350000')

  // Filtered Opportunities based on Global Slicers (Industry, Region, Dates)
  const globalFilteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      if (selectedIndustry !== 'All' && opp.industry !== selectedIndustry) {
        return false
      }
      if (selectedRegion !== 'All' && opp.region !== selectedRegion) {
        return false
      }
      if (startDate && opp.dateAdded < startDate) {
        return false
      }
      if (endDate && opp.dateAdded > endDate) {
        return false
      }
      return true
    })
  }, [opportunities, selectedIndustry, selectedRegion, startDate, endDate])

  // Top Metric counts
  const totalCount = globalFilteredOpportunities.length
  const researchedCount = globalFilteredOpportunities.filter(o => o.stage === 'RFP Researched').length
  const submittedStageOpportunities = globalFilteredOpportunities.filter(o => o.stage === 'RFP Submitted')
  const submittedStageCount = submittedStageOpportunities.length
  const pendingCount = globalFilteredOpportunities.filter(o => o.stage === 'RFP Pending').length

  const wonOpportunities = useMemo(() => globalFilteredOpportunities.filter(o => o.status === 'Won'), [globalFilteredOpportunities])
  const wonCount = wonOpportunities.length
  const wonValue = useMemo(() => wonOpportunities.reduce((sum, o) => sum + (o.value || 0), 0), [wonOpportunities])

  const submittedStatusOpportunities = useMemo(() => globalFilteredOpportunities.filter(o => o.status === 'Submitted'), [globalFilteredOpportunities])
  const submittedStatusCount = submittedStatusOpportunities.length
  const submittedStatusValue = useMemo(() => submittedStatusOpportunities.reduce((sum, o) => sum + (o.value || 0), 0), [submittedStatusOpportunities])

  const inProgressOpportunities = useMemo(() => globalFilteredOpportunities.filter(o => o.status === 'Pending' || o.status === 'Researched'), [globalFilteredOpportunities])
  const inProgressCount = inProgressOpportunities.length
  const inProgressValue = useMemo(() => inProgressOpportunities.reduce((sum, o) => sum + (o.value || 0), 0), [inProgressOpportunities])

  const winRate = useMemo(() => {
    const decided = globalFilteredOpportunities.filter(o => o.status === 'Won' || o.status === 'Lost').length
    if (!decided) return wonCount > 0 ? 75 : 0
    return Math.round((wonCount / decided) * 100)
  }, [globalFilteredOpportunities, wonCount])

  // Filtered Opportunities for the Data Table
  const tableFilteredOpportunities = useMemo(() => {
    return globalFilteredOpportunities.filter(opp => {
      // 1. Tab filter
      if (activeTab === 'RFP Researched' && opp.stage !== 'RFP Researched') return false
      if (activeTab === 'RFP Submitted' && opp.stage !== 'RFP Submitted') return false
      if (activeTab === 'RFP Pending' && opp.stage !== 'RFP Pending') return false
      if (activeTab === 'Won' && opp.status !== 'Won') return false
      if (activeTab === 'Submitted' && opp.status !== 'Submitted') return false
      if (activeTab === 'In-progress' && (opp.status !== 'Pending' && opp.status !== 'Researched')) return false

      // 2. Status dropdown filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'In-progress') {
          if (opp.status !== 'Pending' && opp.status !== 'Researched') return false
        } else if (opp.status !== statusFilter) {
          return false
        }
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const reason = getReasonToLostOrWin(opp).toLowerCase()
        const match =
          opp.account.toLowerCase().includes(q) ||
          opp.serialNumber.toLowerCase().includes(q) ||
          opp.industry.toLowerCase().includes(q) ||
          opp.region.toLowerCase().includes(q) ||
          opp.status.toLowerCase().includes(q) ||
          opp.comments.toLowerCase().includes(q) ||
          `${opp.contactPerson.name} ${opp.contactPerson.title} ${opp.contactPerson.email}`.toLowerCase().includes(q) ||
          reason.includes(q)
        if (!match) return false
      }

      return true
    })
  }, [globalFilteredOpportunities, activeTab, statusFilter, searchQuery])

  // Handle Quick Status Update
  const handleUpdateStatus = (id: number, nextStatus: OpportunityStatus) => {
    let nextStage: OpportunityStage = 'RFP Researched'
    if (nextStatus === 'Won' || nextStatus === 'Lost' || nextStatus === 'Submitted') {
      nextStage = 'RFP Submitted'
    } else if (nextStatus === 'Pending') {
      nextStage = 'RFP Pending'
    }

    setOpportunities(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status: nextStatus,
            stage: nextStage
          }
        }
        return item
      })
    )

    if (selectedOpp && selectedOpp.id === id) {
      setSelectedOpp(prev => (prev ? { ...prev, status: nextStatus, stage: nextStage } : null))
    }

    toast.success(`Opportunity status updated to "${nextStatus}"`)
  }

  // Handle Adding New Opportunity
  const handleCreateOpportunity = () => {
    if (!newAccount.trim()) {
      toast.error('Please enter an account name')
      return
    }

    let assignedStage: OpportunityStage = 'RFP Researched'
    if (newStatus === 'Won' || newStatus === 'Lost' || newStatus === 'Submitted') {
      assignedStage = 'RFP Submitted'
    } else if (newStatus === 'Pending') {
      assignedStage = 'RFP Pending'
    }

    const todayStr = new Date().toISOString().slice(0, 10)
    const nextSerial = `OPP-${String(opportunities.length + 1).padStart(3, '0')}`

    const newRecord: OpportunityRecord = {
      id: Date.now(),
      serialNumber: nextSerial,
      dateAdded: todayStr,
      industry: newIndustry,
      region:
        newIndustry === 'Banking' || newIndustry === 'Energy' || newIndustry === 'Manufacturing'
          ? 'USA'
          : newIndustry === 'Healthcare' || newIndustry === 'Telecom' || newIndustry === 'Professional Services'
          ? 'Canada'
          : 'Saudi Arabia',
      account: newAccount.trim(),
      contactPerson: {
        name: newContactName.trim() || 'Primary Contact',
        title: newContactTitle.trim() || 'Procurement Lead',
        email: newContactEmail.trim() || `contact@${newAccount.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
      },
      meeting: {
        status: 'Scheduled',
        type: newMeetingType,
        date: todayStr,
        display: `Scheduled · ${formatDate(todayStr)}`
      },
      comments: newComments.trim() || 'New opportunity created in CRM.',
      actions: 'Schedule initial alignment session',
      status: newStatus,
      stage: assignedStage,
      rfpTitle: `${newAccount.trim()} RFP Modernization`,
      value: parseInt(newValue, 10) || 250000
    }

    setOpportunities(prev => [newRecord, ...prev])
    setIsAddModalOpen(false)
    setNewAccount('')
    setNewContactName('')
    setNewContactTitle('')
    setNewContactEmail('')
    setNewComments('')
    toast.success(`Opportunity ${nextSerial} added successfully!`)
  }

  // CSV Export
  const handleExportCsv = () => {
    const exportData = tableFilteredOpportunities.map(o => {
      const stageCode = o.stage === 'RFP Researched' ? 'O1 (High)' : o.stage === 'RFP Submitted' ? 'O2 (MEDIUM)' : 'O3 (LOW)'
      const statusLabel =
        o.status === 'Researched'
          ? 'O1 (High)'
          : o.status === 'Submitted'
          ? 'O2 (MEDIUM)'
          : o.status === 'Pending'
          ? 'O3 (LOW)'
          : o.status
      return {
        'Serial #': o.serialNumber,
        'Stage Code': stageCode,
        'Date Added': o.dateAdded,
        'Industry': `${o.industry} (${o.region})`,
        'Account Name': o.account,
        'Contact Person': `${o.contactPerson.name} - ${o.contactPerson.title} (${o.contactPerson.email})`,
        'Notes': o.comments,
        'Status': statusLabel,
        'Reason to lost or win': getReasonToLostOrWin(o)
      }
    })
    downloadCsv('opportunities-analysis-export.csv', exportData)
    toast.success(`Exported ${tableFilteredOpportunities.length} opportunities to CSV`)
  }

  // Helper Badge for Status
  const getStatusBadge = (status: OpportunityStatus) => {
    switch (status) {
      case 'Won':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
            Won
          </span>
        )
      case 'Lost':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60">
            <XCircle className="size-3 text-rose-600 dark:text-rose-400" />
            Lost
          </span>
        )
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60">
            <FileCheck2 className="size-3 text-sky-600 dark:text-sky-400" />
            O2 (MEDIUM)
          </span>
        )
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60">
            <Clock className="size-3 text-amber-600 dark:text-amber-400" />
            O3 (LOW)
          </span>
        )
      case 'Researched':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60">
            <Search className="size-3 text-indigo-600 dark:text-indigo-400" />
            O1 (High)
          </span>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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
                  3
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
                  Opportunities Analysis
                </h1>
                <Badge className="bg-[#FFC000] text-[#0B1F5C] font-bold text-[10px] hover:bg-[#FFC000]/90">
                  Full Pipeline Telemetry
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Comprehensive tabular telemetry across O1 (High), O2 (Medium), and O3 (Low) active deals.
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
            <Button
              size="sm"
              className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C] dark:hover:bg-[#FFC000]/90 font-semibold gap-1.5 shadow-xs text-xs cursor-pointer"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="size-4" />
              Add Opportunity
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. TOP KPI CARDS (TOTAL + WON + SUBMITTED + IN-PROGRESS)     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: TOTAL OPPORTUNITIES */}
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
              Total Opportunities
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Briefcase className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
            {totalCount}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">O1 (High): {researchedCount}</span>
            <span className="text-slate-300">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">O2 (MEDIUM): {submittedStageCount}</span>
            <span className="text-slate-300">·</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">O3 (LOW): {pendingCount}</span>
          </div>
        </div>

        {/* CARD 2: WON */}
        <div
          onClick={() => setActiveTab('Won')}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition hover:shadow-md ${
            activeTab === 'Won'
              ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-emerald-500`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Won Deals
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {wonCount}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">
              {money(wonValue)}
            </span>
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {winRate}% Win Rate
            </span>
          </div>
        </div>

        {/* CARD 3: SUBMITTED */}
        <div
          onClick={() => setActiveTab('Submitted')}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition hover:shadow-md ${
            activeTab === 'Submitted'
              ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20 dark:bg-sky-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-sky-500`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Submitted (Active Bids)
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <FileCheck2 className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-sky-600 dark:text-sky-400">
            {submittedStatusCount}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="font-semibold text-sky-700 dark:text-sky-300">
              {money(submittedStatusValue)}
            </span>
            <span className="text-muted-foreground">In Review</span>
          </div>
        </div>

        {/* CARD 4: IN-PROGRESS */}
        <div
          onClick={() => setActiveTab('In-progress')}
          className={`cursor-pointer rounded-xl border p-5 shadow-xs transition hover:shadow-md ${
            activeTab === 'In-progress'
              ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 dark:bg-amber-950/40'
              : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
          } border-t-2 border-t-amber-500`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              In-progress
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="size-4.5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {inProgressCount}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="font-semibold text-amber-700 dark:text-amber-300">
              {money(inProgressValue)}
            </span>
            <span className="text-muted-foreground">Pending & Research</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. TABS & FILTER TOOLBAR                                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Main Segment Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {[
              { id: 'All', label: 'All Opportunities', count: totalCount },
              { id: 'RFP Researched', label: 'O1 (High)', count: researchedCount },
              { id: 'RFP Submitted', label: 'O2 (MEDIUM)', count: submittedStageCount },
              { id: 'RFP Pending', label: 'O3 (LOW)', count: pendingCount },
              { id: 'Won', label: 'Won', count: wonCount },
              { id: 'Submitted', label: 'Submitted', count: submittedStatusCount },
              { id: 'In-progress', label: 'In-progress', count: inProgressCount }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-white text-[#0B1F5C] shadow-xs dark:bg-slate-900 dark:text-[#FFC000]'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeTab === tab.id
                    ? 'bg-[#0B1F5C]/10 text-[#0B1F5C] dark:bg-[#FFC000]/20 dark:text-[#FFC000]'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Status & Search Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Status:</span>
              <Select
                value={statusFilter}
                onValueChange={v => setStatusFilter(v as any)}
              >
                <SelectTrigger className="h-8.5 w-32 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs">All Statuses</SelectItem>
                  <SelectItem value="Won" className="text-xs">Won</SelectItem>
                  <SelectItem value="Lost" className="text-xs">Lost</SelectItem>
                  <SelectItem value="Submitted" className="text-xs">O2 (MEDIUM)</SelectItem>
                  <SelectItem value="In-progress" className="text-xs">In-progress</SelectItem>
                  <SelectItem value="Pending" className="text-xs">O3 (LOW)</SelectItem>
                  <SelectItem value="Researched" className="text-xs">O1 (High)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search account, contact, serial..."
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

        {/* ─────────────────────────────────────────────────────────── */}
        {/* 4. COMPLETE TABULAR VIEW                                    */}
        {/* ─────────────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs border-collapse table-auto">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
                <th className="px-3.5 py-3 text-center whitespace-nowrap w-[100px]">Serial #</th>
                <th className="px-3.5 py-3 whitespace-nowrap w-[105px]">Date Added</th>
                <th className="px-3.5 py-3 whitespace-nowrap w-[135px]">Industry</th>
                <th className="px-3.5 py-3 whitespace-nowrap w-[165px]">Account Name</th>
                <th className="px-3.5 py-3 whitespace-nowrap w-[175px]">Contact Person</th>
                <th className="px-3.5 py-3 min-w-[200px]">Notes</th>
                <th className="px-3.5 py-3 text-center whitespace-nowrap w-[120px]">Status</th>
                <th className="px-3.5 py-3 min-w-[220px]">Reson to lost or win</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {tableFilteredOpportunities.map(opp => {
                const stageCode = opp.stage === 'RFP Researched' ? 'O1' : opp.stage === 'RFP Submitted' ? 'O2' : 'O3'
                const reason = getReasonToLostOrWin(opp)
                return (
                  <tr
                    key={opp.id}
                    onClick={() => setSelectedOpp(opp)}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    {/* 1. Serial # */}
                    <td className="px-3.5 py-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                            stageCode === 'O1'
                              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60'
                              : stageCode === 'O2'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/60'
                          }`}
                        >
                          {stageCode}
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {opp.serialNumber}
                        </span>
                      </div>
                    </td>

                    {/* 2. Date Added */}
                    <td className="px-3.5 py-3 whitespace-nowrap font-medium text-slate-600 dark:text-slate-400">
                      {formatDate(opp.dateAdded)}
                    </td>

                    {/* 3. Industry */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {opp.industry}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {opp.region}
                        </span>
                      </div>
                    </td>

                    {/* 4. Account Name */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-[#0B1F5C] dark:bg-slate-800 dark:text-[#FFC000] border border-slate-200/60 dark:border-slate-700">
                          {opp.account.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white" title={opp.account}>
                          {opp.account}
                        </span>
                      </div>
                    </td>

                    {/* 5. Contact Person */}
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {opp.contactPerson.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground" title={opp.contactPerson.email}>
                          {opp.contactPerson.email}
                        </span>
                      </div>
                    </td>

                    {/* 6. Notes */}
                    <td className="px-3.5 py-3">
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2" title={opp.comments}>
                        {opp.comments}
                      </p>
                    </td>

                    {/* 7. Status */}
                    <td className="px-3.5 py-3 text-center whitespace-nowrap">
                      {getStatusBadge(opp.status)}
                    </td>

                    {/* 8. Reson to lost or win */}
                    <td className="px-3.5 py-3">
                      <div className="flex items-start gap-1.5 text-xs leading-snug">
                        {opp.status === 'Won' ? (
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : opp.status === 'Lost' ? (
                          <XCircle className="mt-0.5 size-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                        ) : opp.status === 'Submitted' ? (
                          <FileCheck2 className="mt-0.5 size-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                        ) : opp.status === 'Pending' ? (
                          <Clock className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Search className="mt-0.5 size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        )}
                        <span className="text-slate-700 dark:text-slate-300 line-clamp-2" title={reason}>
                          {reason}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {tableFilteredOpportunities.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Briefcase className="size-8 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        No opportunities match the selected filters
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Try adjusting your stage filter tab, search query, or status selection.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{tableFilteredOpportunities.length}</span> of {totalCount} total opportunities
            <span className="ml-2 font-medium text-slate-500">
              (O1 (High): {researchedCount} · O2 (MEDIUM): {submittedStageCount} · O3 (LOW): {pendingCount})
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
      {/* 5. MODAL: VIEW FULL OPPORTUNITY DETAILS                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Dialog open={!!selectedOpp} onOpenChange={open => !open && setSelectedOpp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {selectedOpp?.serialNumber}
              </span>
              <span className="text-xs text-muted-foreground">· Added {selectedOpp && formatDate(selectedOpp.dateAdded)}</span>
            </div>
            <DialogTitle className="text-xl font-bold text-[#0B1F5C] dark:text-white mt-1">
              {selectedOpp?.account}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {selectedOpp?.rfpTitle}
            </DialogDescription>
          </DialogHeader>

          {selectedOpp && (
            <div className="mt-4 space-y-4 text-xs">
              {/* Highlight Banner */}
              <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Industry & Region
                  </span>
                  <div className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                    {selectedOpp.industry} · {selectedOpp.region}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Stage Categorization
                  </span>
                  <div className="mt-0.5 font-bold text-slate-900 dark:text-white">
                    {selectedOpp.stage === 'RFP Researched' ? 'O1 (High)' : selectedOpp.stage === 'RFP Submitted' ? 'O2 (MEDIUM)' : 'O3 (LOW)'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Current Status
                  </span>
                  <div className="mt-0.5">
                    {getStatusBadge(selectedOpp.status)}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Deal Value
                  </span>
                  <div className="mt-0.5 text-sm font-black text-emerald-700 dark:text-emerald-400">
                    {money(selectedOpp.value)}
                  </div>
                </div>
              </div>

              {/* Grid: Contact Person & Meeting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-lg border p-3.5 space-y-1.5 dark:border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Point of Contact
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedOpp.contactPerson.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedOpp.contactPerson.title}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {selectedOpp.contactPerson.email}
                  </div>
                  {selectedOpp.contactPerson.phone && (
                    <div className="text-xs text-slate-500">
                      {selectedOpp.contactPerson.phone}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-3.5 space-y-1.5 dark:border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Meeting Details
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                    <Calendar className="size-4 text-blue-600 dark:text-blue-400" />
                    {selectedOpp.meeting.display}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Meeting Type: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedOpp.meeting.type}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Status: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedOpp.meeting.status}</span>
                  </div>
                </div>
              </div>

              {/* Comments & RFP Notes */}
              <div className="rounded-lg border p-3.5 dark:border-slate-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Comments & RFP Notes
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedOpp.comments}
                </p>
              </div>

              {/* Reason to lost or win */}
              <div className="rounded-lg border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Reason to Lost or Win Analysis
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {getReasonToLostOrWin(selectedOpp)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex flex-row items-center justify-between sm:justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-1">Quick Status:</span>
              <Button
                size="sm"
                variant={selectedOpp?.status === 'Won' ? 'default' : 'outline'}
                className="h-7 text-[11px]"
                onClick={() => selectedOpp && handleUpdateStatus(selectedOpp.id, 'Won')}
              >
                Won
              </Button>
              <Button
                size="sm"
                variant={selectedOpp?.status === 'Researched' ? 'default' : 'outline'}
                className="h-7 text-[11px]"
                onClick={() => selectedOpp && handleUpdateStatus(selectedOpp.id, 'Researched')}
              >
                O1 (High)
              </Button>
              <Button
                size="sm"
                variant={selectedOpp?.status === 'Submitted' ? 'default' : 'outline'}
                className="h-7 text-[11px]"
                onClick={() => selectedOpp && handleUpdateStatus(selectedOpp.id, 'Submitted')}
              >
                O2 (MEDIUM)
              </Button>
              <Button
                size="sm"
                variant={selectedOpp?.status === 'Pending' ? 'default' : 'outline'}
                className="h-7 text-[11px]"
                onClick={() => selectedOpp && handleUpdateStatus(selectedOpp.id, 'Pending')}
              >
                O3 (LOW)
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedOpp(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 6. MODAL: ADD OPPORTUNITY                                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
              Add New Opportunity
            </DialogTitle>
            <DialogDescription className="text-xs">
              Create an opportunity record in the pipeline across target industries and stages.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Account Name *
              </label>
              <Input
                placeholder="e.g. Apex Global Bank"
                value={newAccount}
                onChange={e => setNewAccount(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Industry *
                </label>
                <Select value={newIndustry} onValueChange={v => setNewIndustry(v as Industry)}>
                  <SelectTrigger className="text-xs">
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
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Stage / Status *
                </label>
                <Select value={newStatus} onValueChange={v => setNewStatus(v as OpportunityStatus)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Researched" className="text-xs">
                      O1 (High)
                    </SelectItem>
                    <SelectItem value="Submitted" className="text-xs">
                      O2 (MEDIUM)
                    </SelectItem>
                    <SelectItem value="Won" className="text-xs">
                      Won
                    </SelectItem>
                    <SelectItem value="Lost" className="text-xs">
                      Lost
                    </SelectItem>
                    <SelectItem value="Pending" className="text-xs">
                      O3 (LOW)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Contact Person Name
                </label>
                <Input
                  placeholder="e.g. Rachel Adams"
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Contact Title
                </label>
                <Input
                  placeholder="e.g. VP Procurement"
                  value={newContactTitle}
                  onChange={e => setNewContactTitle(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Contact Email
                </label>
                <Input
                  placeholder="rachel@company.com"
                  value={newContactEmail}
                  onChange={e => setNewContactEmail(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Opportunity Value ($ USD)
                </label>
                <Input
                  type="number"
                  placeholder="350000"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Meeting Type
              </label>
              <Select value={newMeetingType} onValueChange={v => setNewMeetingType(v as any)}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Discovery" className="text-xs">Discovery Call</SelectItem>
                  <SelectItem value="Executive Briefing" className="text-xs">Executive Briefing</SelectItem>
                  <SelectItem value="Demo" className="text-xs">Technical Demo</SelectItem>
                  <SelectItem value="Follow-up" className="text-xs">Follow-up Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Comments & Scope Notes
              </label>
              <Textarea
                placeholder="RFP requirements, evaluation criteria, and key meeting notes..."
                value={newComments}
                onChange={e => setNewComments(e.target.value)}
                className="text-xs h-20"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C]"
              onClick={handleCreateOpportunity}
            >
              Save Opportunity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
