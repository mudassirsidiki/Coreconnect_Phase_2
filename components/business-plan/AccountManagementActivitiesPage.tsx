'use client'

import React, { useState, useMemo } from 'react'
import {
  ArrowLeft,
  Activity,
  Database,
  CalendarDays,
  Search,
  Plus,
  Download,
  ExternalLink,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  Trash2,
  Layers,
  FileSpreadsheet,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { toast } from 'sonner'

// ── TYPES ──
export interface CrmSupportRecord {
  id: string
  date: string
  location: string
  name: string
  website: string
  industry: string
}

export interface ConferenceRecord {
  id: string
  dateAdded: string
  status: 'Confirmed' | 'Planned' | 'Under Review' | 'Completed'
  category: string
  description: string
  actionPlan: string
}

// ── INITIAL SEED DATA ──
const INITIAL_CRM_SUPPORT: CrmSupportRecord[] = [
  {
    id: 'crm-1',
    date: '2026-11-04',
    location: 'Toronto, ON',
    name: 'Apex Electrical Contracting',
    website: 'www.apexelectrical.ca',
    industry: 'Electrical'
  },
  {
    id: 'crm-2',
    date: '2026-10-28',
    location: 'Calgary, AB',
    name: 'Titan Mechanical Solutions',
    website: 'www.titanmech.com',
    industry: 'Mechanical'
  },
  {
    id: 'crm-3',
    date: '2026-10-19',
    location: 'Dallas, TX',
    name: 'Pinnacle Builders Group',
    website: 'www.pinnaclegc.com',
    industry: 'General Contracting'
  },
  {
    id: 'crm-4',
    date: '2026-10-12',
    location: 'Virtual / Zoom',
    name: 'Vanguard MEP Engineers',
    website: 'www.vanguardmep.com',
    industry: 'Plumbing & Piping'
  },
  {
    id: 'crm-5',
    date: '2026-09-30',
    location: 'Vancouver, BC',
    name: 'Pacific North Construction',
    website: 'www.pacificnorth.ca',
    industry: 'Business Development'
  },
  {
    id: 'crm-6',
    date: '2026-09-18',
    location: 'Chicago, IL',
    name: 'Midwest Precision Builders',
    website: 'www.midwestbuilders.com',
    industry: 'General Contracting'
  }
]

const INITIAL_CONFERENCES: ConferenceRecord[] = [
  {
    id: 'conf-1',
    dateAdded: '2026-10-15',
    status: 'Confirmed',
    category: 'Trade Show',
    description: 'Buildex Calgary - Alberta Premier Construction & Design Exhibition',
    actionPlan: 'Finalize booth registration & schedule 25 pre-show Tier 1 GC executive briefings.'
  },
  {
    id: 'conf-2',
    dateAdded: '2026-10-22',
    status: 'Confirmed',
    category: 'Building Expo',
    description: 'Buildex Vancouver - Pacific Rim Architecture, Construction & Engineering Summit',
    actionPlan: 'Confirm floor booth sponsorship; launch targeted LinkedIn InMail sequence to local PMs.'
  },
  {
    id: 'conf-3',
    dateAdded: '2026-10-28',
    status: 'Planned',
    category: 'Trade Show',
    description: 'Buildex Show in Toronto - National Construction & Commercial Building Expo',
    actionPlan: 'Coordinate with Sebastien on VIP dinner invitations for top 15 target estimators.'
  },
  {
    id: 'conf-4',
    dateAdded: '2026-11-02',
    status: 'Planned',
    category: 'Executive Summit',
    description: 'Canadian Construction Association Annual Conference',
    actionPlan: 'Prepare executive strategy deck & one-pager collateral packets for leadership networking.'
  },
  {
    id: 'conf-5',
    dateAdded: '2026-09-14',
    status: 'Completed',
    category: 'Industry Forum',
    description: 'Regional MEP Contractors Innovation Forum',
    actionPlan: 'Followed up with 18 attendee leads; 6 qualified accounts logged into Excel CRM.'
  }
]

interface AccountManagementActivitiesPageProps {
  onBackToDashboard?: () => void
}

export function AccountManagementActivitiesPage({
  onBackToDashboard
}: AccountManagementActivitiesPageProps) {
  // ── ACTIVE TAB: 'crm' | 'conferences' ──
  const [activeTab, setActiveTab] = useState<'crm' | 'conferences'>('crm')

  // ── DATA STATES ──
  const [crmData, setCrmData] = useState<CrmSupportRecord[]>(INITIAL_CRM_SUPPORT)
  const [conferencesData, setConferencesData] = useState<ConferenceRecord[]>(INITIAL_CONFERENCES)

  // ── SEARCH & FILTER ──
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // ── ADD MODAL STATE ──
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [crmForm, setCrmForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    location: '',
    name: '',
    website: '',
    industry: 'Electrical'
  })
  const [confForm, setConfForm] = useState({
    dateAdded: new Date().toISOString().slice(0, 10),
    status: 'Planned' as ConferenceRecord['status'],
    category: 'Trade Show',
    description: '',
    actionPlan: ''
  })

  // ── FILTERED CRM DATA ──
  const filteredCrmData = useMemo(() => {
    return crmData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.industry.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesIndustry = industryFilter === 'ALL' || item.industry === industryFilter
      return matchesSearch && matchesIndustry
    })
  }, [crmData, searchTerm, industryFilter])

  // ── FILTERED CONFERENCES DATA ──
  const filteredConferencesData = useMemo(() => {
    return conferencesData.filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.actionPlan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [conferencesData, searchTerm, statusFilter])

  // ── ADD SUBMISSION ──
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'crm') {
      if (!crmForm.name || !crmForm.location) {
        toast.error('Please enter Name and Location.')
        return
      }
      const newRecord: CrmSupportRecord = {
        id: `crm-${Date.now()}`,
        date: crmForm.date,
        location: crmForm.location,
        name: crmForm.name,
        website: crmForm.website || 'www.example.com',
        industry: crmForm.industry
      }
      setCrmData([newRecord, ...crmData])
      toast.success('CRM Support record added successfully!')
      setCrmForm({
        date: new Date().toISOString().slice(0, 10),
        location: '',
        name: '',
        website: '',
        industry: 'Electrical'
      })
    } else {
      if (!confForm.description || !confForm.actionPlan) {
        toast.error('Please enter Description and Action Plan.')
        return
      }
      const newRecord: ConferenceRecord = {
        id: `conf-${Date.now()}`,
        dateAdded: confForm.dateAdded,
        status: confForm.status,
        category: confForm.category,
        description: confForm.description,
        actionPlan: confForm.actionPlan
      }
      setConferencesData([newRecord, ...conferencesData])
      toast.success('Conference record added successfully!')
      setConfForm({
        dateAdded: new Date().toISOString().slice(0, 10),
        status: 'Planned',
        category: 'Trade Show',
        description: '',
        actionPlan: ''
      })
    }
    setIsAddOpen(false)
  }

  // ── EXPORT CSV ──
  const handleExportCsv = () => {
    if (activeTab === 'crm') {
      const headers = ['Date,Location,Name,Website,Industry']
      const rows = filteredCrmData.map(
        (r) => `"${r.date}","${r.location}","${r.name}","${r.website}","${r.industry}"`
      )
      const csvContent = [headers, ...rows].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `CRM_Support_${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('CRM Support records exported to CSV!')
    } else {
      const headers = ['Date Added,Status,Category,Description,Action Plan']
      const rows = filteredConferencesData.map(
        (r) =>
          `"${r.dateAdded}","${r.status}","${r.category}","${r.description.replace(/"/g, '""')}","${r.actionPlan.replace(/"/g, '""')}"`
      )
      const csvContent = [headers, ...rows].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Conferences_${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Conferences exported to CSV!')
    }
  }

  // ── STATUS COLOR MAP ──
  const getStatusBadge = (status: ConferenceRecord['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-xs font-bold gap-1">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Confirmed
          </Badge>
        )
      case 'Planned':
        return (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 text-xs font-bold gap-1">
            <span className="size-1.5 rounded-full bg-blue-500" />
            Planned
          </Badge>
        )
      case 'Under Review':
        return (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 text-xs font-bold gap-1">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Under Review
          </Badge>
        )
      case 'Completed':
        return (
          <Badge className="bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-xs font-bold gap-1">
            <CheckCircle2 className="size-3 text-slate-500" />
            Completed
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────────
          EXECUTIVE PAGE HEADER
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFC000]">
              Account Business Plan
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Badge
              variant="outline"
              className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold gap-1 px-2.5 py-0.5"
            >
              <CheckCircle2 className="size-3" />
              Operational Enablement Active
            </Badge>
          </div>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-[#0B1F5C] dark:text-white sm:text-3xl">
            Account Management Activities
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500 dark:text-slate-400">
            Dedicated operational management workspace for client CRM support logging and industry conference action plans.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="gap-1.5 text-xs text-slate-700 hover:text-slate-900 dark:text-slate-300"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="gap-1.5 text-xs bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-xs"
          >
            <Plus className="size-3.5" />
            Add {activeTab === 'crm' ? 'CRM Record' : 'Conference'}
          </Button>

          {onBackToDashboard && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBackToDashboard}
              className="gap-1.5 text-xs text-[#0B1F5C] hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="size-3.5" />
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          NAVIGATION SWITCHER: CRM SUPPORT vs CONFERENCES
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tab 1: CRM Support */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('crm')
            setSearchTerm('')
          }}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
            activeTab === 'crm'
              ? 'border-blue-500 bg-gradient-to-r from-blue-50/80 to-white shadow-sm ring-1 ring-blue-500 dark:from-blue-950/30 dark:to-slate-900 dark:border-blue-600'
              : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs dark:border-slate-800 dark:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`grid size-12 place-items-center rounded-xl shadow-xs transition-colors shrink-0 ${
                activeTab === 'crm'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <Database className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  CRM Support
                </h3>
                {activeTab === 'crm' && (
                  <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Date · Location · Name · Website · Industry
              </p>
            </div>
          </div>

          <Badge
            className={`text-xs font-bold px-2.5 py-1 shrink-0 ${
              activeTab === 'crm'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {crmData.length} Records
          </Badge>
        </button>

        {/* Tab 2: Conferences */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('conferences')
            setSearchTerm('')
          }}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
            activeTab === 'conferences'
              ? 'border-blue-500 bg-gradient-to-r from-blue-50/80 to-white shadow-sm ring-1 ring-blue-500 dark:from-blue-950/30 dark:to-slate-900 dark:border-blue-600'
              : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs dark:border-slate-800 dark:bg-slate-900/60'
          }`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`grid size-12 place-items-center rounded-xl shadow-xs transition-colors shrink-0 ${
                activeTab === 'conferences'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <CalendarDays className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Conferences
                </h3>
                {activeTab === 'conferences' && (
                  <span className="size-2 rounded-full bg-indigo-600 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Date Added · Status · Category · Description · Action Plan
              </p>
            </div>
          </div>

          <Badge
            className={`text-xs font-bold px-2.5 py-1 shrink-0 ${
              activeTab === 'conferences'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {conferencesData.length} Events
          </Badge>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DATA TABLE CONTAINER CARD
      ───────────────────────────────────────────────────────────── */}
      <Card className="border-slate-200/90 shadow-xs dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800/80 dark:bg-slate-900/40">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title & Description */}
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg bg-[#0B1F5C] text-sm font-bold text-white shadow-xs dark:bg-blue-600">
                {activeTab === 'crm' ? <Database className="size-4" /> : <CalendarDays className="size-4" />}
              </span>
              <div>
                <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                  {activeTab === 'crm' ? 'CRM Support Ledger' : 'Conferences & Trade Shows Register'}
                </CardTitle>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {activeTab === 'crm'
                    ? 'Active client CRM support engagement logs formatted for direct Excel & HubSpot synchronization.'
                    : 'Target industry exhibitions, trade shows, and proactive engagement action plans.'}
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={activeTab === 'crm' ? 'Search records, location...' : 'Search conferences...'}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              {/* Industry Filter (CRM Tab) */}
              {activeTab === 'crm' && (
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-44 h-9 text-xs">
                    <SelectValue placeholder="Industry Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Industries</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="General Contracting">General Contracting</SelectItem>
                    <SelectItem value="Plumbing & Piping">Plumbing & Piping</SelectItem>
                    <SelectItem value="Business Development">Business Development</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Status Filter (Conferences Tab) */}
              {activeTab === 'conferences' && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 h-9 text-xs">
                    <SelectValue placeholder="Status Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* ─────────────────────────────────────────────────────────────
              VIEW 1: CRM SUPPORT TABLE
              Columns: Date | Location | Name | Website | Industry
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'crm' && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/60 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="w-36 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Date
                    </TableHead>
                    <TableHead className="w-44 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Location
                    </TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Name
                    </TableHead>
                    <TableHead className="w-56 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Website
                    </TableHead>
                    <TableHead className="w-48 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Industry
                    </TableHead>
                    <TableHead className="w-16 text-right text-xs font-bold text-slate-700 dark:text-slate-300">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCrmData.length > 0 ? (
                    filteredCrmData.map((row) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* 1. Date */}
                        <TableCell className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3.5 text-slate-400" />
                            {row.date}
                          </div>
                        </TableCell>

                        {/* 2. Location */}
                        <TableCell className="text-xs text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{row.location}</span>
                          </div>
                        </TableCell>

                        {/* 3. Name */}
                        <TableCell className="font-bold text-xs text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-blue-600" />
                            <span>{row.name}</span>
                          </div>
                        </TableCell>

                        {/* 4. Website */}
                        <TableCell className="text-xs">
                          <a
                            href={`https://${row.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 font-medium"
                          >
                            <Globe className="size-3.5 text-blue-500" />
                            <span>{row.website}</span>
                            <ExternalLink className="size-3 text-slate-400" />
                          </a>
                        </TableCell>

                        {/* 5. Industry */}
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-xs font-bold bg-slate-100 text-[#0B1F5C] border border-slate-200/80 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                          >
                            {row.industry}
                          </Badge>
                        </TableCell>

                        {/* Row Actions */}
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCrmData(crmData.filter((item) => item.id !== row.id))
                              toast.success('Record removed')
                            }}
                            className="size-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-400">
                        No CRM Support records found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 2: CONFERENCES TABLE
              Columns: Date Added | Status | Category | Description | Action Plan
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'conferences' && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/60 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="w-36 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Date Added
                    </TableHead>
                    <TableHead className="w-36 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Status
                    </TableHead>
                    <TableHead className="w-40 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Category
                    </TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Description
                    </TableHead>
                    <TableHead className="w-80 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Action Plan
                    </TableHead>
                    <TableHead className="w-16 text-right text-xs font-bold text-slate-700 dark:text-slate-300">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredConferencesData.length > 0 ? (
                    filteredConferencesData.map((row) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* 1. Date Added */}
                        <TableCell className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3.5 text-slate-400" />
                            {row.dateAdded}
                          </div>
                        </TableCell>

                        {/* 2. Status */}
                        <TableCell>{getStatusBadge(row.status)}</TableCell>

                        {/* 3. Category */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs font-bold bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                          >
                            {row.category}
                          </Badge>
                        </TableCell>

                        {/* 4. Description */}
                        <TableCell className="text-xs font-bold text-slate-900 dark:text-white">
                          <div className="flex items-start gap-2">
                            <Building2 className="size-4 text-indigo-600 mt-0.5 shrink-0" />
                            <span className="leading-snug">{row.description}</span>
                          </div>
                        </TableCell>

                        {/* 5. Action Plan */}
                        <TableCell className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          <div className="flex items-start gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{row.actionPlan}</span>
                          </div>
                        </TableCell>

                        {/* Row Actions */}
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setConferencesData(conferencesData.filter((item) => item.id !== row.id))
                              toast.success('Conference removed')
                            }}
                            className="size-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-400">
                        No Conferences found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Table Footer Summary Bar */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-100 p-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-900/30">
            <span>
              Showing{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {activeTab === 'crm' ? filteredCrmData.length : filteredConferencesData.length}
              </strong>{' '}
              of{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {activeTab === 'crm' ? crmData.length : conferencesData.length}
              </strong>{' '}
              total records
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Format: Standard Tabular Register
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          ADD RECORD DIALOG MODAL
      ───────────────────────────────────────────────────────────── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-[#0B1F5C] dark:text-white flex items-center gap-2">
                {activeTab === 'crm' ? <Database className="size-4" /> : <CalendarDays className="size-4" />}
                Add New {activeTab === 'crm' ? 'CRM Support Record' : 'Conference Entry'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-3.5 py-4">
              {activeTab === 'crm' ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={crmForm.date}
                      onChange={(e) => setCrmForm({ ...crmForm, date: e.target.value })}
                      className="mt-1 h-9 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Location
                    </label>
                    <Input
                      value={crmForm.location}
                      onChange={(e) => setCrmForm({ ...crmForm, location: e.target.value })}
                      placeholder="e.g. Toronto, ON or Virtual"
                      className="mt-1 h-9 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Name
                    </label>
                    <Input
                      value={crmForm.name}
                      onChange={(e) => setCrmForm({ ...crmForm, name: e.target.value })}
                      placeholder="e.g. Apex Contracting Ltd."
                      className="mt-1 h-9 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Website
                    </label>
                    <Input
                      value={crmForm.website}
                      onChange={(e) => setCrmForm({ ...crmForm, website: e.target.value })}
                      placeholder="e.g. www.apexelectrical.ca"
                      className="mt-1 h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Industry
                    </label>
                    <Select
                      value={crmForm.industry}
                      onValueChange={(val) => setCrmForm({ ...crmForm, industry: val })}
                    >
                      <SelectTrigger className="mt-1 h-9 text-xs">
                        <SelectValue placeholder="Select Industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="General Contracting">General Contracting</SelectItem>
                        <SelectItem value="Plumbing & Piping">Plumbing & Piping</SelectItem>
                        <SelectItem value="Business Development">Business Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Date Added
                    </label>
                    <Input
                      type="date"
                      value={confForm.dateAdded}
                      onChange={(e) => setConfForm({ ...confForm, dateAdded: e.target.value })}
                      className="mt-1 h-9 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <Select
                      value={confForm.status}
                      onValueChange={(val: any) => setConfForm({ ...confForm, status: val })}
                    >
                      <SelectTrigger className="mt-1 h-9 text-xs">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Planned">Planned</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <Input
                      value={confForm.category}
                      onChange={(e) => setConfForm({ ...confForm, category: e.target.value })}
                      placeholder="e.g. Trade Show, Building Expo"
                      className="mt-1 h-9 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Description
                    </label>
                    <Input
                      value={confForm.description}
                      onChange={(e) => setConfForm({ ...confForm, description: e.target.value })}
                      placeholder="e.g. Buildex Calgary 2026 Exhibition"
                      className="mt-1 h-9 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Action Plan
                    </label>
                    <Input
                      value={confForm.actionPlan}
                      onChange={(e) => setConfForm({ ...confForm, actionPlan: e.target.value })}
                      placeholder="e.g. Booth registration & pre-conference outreach"
                      className="mt-1 h-9 text-xs"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-blue-600"
              >
                Save Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
