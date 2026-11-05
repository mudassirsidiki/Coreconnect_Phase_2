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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
  MoreVertical,
  Building2,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  FileText,
  DollarSign,
  BarChart3,
  ArrowRight
} from 'lucide-react'

interface OpportunitiesSectionProps {
  selectedIndustry: string
  setSelectedIndustry: (v: string) => void
  selectedRegion: string
  setSelectedRegion: (v: string) => void
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  datePreset: string
  setDatePreset: (v: string) => void
  selectedStageTab?: 'All' | OpportunityStage
  setSelectedStageTab?: (v: 'All' | OpportunityStage) => void
  onNavigateToOpportunitiesAnalysis?: () => void
}

export function OpportunitiesSection({
  selectedIndustry,
  setSelectedIndustry,
  selectedRegion,
  setSelectedRegion,
  startDate,
  endDate,
  selectedStageTab: propSelectedStageTab,
  setSelectedStageTab: propSetSelectedStageTab,
  onNavigateToOpportunitiesAnalysis
}: OpportunitiesSectionProps) {
  // Opportunities state (supports adding/updating)
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(initialOpportunities)
  
  // Local Stage Filter: 'All' | 'RFP Researched' | 'RFP Submitted' | 'RFP Pending'
  const [internalStageTab, setInternalStageTab] = useState<'All' | OpportunityStage>('All')
  const selectedStageTab = propSelectedStageTab !== undefined ? propSelectedStageTab : internalStageTab
  const setSelectedStageTab = propSetSelectedStageTab ?? setInternalStageTab
  

  // Dialog State for Viewing Details of single opportunity
  const [selectedOpp, setSelectedOpp] = useState<OpportunityRecord | null>(null)
  
  // Dialog State for Opportunities Breakdown Tabular View (O1, O2, O3 pop-up)
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false)
  const [modalStageTab, setModalStageTab] = useState<'All' | OpportunityStage>('All')
  const [modalSearch, setModalSearch] = useState('')
  const [modalStatusFilter, setModalStatusFilter] = useState<'All' | OpportunityStatus | 'In-progress'>('All')

  const handleOpenBreakdownModal = (stage: 'All' | OpportunityStage = 'All', status: 'All' | OpportunityStatus | 'In-progress' = 'All') => {
    setModalStageTab(stage)
    setModalStatusFilter(status)
    setModalSearch('')
    setBreakdownModalOpen(true)
  }

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
      // 1. Industry Slicer
      if (selectedIndustry !== 'All' && opp.industry !== selectedIndustry) {
        return false
      }
      // 2. Region Slicer
      if (selectedRegion !== 'All' && opp.region !== selectedRegion) {
        return false
      }
      // 3. Date Range Filter
      if (startDate && opp.dateAdded < startDate) {
        return false
      }
      if (endDate && opp.dateAdded > endDate) {
        return false
      }
      return true
    })
  }, [opportunities, selectedIndustry, selectedRegion, startDate, endDate])

  // Metric counts based on global slicers
  const totalCount = globalFilteredOpportunities.length
  
  // Stages Breakdown:
  // 1. RFP's researched
  const researchedCount = globalFilteredOpportunities.filter(o => o.stage === 'RFP Researched').length
  
  // 2. RFP's submitted (RFP won or lost)
  const submittedOpportunities = globalFilteredOpportunities.filter(o => o.stage === 'RFP Submitted')
  const submittedCount = submittedOpportunities.length
  const wonCount = submittedOpportunities.filter(o => o.status === 'Won').length
  const lostCount = submittedOpportunities.filter(o => o.status === 'Lost').length
  const inReviewSubmittedCount = submittedOpportunities.filter(o => o.status === 'Submitted').length
  
  // 3. RFP Pending (Must be included as an additional category)
  const pendingCount = globalFilteredOpportunities.filter(o => o.stage === 'RFP Pending').length

  // Right-side 3 Cards Telemetry:
  // 1. Won
  const wonOpportunities = useMemo(() => globalFilteredOpportunities.filter(o => o.status === 'Won'), [globalFilteredOpportunities])
  const wonOpportunitiesCount = wonOpportunities.length
  const wonOpportunitiesValue = useMemo(() => wonOpportunities.reduce((sum, o) => sum + (o.value || 0), 0), [wonOpportunities])

  // 2. Submitted
  const submittedStatusOpportunities = useMemo(() => globalFilteredOpportunities.filter(o => o.status === 'Submitted'), [globalFilteredOpportunities])
  const submittedStatusCount = submittedStatusOpportunities.length
  const submittedStatusValue = useMemo(() => submittedStatusOpportunities.reduce((sum, o) => sum + (o.value || 0), 0), [submittedStatusOpportunities])

  // 3. In-progress (Pending & Researched)
  const inProgressOpportunities = useMemo(() => globalFilteredOpportunities.filter(o => o.status === 'Pending' || o.status === 'Researched'), [globalFilteredOpportunities])
  const inProgressCount = inProgressOpportunities.length
  const inProgressValue = useMemo(() => inProgressOpportunities.reduce((sum, o) => sum + (o.value || 0), 0), [inProgressOpportunities])
  const inProgressPendingCount = useMemo(() => globalFilteredOpportunities.filter(o => o.status === 'Pending').length, [globalFilteredOpportunities])
  const inProgressResearchedCount = useMemo(() => globalFilteredOpportunities.filter(o => o.status === 'Researched').length, [globalFilteredOpportunities])

  const winRate = useMemo(() => {
    const decided = globalFilteredOpportunities.filter(o => o.status === 'Won' || o.status === 'Lost').length
    if (!decided) return wonOpportunitiesCount > 0 ? 75 : 0
    return Math.round((wonOpportunitiesCount / decided) * 100)
  }, [globalFilteredOpportunities, wonOpportunitiesCount])


  // Handle Status Update for an opportunity
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
      setSelectedOpp(prev => prev ? { ...prev, status: nextStatus, stage: nextStage } : null)
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
      region: newIndustry === 'Banking' || newIndustry === 'Energy' || newIndustry === 'Manufacturing'
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
    // Reset form
    setNewAccount('')
    setNewContactName('')
    setNewContactTitle('')
    setNewContactEmail('')
    setNewComments('')
    toast.success(`Opportunity ${nextSerial} added successfully!`)
  }


  // Filtered Opportunities inside the Popup Modal
  const modalFilteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // 1. Stage filter inside modal
      if (modalStageTab !== 'All' && opp.stage !== modalStageTab) {
        return false
      }
      // 2. Status filter inside modal
      if (modalStatusFilter !== 'All') {
        if (modalStatusFilter === 'In-progress') {
          if (opp.status !== 'Pending' && opp.status !== 'Researched') {
            return false
          }
        } else if (opp.status !== modalStatusFilter) {
          return false
        }
      }
      // 3. Search query inside modal
      if (modalSearch.trim()) {
        const q = modalSearch.toLowerCase()
        const reason = getReasonToLostOrWin(opp).toLowerCase()
        const matchesAccount = opp.account.toLowerCase().includes(q)
        const matchesContact = `${opp.contactPerson.name} ${opp.contactPerson.title} ${opp.contactPerson.email}`.toLowerCase().includes(q)
        const matchesIndustry = opp.industry.toLowerCase().includes(q)
        const matchesRegion = opp.region.toLowerCase().includes(q)
        const matchesNotes = opp.comments.toLowerCase().includes(q)
        const matchesSerial = opp.serialNumber.toLowerCase().includes(q)
        const matchesStatus = opp.status.toLowerCase().includes(q)
        const matchesReason = reason.includes(q)
        if (!matchesAccount && !matchesContact && !matchesIndustry && !matchesRegion && !matchesNotes && !matchesSerial && !matchesStatus && !matchesReason) {
          return false
        }
      }
      return true
    })
  }, [opportunities, modalStageTab, modalStatusFilter, modalSearch])

  // CSV Export for Modal Breakdown
  const handleExportBreakdownCsv = () => {
    const exportData = modalFilteredOpportunities.map(o => {
      const stageCode = o.stage === 'RFP Researched' ? 'O1' : o.stage === 'RFP Submitted' ? 'O2' : 'O3'
      return {
        'Serial #': o.serialNumber,
        'Stage Code': stageCode,
        'Date Added': o.dateAdded,
        'Industry': `${o.industry} (${o.region})`,
        'Account Name': o.account,
        'Contact Person': `${o.contactPerson.name} - ${o.contactPerson.title} (${o.contactPerson.email})`,
        'Notes': o.comments,
        'Status': o.status,
        'Reson to lost or win': getReasonToLostOrWin(o)
      }
    })
    downloadCsv('opportunities-breakdown-details.csv', exportData)
    toast.success(`Exported ${modalFilteredOpportunities.length} opportunities to CSV`)
  }

  // Helper Badge Color for Status
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
    <section id="section-opportunities" className="scroll-mt-56 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. SECTION HEADING: OPPORTUNITIES (Exact Outreach styling)  */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-6.5 items-center justify-center rounded-lg bg-[#0B1F5C] text-xs font-black text-white dark:bg-[#FFC000] dark:text-[#0B1F5C] shadow-2xs">
              3
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
              3- Opportunities
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Pipeline deal progression, stage breakdowns (Won, Submitted, In-Progress), and priority classifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onNavigateToOpportunitiesAnalysis && (
            <Button
              size="sm"
              onClick={onNavigateToOpportunitiesAnalysis}
              className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C] dark:hover:bg-[#FFC000]/90 font-semibold gap-1.5 shadow-xs text-xs cursor-pointer"
            >
              <BarChart3 className="size-4" />
              See Details
              <ArrowRight className="size-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="font-semibold gap-1.5 text-xs shadow-xs cursor-pointer"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="size-4" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. OPPORTUNITY CARDS: TOTAL + (WON, SUBMITTED, IN-PROGRESS) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: TOTAL OPPORTUNITIES */}
        <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-blue-500">
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-lg bg-blue-50 text-[#0B1F5C] dark:bg-blue-950/80 dark:text-blue-300">
                <Briefcase className="size-4.5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Total Opportunities
              </h4>
            </div>

            {/* Headline Metric + Right-hand side Sub-categories (O1, O2, O3) */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
                {totalCount}
              </div>

              {/* Sub-categories in small font on the right-hand side */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                    O1 (High)
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {researchedCount}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 font-bold">·</span>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    O2 (Medium)
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {submittedCount}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 font-bold">·</span>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    O3 (Low)
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {pendingCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 2: WON */}
        <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-emerald-500">
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                <CheckCircle2 className="size-4.5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Won
              </h4>
            </div>

            {/* Headline Metric + Right-hand side Sub-metrics */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {wonOpportunitiesCount}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Won Value
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    {money(wonOpportunitiesValue)}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 font-bold">·</span>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Win Rate
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {winRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 3: SUBMITTED */}
        <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-sky-500">
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400">
                <FileCheck2 className="size-4.5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Submitted
              </h4>
            </div>

            {/* Headline Metric + Right-hand side Sub-metrics */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
                {submittedStatusCount}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Bid Pipeline
                  </span>
                  <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                    {money(submittedStatusValue)}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 font-bold">·</span>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    Review
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    In Defense
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 4: IN-PROGRESS */}
        <Card className="flex flex-col justify-between border-slate-200/90 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 border-t-2 border-t-amber-500">
          <div className="p-5">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
                <Clock className="size-4.5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                In-progress
              </h4>
            </div>

            {/* Headline Metric + Right-hand side Sub-metrics */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {inProgressCount}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                    Researched
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {inProgressResearchedCount}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-slate-700 font-bold">·</span>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    Pending
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {inProgressPendingCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>


      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. MODAL: VIEW FULL OPPORTUNITY DETAILS                     */}
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
                    {selectedOpp.stage}
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

              {/* Recommended Action */}
              <div className="rounded-lg border p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Next Recommended Action
                  </div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-900 dark:text-white">
                    {selectedOpp.actions}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7.5"
                  onClick={() => toast.success('Action scheduled and assigned to account team')}
                >
                  Mark Action Complete
                </Button>
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
                variant={selectedOpp?.status === 'Pending' ? 'default' : 'outline'}
                className="h-7 text-[11px]"
                onClick={() => selectedOpp && handleUpdateStatus(selectedOpp.id, 'Pending')}
              >
                Pending
              </Button>
              <Button
                size="sm"
                variant={selectedOpp?.status === 'Researched' ? 'default' : 'outline'}
                className="h-7 text-[11px]"
                onClick={() => selectedOpp && handleUpdateStatus(selectedOpp.id, 'Researched')}
              >
                Researched
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedOpp(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. MODAL: ADD OPPORTUNITY                                   */}
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
                      RFP&apos;s Researched
                    </SelectItem>
                    <SelectItem value="Submitted" className="text-xs">
                      RFP&apos;s Submitted (In Review)
                    </SelectItem>
                    <SelectItem value="Won" className="text-xs">
                      RFP&apos;s Submitted (Won)
                    </SelectItem>
                    <SelectItem value="Lost" className="text-xs">
                      RFP&apos;s Submitted (Lost)
                    </SelectItem>
                    <SelectItem value="Pending" className="text-xs">
                      RFP Pending
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
                  <Briefcase className="size-4.5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                    Opportunities Breakdown
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Categorized tabular telemetry across O1 (High), O2 (Medium), and O3 (Low) active deals.
                  </DialogDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 pr-8 sm:pr-10">
                <Button
                  size="sm"
                  style={{ backgroundColor: '#000000', color: '#ffffff' }}
                  onClick={handleExportBreakdownCsv}
                  className="h-8 gap-1.5 px-3 text-xs font-semibold !bg-black !text-white hover:!bg-neutral-800 dark:!bg-black dark:!text-white dark:hover:!bg-neutral-800 border border-black shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Download className="size-3.5 text-white" />
                  Download CSV
                </Button>
              </div>
            </div>

            {/* Top 4 KPI Cards (Exact Outreach Dashboard Style) */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                onClick={() => setModalStageTab('All')}
                className={`rounded-xl border p-3.5 transition cursor-pointer shadow-xs ${
                  modalStageTab === 'All'
                    ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20 dark:bg-blue-950/40 dark:border-blue-600'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Deals</span>
                <div className="mt-1 text-2xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
                  {totalCount}
                </div>
              </div>

              <div
                onClick={() => setModalStageTab('RFP Researched')}
                className={`rounded-xl border p-3.5 transition cursor-pointer shadow-xs ${
                  modalStageTab === 'RFP Researched'
                    ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/20 dark:bg-indigo-950/40 dark:border-indigo-600'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">O1 (High)</span>
                <div className="mt-1 text-2xl font-bold tracking-tight text-indigo-950 dark:text-indigo-100">
                  {researchedCount}
                </div>
              </div>

              <div
                onClick={() => setModalStageTab('RFP Submitted')}
                className={`rounded-xl border p-3.5 transition cursor-pointer shadow-xs ${
                  modalStageTab === 'RFP Submitted'
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40 dark:border-emerald-600'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">O2 (MEDIUM)</span>
                <div className="mt-1 text-2xl font-bold tracking-tight text-emerald-950 dark:text-emerald-100">
                  {submittedCount}
                </div>
              </div>

              <div
                onClick={() => setModalStageTab('RFP Pending')}
                className={`rounded-xl border p-3.5 transition cursor-pointer shadow-xs ${
                  modalStageTab === 'RFP Pending'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 dark:bg-amber-950/40 dark:border-amber-600'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">O3 (LOW)</span>
                <div className="mt-1 text-2xl font-bold tracking-tight text-amber-950 dark:text-amber-100">
                  {pendingCount}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Content Body with Spacious Padding */}
          <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-210px)]">
            {/* Filter Toolbar (Matching Outreach switcher tabs) */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setModalStageTab('All')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    modalStageTab === 'All'
                      ? 'bg-white text-[#0B1F5C] shadow-xs dark:bg-slate-900 dark:text-[#FFC000]'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  All Opportunities ({totalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setModalStageTab('RFP Researched')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    modalStageTab === 'RFP Researched'
                      ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  O1 (High) ({researchedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setModalStageTab('RFP Submitted')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    modalStageTab === 'RFP Submitted'
                      ? 'bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  O2 (MEDIUM) ({submittedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setModalStageTab('RFP Pending')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    modalStageTab === 'RFP Pending'
                      ? 'bg-white text-amber-700 shadow-xs dark:bg-slate-900 dark:text-amber-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  O3 (LOW) ({pendingCount})
                </button>
              </div>

              {/* Status & Search Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-500">Status:</span>
                  <Select
                    value={modalStatusFilter}
                    onValueChange={v => setModalStatusFilter(v as any)}
                  >
                    <SelectTrigger className="h-8 w-32 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
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
                    placeholder="Search table..."
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

            {/* TABULAR VIEW CARD: CLEAN, WHITE, SIMPLE JUST LIKE OUTREACH TABLES (NO HORIZONTAL BAR) */}
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
                    <th className="px-3.5 py-3 text-center whitespace-nowrap w-[105px]">Status</th>
                    <th className="px-3.5 py-3 min-w-[220px]">Reson to lost or win</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {modalFilteredOpportunities.map(opp => {
                    const stageCode = opp.stage === 'RFP Researched' ? 'O1' : opp.stage === 'RFP Submitted' ? 'O2' : 'O3'
                    const reason = getReasonToLostOrWin(opp)
                    return (
                      <tr
                        key={opp.id}
                        className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
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

                  {modalFilteredOpportunities.length === 0 && (
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
          </div>

          {/* Modal Footer (Exact Outreach Style) */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-muted-foreground">
              Displaying <span className="font-bold text-slate-900 dark:text-white">{modalFilteredOpportunities.length}</span> of {totalCount} total opportunities
              <span className="ml-2 font-medium text-slate-500">
                (O1 (High): {researchedCount} · O2 (MEDIUM): {submittedCount} · O3 (LOW): {pendingCount})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                style={{ backgroundColor: '#000000', color: '#ffffff' }}
                onClick={handleExportBreakdownCsv}
                className="h-8 gap-1.5 px-3 text-xs font-semibold !bg-black !text-white hover:!bg-neutral-800 dark:!bg-black dark:!text-white dark:hover:!bg-neutral-800 border border-black shadow-xs transition-colors cursor-pointer"
              >
                <Download className="size-3.5 text-white" />
                Download CSV
              </Button>
              <Button
                size="sm"
                onClick={() => setBreakdownModalOpen(false)}
                className="bg-[#0B1F5C] text-white hover:bg-[#081744] dark:bg-[#FFC000] dark:text-[#0B1F5C] text-xs font-semibold"
              >
                Close Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
