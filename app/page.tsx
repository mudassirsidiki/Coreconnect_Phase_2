'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Search, Moon, Sun, Settings, ChevronDown, Download, Plus, Filter, LayoutDashboard, Building2, TrendingUp, Activity, FileText, Presentation, Palette, Ratio, Mail, Network, Phone, CalendarDays, MoreHorizontal, Check, X, Menu, ArrowUpRight, Globe, SlidersHorizontal, Calendar, Briefcase, Send, MessageSquare, Layers, ArrowUp, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { toast } from 'sonner'
import { industries, regions, channels, statuses, leads as seedLeads, meetings as seedMeetings, opportunities as seedOpportunities, wins, supportRecords as seedSupport, conferences as seedConferences, proposals, countBy, money, downloadCsv, navItems, type Filters, defaultFilters, filterLeads, filterMeetings, filterWins, formatDate, gtmRows, emailDraft, creativePlaceholders, accountNames, accountBusinessPlans } from '@/lib/data'
import { ResearchSection } from '@/components/research/ResearchSection'
import { OutreachSection } from '@/components/outreach/OutreachSection'
import { OutreachAnalysisPage } from '@/components/outreach/OutreachAnalysisPage'
import { OpportunitiesSection } from '@/components/opportunities/OpportunitiesSection'
import { OpportunitiesAnalysisPage } from '@/components/opportunities/OpportunitiesAnalysisPage'
import { RfpSection } from '@/components/rfp/RfpSection'
import { RfpAnalysisPage } from '@/components/rfp/RfpAnalysisPage'
import { ResponsesSection } from '@/components/responses/ResponsesSection'
import { ResponsesAnalysisPage } from '@/components/responses/ResponsesAnalysisPage'
import { RevenuePipelinePage } from '@/components/revenue/RevenuePipelinePage'
import { type OpportunityStage } from '@/lib/opportunities-data'

export const dashboardSections = [
  { id: 'section-research', step: '1', tag: '1- Research', label: 'Research', icon: Search },
  { id: 'section-outreach', step: '2', tag: '2- Outreach', label: 'Outreach', icon: Send },
  { id: 'section-opportunities', step: '3', tag: '3- Opportunities', label: 'Opportunities', icon: Briefcase },
  { id: 'section-rfp', step: '4', tag: '4- Request for proposals', label: 'Request for proposals', icon: FileText },
  { id: 'section-response', step: '5', tag: '5- Responses', label: 'Responses', icon: MessageSquare },
]

type Page = typeof navItems[number] | 'Outreach Analysis' | 'Opportunities Analysis' | "RFP's Analysis" | 'Responses Analysis'
const icons = [LayoutDashboard, Building2, TrendingUp, Activity, FileText, Presentation, Palette, Ratio]
const colors = ['#0B1F5C','#FFC000','#B6E4A0','#78A6D8','#E49B7A']

export default function Page() {
  const [page, setPage] = useState<Page>('Dashboard')
  const [dark, setDark] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All')
  const [selectedRegion, setSelectedRegion] = useState<string>('All')
  const [datePreset, setDatePreset] = useState<string>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [search, setSearch] = useState('')
  const [leads, setLeads] = useState(seedLeads)
  const [meetings, setMeetings] = useState(seedMeetings)
  const [opportunities, setOpportunities] = useState(seedOpportunities)
  const [support, setSupport] = useState(seedSupport)
  const [conferences, setConferences] = useState(seedConferences)
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [totalOpportunities, setTotalOpportunities] = useState(48)
  const [mobileNav, setMobileNav] = useState(false)
  const [activeSection, setActiveSection] = useState('section-research')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [rfpInitialTab, setRfpInitialTab] = useState<string>('All')
  const [responsesInitialTab, setResponsesInitialTab] = useState<'All' | 'Positive' | 'Prospect' | 'Negative'>('All')

  const isManualScrollingRef = useRef(false)
  const manualScrollTimerRef = useRef<NodeJS.Timeout | null>(null)

  const performScroll = (id: string) => {
    setActiveSection(id)
    isManualScrollingRef.current = true
    if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current)

    const el = document.getElementById(id)
    if (el) {
      const filterBar = document.getElementById('sticky-filter-bar')
      const headerHeight = 64
      const filterBarHeight = filterBar ? filterBar.getBoundingClientRect().height : 120
      const totalOffset = headerHeight + filterBarHeight + 16

      const elementY = el.getBoundingClientRect().top + window.scrollY
      const targetY = Math.max(0, elementY - totalOffset)

      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      })
    }

    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollingRef.current = false
    }, 850)
  }

  const scrollToSection = (id: string) => {
    if (page !== 'Dashboard') {
      setPage('Dashboard')
      setTimeout(() => {
        performScroll(id)
      }, 120)
      return
    }
    performScroll(id)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowBackToTop(scrollY > 280)

      if (page !== 'Dashboard') return
      if (isManualScrollingRef.current) return

      // If user scrolled to near the bottom of the page, activate the last section
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      if (windowHeight + scrollY >= documentHeight - 60) {
        setActiveSection('section-response')
        return
      }

      const filterBar = document.getElementById('sticky-filter-bar')
      const headerHeight = 64
      const filterBarHeight = filterBar ? filterBar.getBoundingClientRect().height : 120
      const threshold = headerHeight + filterBarHeight + 35

      const sectionIds = [
        'section-response',
        'section-rfp',
        'section-opportunities',
        'section-outreach',
        'section-research'
      ]

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= threshold) {
            setActiveSection(id)
            return
          }
        }
      }

      setActiveSection('section-research')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current)
    }
  }, [page])

  const filteredWins = useMemo(() => {
    return wins.filter(w => {
      if (selectedIndustry !== 'All' && w.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && w.region !== selectedRegion) return false
      if (startDate && w.dateWon < startDate) return false
      if (endDate && w.dateWon > endDate) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate])

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (selectedIndustry !== 'All' && l.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && l.region !== selectedRegion) return false
      if (startDate && l.date < startDate) return false
      if (endDate && l.date > endDate) return false
      if (search && !`${l.name} ${l.account}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate, search, leads])

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      if (selectedIndustry !== 'All' && m.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && m.region !== selectedRegion) return false
      if (startDate && m.date < startDate) return false
      if (endDate && m.date > endDate) return false
      if (search && !`${m.lead} ${m.account}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [selectedIndustry, selectedRegion, startDate, endDate, search, meetings])

  const resetAllFilters = () => {
    setSelectedIndustry('All')
    setSelectedRegion('All')
    setDatePreset('all')
    setStartDate('')
    setEndDate('')
    toast.info('All filters reset to default view')
  }

  return <div className={dark ? 'dark' : ''}>
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B1F5C] text-white transition-transform lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/15 px-5"><div className="grid size-9 place-items-center rounded-lg bg-[#FFC000] text-[#0B1F5C] font-black text-xs">CC</div><div><div className="font-bold tracking-wide">CORECONNECT V2</div><div className="text-[10px] uppercase tracking-[.2em] text-blue-200">Revenue operations</div></div></div>
        <nav className="flex flex-1 flex-col gap-1 p-3 overflow-y-auto">
          {/* Dashboard */}
          <button
            onClick={() => {
              setPage('Dashboard')
              setMobileNav(false)
            }}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
              page === 'Dashboard'
                ? 'bg-white text-[#0B1F5C] font-semibold shadow-xs'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="size-4" />
            <span>Dashboard</span>
            {page === 'Dashboard' && <span className="ml-auto size-2 rounded-full bg-[#FFC000]" />}
          </button>

          {/* Deep-Dive Analysis Pages (Directly below Dashboard in left panel) */}
          <div className="mt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-200/60">
            Analysis & Tables
          </div>

          <button
            onClick={() => {
              setPage('Outreach Analysis')
              setMobileNav(false)
            }}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition group ${
              page === 'Outreach Analysis'
                ? 'bg-white text-[#0B1F5C] font-semibold shadow-xs'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Send className="size-4 text-[#FFC000]" />
            <span className="flex-1">Outreach Analysis</span>
            {page === 'Outreach Analysis' && <span className="size-2 rounded-full bg-[#FFC000]" />}
          </button>

          {/* Opportunities Analysis Page (Directly below Outreach Analysis in left panel) */}
          <button
            onClick={() => {
              setPage('Opportunities Analysis')
              setMobileNav(false)
            }}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition group ${
              page === 'Opportunities Analysis'
                ? 'bg-white text-[#0B1F5C] font-semibold shadow-xs'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Briefcase className="size-4 text-[#FFC000]" />
            <span className="flex-1">Opportunities Analysis</span>
            {page === 'Opportunities Analysis' && <span className="size-2 rounded-full bg-[#FFC000]" />}
          </button>

          {/* RFP's Analysis Page (Directly below Opportunities Analysis in left panel) */}
          <button
            onClick={() => {
              setRfpInitialTab('All')
              setPage("RFP's Analysis")
              setMobileNav(false)
            }}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition group ${
              page === "RFP's Analysis"
                ? 'bg-white text-[#0B1F5C] font-semibold shadow-xs'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <FileText className="size-4 text-[#FFC000]" />
            <span className="flex-1">RFP's Analysis</span>
            {page === "RFP's Analysis" && <span className="size-2 rounded-full bg-[#FFC000]" />}
          </button>

          {/* Responses Analysis Page (Directly below RFP's Analysis in left panel) */}
          <button
            onClick={() => {
              setResponsesInitialTab('All')
              setPage('Responses Analysis')
              setMobileNav(false)
            }}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition group ${
              page === 'Responses Analysis'
                ? 'bg-white text-[#0B1F5C] font-semibold shadow-xs'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="size-4 text-[#FFC000]" />
            <span className="flex-1">Responses Analysis</span>
            {page === 'Responses Analysis' && <span className="size-2 rounded-full bg-[#FFC000]" />}
          </button>

          {/* Workspace Modules: Account Business Plans & Revenue Pipeline & Sales */}
          <div className="mt-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-200/60">
            Workspace Modules
          </div>

          {navItems.slice(1, 3).map((item, index) => {
            const Icon = icons[index + 1]
            return (
              <button
                key={item}
                onClick={() => {
                  setPage(item)
                  setMobileNav(false)
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition group ${
                  page === item
                    ? 'bg-white text-[#0B1F5C] font-semibold shadow-xs'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <Icon className="size-4 shrink-0 text-blue-200 group-hover:text-white" />
                <span className="flex-1 truncate">{item}</span>
                {page === item && <span className="size-2 rounded-full bg-[#FFC000]" />}
              </button>
            )
          })}
        </nav>
        {/* Quarter progress widget hidden per user request */}
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:px-8"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setMobileNav(true)}><Menu/></Button><div><div className="text-xs font-medium uppercase tracking-widest text-slate-400">Workspace / {page}</div><h1 className="font-semibold text-[#0B1F5C] dark:text-white">{page}</h1></div></div><div className="flex items-center gap-2"><div className="relative hidden md:block"><Search className="absolute left-3 top-2.5 size-4 text-slate-400"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search accounts, leads..." className="w-64 pl-9"/></div><Button variant="ghost" size="icon" onClick={()=>setDark(!dark)}>{dark?<Sun/>:<Moon/>}</Button><Button variant="ghost" size="icon" onClick={()=>setSettingsOpen(true)}><Settings/></Button><div className="grid size-8 place-items-center rounded-full bg-[#B6E4A0] text-xs font-bold text-[#0B1F5C]">AM</div></div></header>
        
        {/* 3 Top Filters/Slicers (Industry, Region, Date Filter) & 5-Section Ribbon */}
        <FilterBar
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          datePreset={datePreset}
          setDatePreset={setDatePreset}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onReset={resetAllFilters}
          activeSection={activeSection}
          onSelectSection={scrollToSection}
        />

        <div className="p-4 lg:p-8">
          {page==='Dashboard'&&<Dashboard
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            datePreset={datePreset}
            setDatePreset={setDatePreset}
            onNavigateToOutreachAnalysis={() => setPage('Outreach Analysis')}
            onNavigateToOpportunitiesAnalysis={() => setPage('Opportunities Analysis')}
            onNavigateToRfpAnalysis={(cat) => {
              if (cat) setRfpInitialTab(cat)
              setPage("RFP's Analysis")
            }}
            onNavigateToResponsesAnalysis={(tab) => {
              if (tab) setResponsesInitialTab(tab)
              setPage('Responses Analysis')
            }}
          />}
          {page==='Outreach Analysis'&&<OutreachAnalysisPage
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            datePreset={datePreset}
            setDatePreset={setDatePreset}
            onBackToDashboard={() => setPage('Dashboard')}
          />}
          {page==='Opportunities Analysis'&&<OpportunitiesAnalysisPage
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            datePreset={datePreset}
            setDatePreset={setDatePreset}
            onBackToDashboard={() => setPage('Dashboard')}
          />}
          {page==="RFP's Analysis"&&<RfpAnalysisPage
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            datePreset={datePreset}
            setDatePreset={setDatePreset}
            initialTab={rfpInitialTab}
            onBackToDashboard={() => setPage('Dashboard')}
          />}
          {page==='Responses Analysis'&&<ResponsesAnalysisPage
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            datePreset={datePreset}
            setDatePreset={setDatePreset}
            initialTab={responsesInitialTab}
            onBackToDashboard={() => setPage('Dashboard')}
          />}
          {page==='Account Business Plans'&&<BusinessPlans onBackToDashboard={()=>setPage('Dashboard')}/>}
          {page==='Revenue Pipeline & Sales'&&<RevenuePipelinePage
            wins={filteredWins}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            datePreset={datePreset}
            setDatePreset={setDatePreset}
            onBackToDashboard={()=>setPage('Dashboard')}
          />}
          {page==='Account Management Activities'&&<Activities support={support} setSupport={setSupport} conferences={conferences} setConferences={setConferences} onBackToDashboard={()=>setPage('Dashboard')}/>}
          {page==='Documents'&&<Documents onBackToDashboard={()=>setPage('Dashboard')}/>}
          {page==='Proposals'&&<Proposals onBackToDashboard={()=>setPage('Dashboard')}/>}
          {page==='Creative Support'&&<Creative onBackToDashboard={()=>setPage('Dashboard')}/>}
          {page==='Ratios'&&<Ratios leads={filteredLeads} wins={filteredWins} onBackToDashboard={()=>setPage('Dashboard')}/>}
        </div>

        {/* Floating Back to Top Button */}
        <button
          type="button"
          onClick={() => {
            isManualScrollingRef.current = true
            setActiveSection('section-research')
            window.scrollTo({ top: 0, behavior: 'smooth' })
            if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current)
            manualScrollTimerRef.current = setTimeout(() => {
              isManualScrollingRef.current = false
            }, 850)
          }}
          aria-label="Back to top"
          title="Back to top"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold shadow-2xl transition-all duration-300 backdrop-blur-md cursor-pointer ${
            showBackToTop
              ? 'translate-y-0 opacity-100 scale-100'
              : 'translate-y-6 opacity-0 scale-90 pointer-events-none'
          } bg-[#0B1F5C] text-white hover:bg-[#07153d] hover:shadow-blue-950/40 dark:bg-[#FFC000] dark:text-[#0B1F5C] dark:hover:bg-[#e0a800] ring-2 ring-white/30 dark:ring-[#0B1F5C]/30 hover:scale-105 active:scale-95`}
        >
          <div className="flex size-5 items-center justify-center rounded-full bg-white/20 dark:bg-[#0B1F5C]/20">
            <ArrowUp className="size-3.5 stroke-[2.5]" />
          </div>
          <span className="tracking-wide">Back to top</span>
        </button>
      </main>
      <Sheet open={!!selectedMeeting} onOpenChange={(open)=>{if(!open) setSelectedMeeting(null)}}><SheetContent><SheetHeader><SheetTitle>Meeting details</SheetTitle></SheetHeader>{selectedMeeting&&<div className="mt-6 flex flex-col gap-5"><div><div className="text-lg font-semibold">{selectedMeeting.account}</div><div className="text-sm text-muted-foreground">{selectedMeeting.lead} · {formatDate(selectedMeeting.date)}</div></div><Field label="Attendees" value={selectedMeeting.attendees}/><Field label="Agenda" value={selectedMeeting.agenda}/><Field label="Notes" value={selectedMeeting.comments}/><Button onClick={()=>{toast.success('Meeting updated');setSelectedMeeting(null)}}>Save changes</Button></div>}</SheetContent></Sheet>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}><DialogContent><DialogHeader><DialogTitle>Workspace settings</DialogTitle></DialogHeader><div className="flex flex-col gap-5"><label className="text-sm font-medium">Backend total opportunities<Input type="number" value={totalOpportunities} onChange={e=>setTotalOpportunities(+e.target.value)} className="mt-2"/></label><div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900">Calculated from dataset: <b>{opportunities.length}</b></div><Button variant="outline" onClick={resetAllFilters}>Reset filters</Button></div></DialogContent></Dialog>
    </div>
  </div>
}

function FilterBar({
  selectedIndustry,
  setSelectedIndustry,
  selectedRegion,
  setSelectedRegion,
  datePreset,
  setDatePreset,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset,
  activeSection,
  onSelectSection
}: {
  selectedIndustry: string
  setSelectedIndustry: (v: string) => void
  selectedRegion: string
  setSelectedRegion: (v: string) => void
  datePreset: string
  setDatePreset: (v: string) => void
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  onReset: () => void
  activeSection?: string
  onSelectSection?: (id: string) => void
}) {
  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset)
    if (preset === 'all') {
      setStartDate('')
      setEndDate('')
    } else if (preset === 'this-month') {
      setStartDate('2026-10-01')
      setEndDate('2026-10-31')
    } else if (preset === 'last-7-days') {
      setStartDate('2026-10-09')
      setEndDate('2026-10-15')
    } else if (preset === 'last-14-days') {
      setStartDate('2026-10-02')
      setEndDate('2026-10-15')
    } else if (preset === 'last-30-days') {
      setStartDate('2026-09-16')
      setEndDate('2026-10-15')
    } else if (preset === 'q3') {
      setStartDate('2026-07-01')
      setEndDate('2026-09-30')
    } else if (preset === 'q4') {
      setStartDate('2026-10-01')
      setEndDate('2026-12-31')
    }
  }

  const isFiltered = selectedIndustry !== 'All' || selectedRegion !== 'All' || startDate !== '' || endDate !== '' || datePreset !== 'all'

  return (
    <div id="sticky-filter-bar" className="sticky top-16 z-20 border-b bg-white/95 px-4 py-3 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Header Tag */}
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B1F5C] dark:text-[#FFC000]">
            <SlidersHorizontal className="size-4" />
            <span>Slicers:</span>
          </div>

          {/* 1. INDUSTRY SLICER (Exact 8 Industries) */}
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Building2 className="size-3.5 text-slate-400" />
              Industry:
            </span>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="h-9 w-48 text-xs font-medium bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs">
                <SelectValue placeholder="All Industries (8)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="font-semibold">
                  All Industries (8)
                </SelectItem>
                {industries.map(ind => (
                  <SelectItem key={ind} value={ind} className="text-xs">
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. REGION SLICER (Exact 3 Regions) */}
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Globe className="size-3.5 text-slate-400" />
              Region:
            </span>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="h-9 w-40 text-xs font-medium bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs">
                <SelectValue placeholder="All Regions (3)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="font-semibold">
                  All Regions (3)
                </SelectItem>
                {regions.map(reg => (
                  <SelectItem key={reg} value={reg} className="text-xs">
                    {reg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. DATE RANGE SLICER */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <CalendarDays className="size-3.5 text-slate-400" />
              Date Filter:
            </span>
            {/* Quick Presets */}
            <Select value={datePreset} onValueChange={handleDatePresetChange}>
              <SelectTrigger className="h-9 w-44 text-xs font-medium bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-2xs">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-semibold">All Time (Full Dataset)</SelectItem>
                <SelectItem value="this-month">This Month (Oct 2026)</SelectItem>
                <SelectItem value="last-7-days">Last 7 Days (Oct 9–15)</SelectItem>
                <SelectItem value="last-14-days">Last 14 Days (Oct 2–15)</SelectItem>
                <SelectItem value="last-30-days">Last 30 Days (Sep 16–Oct 15)</SelectItem>
                <SelectItem value="q3">Q3 2026 (Jul 1 – Sep 30)</SelectItem>
                <SelectItem value="q4">Q4 2026 (Oct 1 – Dec 31)</SelectItem>
                <SelectItem value="custom">Custom Range...</SelectItem>
              </SelectContent>
            </Select>

            {/* Custom Range Inputs */}
            <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">From</span>
              <input
                type="date"
                value={startDate}
                onChange={e => {
                  setStartDate(e.target.value)
                  setDatePreset('custom')
                }}
                className="h-6 w-28 bg-transparent text-xs text-slate-800 focus:outline-none dark:text-slate-200 cursor-pointer"
                title="Start Date"
              />
              <span className="text-slate-300 dark:text-slate-600">→</span>
              <span className="text-[10px] font-bold uppercase text-slate-400">To</span>
              <input
                type="date"
                value={endDate}
                onChange={e => {
                  setEndDate(e.target.value)
                  setDatePreset('custom')
                }}
                className="h-6 w-28 bg-transparent text-xs text-slate-800 focus:outline-none dark:text-slate-200 cursor-pointer"
                title="End Date"
              />
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('')
                    setEndDate('')
                    setDatePreset('all')
                  }}
                  className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                  title="Clear date range"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            className="h-8.5 text-xs font-semibold text-rose-600 border-rose-200 bg-rose-50/50 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 gap-1.5"
            onClick={onReset}
          >
            <X className="size-3.5" />
            Reset All Slicers
          </Button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5-SECTION NAVIGATION RIBBON DIRECTLY BENEATH SLICERS        */}
      {/* ─────────────────────────────────────────────────────────── */}
      {onSelectSection && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B1F5C] dark:text-[#FFC000]">
              <Layers className="size-3.5 text-slate-400" />
              <span>Sections:</span>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              5 Stages
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
            {dashboardSections.map((sec, idx) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.id
              return (
                <div key={sec.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => onSelectSection(sec.id)}
                    title={`Navigate to ${sec.tag}`}
                    className={`group relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#0B1F5C] text-white shadow-md ring-2 ring-[#0B1F5C]/25 dark:bg-[#FFC000] dark:text-[#0B1F5C] dark:ring-[#FFC000]/30'
                        : 'bg-white/80 text-slate-700 hover:bg-white hover:text-slate-950 hover:shadow-xs border border-slate-200/60 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {/* Icon */}
                    <Icon
                      className={`size-3.5 transition-colors ${
                        isActive
                          ? 'text-[#FFC000] dark:text-[#0B1F5C]'
                          : 'text-slate-400 group-hover:text-[#0B1F5C] dark:text-slate-400 dark:group-hover:text-[#FFC000]'
                      }`}
                    />

                    {/* Exact Tag Label */}
                    <span className={`tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                      {sec.tag}
                    </span>

                    {/* Active Glowing Dot */}
                    {isActive && (
                      <span className="size-1.5 rounded-full bg-[#FFC000] animate-pulse dark:bg-[#0B1F5C]" />
                    )}
                  </button>

                  {/* Connector arrow between steps */}
                  {idx < dashboardSections.length - 1 && (
                    <ChevronRight className="mx-0.5 size-3 text-slate-300 dark:text-slate-700 hidden xl:block shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function Dashboard({
  selectedIndustry,
  setSelectedIndustry,
  selectedRegion,
  setSelectedRegion,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  datePreset,
  setDatePreset,
  onNavigateToOutreachAnalysis,
  onNavigateToOpportunitiesAnalysis,
  onNavigateToRfpAnalysis,
  onNavigateToResponsesAnalysis
}: {
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
  onNavigateToOutreachAnalysis?: () => void
  onNavigateToOpportunitiesAnalysis?: () => void
  onNavigateToRfpAnalysis?: (category?: string) => void
  onNavigateToResponsesAnalysis?: (tab?: 'All' | 'Positive' | 'Prospect' | 'Negative') => void
}) {
  const [selectedStageTab, setSelectedStageTab] = useState<'All' | OpportunityStage>('All')

  return (
    <div className="flex flex-col gap-10">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. RESEARCH SECTION                                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      <ResearchSection
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. OUTREACH SECTION                                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <OutreachSection
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        selectedStageTab={selectedStageTab}
        setSelectedStageTab={setSelectedStageTab}
        onNavigateToOutreachAnalysis={onNavigateToOutreachAnalysis}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. OPPORTUNITIES SECTION                                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      <OpportunitiesSection
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        selectedStageTab={selectedStageTab}
        setSelectedStageTab={setSelectedStageTab}
        onNavigateToOpportunitiesAnalysis={onNavigateToOpportunitiesAnalysis}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. REQUEST FOR PROPOSAL (RFP) SECTION                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      <RfpSection
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        onNavigateToRfpAnalysis={onNavigateToRfpAnalysis}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. RESPONSE SECTION                                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <ResponsesSection
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        datePreset={datePreset}
        setDatePreset={setDatePreset}
        onNavigateToResponsesAnalysis={onNavigateToResponsesAnalysis}
      />
    </div>
  )
}

function OpportunityTable({opportunities,setOpportunities}:{opportunities:any[];setOpportunities:(x:any)=>void}) { const [open,setOpen]=useState(false); return <Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>Opportunity funnel</CardTitle><p className="mt-1 text-sm text-muted-foreground">{opportunities.filter(o=>o.status==='Won').length} won · {opportunities.filter(o=>o.status==='Pending').length} pending</p></div><Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button size="sm"><Plus/>Add opportunity</Button>} /><DialogContent><DialogHeader><DialogTitle>Add opportunity</DialogTitle></DialogHeader><div className="flex flex-col gap-3"><Input placeholder="Account name" id="new-account"/><Input placeholder="Contact person" id="new-contact"/><Button onClick={()=>{const a=(document.getElementById('new-account') as HTMLInputElement).value||'New account';setOpportunities([{id:Date.now(),date:new Date().toISOString().slice(0,10),industry:'Technology',account:a,contact:(document.getElementById('new-contact') as HTMLInputElement).value||'New contact',meeting:'TBD',comments:'New opportunity created in CRM.',status:'Pending'},...opportunities]);setOpen(false);toast.success('Opportunity added')}}>Create opportunity</Button></div></DialogContent></Dialog></CardHeader><CardContent><div className="grid gap-2 md:grid-cols-4">{['Researched','Submitted','Pending','Won'].map(s=><div key={s} className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{s}</div><div className="mt-1 text-2xl font-bold">{opportunities.filter(o=>o.status===s).length}</div></div>)}</div><div className="mt-5"><DataTable title="" rows={opportunities.slice(0,6)} columns={['account','industry','contact','status']}/></div></CardContent></Card> }

function SectionTitle({eyebrow,title,action,onBack}:{eyebrow?:string;title:string;action?:string;onBack?:()=>void}){return <div className="flex flex-wrap items-center justify-between gap-3"><div>{eyebrow&&<div className="text-xs font-bold uppercase tracking-[.18em] text-[#b18400]">{eyebrow}</div>}<h2 className="mt-1 text-2xl font-bold text-[#0B1F5C] dark:text-white">{title}</h2></div><div className="flex items-center gap-2">{onBack&&<Button variant="outline" size="sm" onClick={onBack} className="text-xs">Back to Dashboard</Button>}{action&&<Button variant="outline" size="sm"><Download/> {action}</Button>}</div></div>}
function Kpi({title,value,change,accent}:{title:string;value:any;change:string;accent?:boolean}){return <Card className={accent?'border-l-4 border-l-[#FFC000]':''}><CardContent className="p-5"><div className="text-sm text-muted-foreground">{title}</div><div className="mt-2 text-3xl font-bold text-[#0B1F5C] dark:text-white">{value}</div><div className="mt-2 text-xs text-muted-foreground">{change}</div></CardContent></Card>}
function DataTable({title,rows,columns}:{title:string;rows:any[];columns:string[]}){return <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>{title||'Records'}</CardTitle><Button variant="ghost" size="sm" onClick={()=>downloadCsv('crm-export.csv',rows)}><Download/>CSV</Button></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase text-muted-foreground">{columns.map(c=><th key={c} className="px-2 py-3 font-medium">{c.replace(/([A-Z])/g,' $1')}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={r.id||i} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900">{columns.map(c=><td key={c} className="px-2 py-3">{c==='value'&&typeof r[c]==='number'?money(r[c]):c==='status'||c==='response'?<Badge variant={r[c]==='Won'||r[c]==='Positive'?'default':'secondary'}>{r[c]}</Badge>:c.toLowerCase().includes('date')||c==='added'?formatDate(r[c]):r[c]}</td>)}</tr>)}</tbody></table></div>{!rows.length&&<div className="py-8 text-center text-sm text-muted-foreground">No records match the current filters.</div>}</CardContent></Card>}
function Field({label,value}:{label:string;value:string}){return <label className="text-sm font-medium">{label}<Input defaultValue={value} className="mt-1"/></label>}

function BusinessPlans({onBackToDashboard}:{onBackToDashboard?:()=>void}){
  return <div className="min-h-[400px]" />
}
function Activities({support,setSupport,conferences,setConferences,onBackToDashboard}:{support:any[];setSupport:(x:any)=>void;conferences:any[];setConferences:(x:any)=>void;onBackToDashboard?:()=>void}){return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Enablement" title="Account management activities" onBack={onBackToDashboard}/><div className="grid gap-6 lg:grid-cols-2"><Card><CardHeader className="flex-row items-center justify-between"><CardTitle>CRM support</CardTitle><Button size="sm" onClick={()=>{setSupport([{id:Date.now(),date:new Date().toISOString().slice(0,10),location:'Virtual',name:'New support session',website:'www.example.com',industry:'Technology'},...support]);toast.success('Support record added')}}><Plus/>Add</Button></CardHeader><CardContent><DataTable title="" rows={support} columns={['date','location','name','industry']}/></CardContent></Card><Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Conferences</CardTitle><Button size="sm" onClick={()=>{setConferences([{id:Date.now(),date:new Date().toISOString().slice(0,10),status:'Planned',category:'Industry',description:'New conference',actionPlan:'Assign owner'},...conferences]);toast.success('Conference added')}}><Plus/>Add</Button></CardHeader><CardContent><DataTable title="" rows={conferences} columns={['date','status','category','description']}/></CardContent></Card></div></div>}
function Documents({onBackToDashboard}:{onBackToDashboard?:()=>void}){const [target,setTarget]=useState('USA'); return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Content" title="Documents" onBack={onBackToDashboard}/><div className="grid gap-4 md:grid-cols-3"><Card><CardContent className="p-6"><FileText className="mb-5 text-[#FFC000]"/><h3 className="font-semibold">GTM strategy</h3><p className="mt-1 text-sm text-muted-foreground">Editable go-to-market planning grid.</p><Button className="mt-5" onClick={()=>toast.success('GTM spreadsheet downloaded')}><Download/>Download</Button></CardContent></Card><Card><CardContent className="p-6"><Mail className="mb-5 text-[#FFC000]"/><h3 className="font-semibold">Email drafts</h3><Select value={target} onValueChange={setTarget}><SelectTrigger className="mt-4"><SelectValue/></SelectTrigger><SelectContent>{regions.map(x=><SelectItem value={x} key={x}>{x}</SelectItem>)}</SelectContent></Select><div className="mt-4 rounded border bg-slate-50 p-3 text-xs whitespace-pre-line dark:bg-slate-900">{emailDraft(target)}</div><Button variant="outline" className="mt-3" onClick={()=>toast.success('Draft copied')}>Copy draft</Button></CardContent></Card><Card><CardContent className="p-6"><Presentation className="mb-5 text-[#FFC000]"/><h3 className="font-semibold">Proposals</h3><p className="mt-1 text-sm text-muted-foreground">Manage proposal documents and outcomes.</p><Button className="mt-5" onClick={()=>toast.success('Navigate to Proposals from sidebar')}>Open proposals</Button></CardContent></Card></div><Card><CardHeader><CardTitle>GTM spreadsheet</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm">{gtmRows.map((row,i)=><tr key={i} className={i===0?'bg-[#0B1F5C] text-white':''}>{row.map((cell,j)=><td key={j} className="border p-3">{i===0?cell:<Input defaultValue={cell} className="border-0 bg-transparent"/>}</td>)}</tr>)}</table></div></CardContent></Card></div>}
function Proposals({onBackToDashboard}:{onBackToDashboard?:()=>void}){const data=proposals.map(p=>({name:p.name,value:p.status==='Won'?1:0})); return <div className="flex flex-col gap-6"><SectionTitle eyebrow="RFPs" title="Proposals" action="Download register" onBack={onBackToDashboard}/><div className="grid gap-4 md:grid-cols-4"><Kpi title="RFPs researched" value={proposals.filter(p=>p.researched).length} change="From proposal register"/><Kpi title="Selected for work" value={proposals.filter(p=>p.selected).length} change="Prioritized RFPs"/><Kpi title="Submitted" value={proposals.length} change="Active register"/><Kpi title="Win rate" value={`${Math.round(proposals.filter(p=>p.status==='Won').length/proposals.length*100)}%`} change="Won / total"/></div><Card><CardContent className="grid items-center gap-6 p-6 md:grid-cols-[260px_1fr]"><div className="h-56"><ResponsiveContainer><PieChart><Pie data={[{name:'Won',value:proposals.filter(p=>p.status==='Won').length},{name:'Pending',value:proposals.filter(p=>p.status==='Pending').length},{name:'Lost',value:proposals.filter(p=>p.status==='Lost').length}]} dataKey="value" innerRadius={60} outerRadius={90}>{[0,1,2].map(i=><Cell key={i} fill={colors[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div><div className="mb-4 rounded-lg border-2 border-dashed p-6 text-center"><Download className="mx-auto text-muted-foreground"/><p className="mt-2 text-sm font-medium">Drag and drop proposals here</p><Button variant="outline" className="mt-3" onClick={()=>toast.success('Mock upload complete')}>Choose files</Button></div><DataTable title="Proposal register" rows={proposals} columns={['name','date','status']}/></div></CardContent></Card></div>}
function Creative({onBackToDashboard}:{onBackToDashboard?:()=>void}){return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Studio" title="Creative support" onBack={onBackToDashboard}/><Tabs defaultValue="Instagram"><TabsList>{['Instagram','LinkedIn','Proposal Management'].map(x=><TabsTrigger key={x} value={x}>{x}</TabsTrigger>)}</TabsList>{['Instagram','LinkedIn','Proposal Management'].map(tab=><TabsContent key={tab} value={tab}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{creativePlaceholders.map((x,i)=><Card key={x.id}><div className="aspect-video bg-gradient-to-br from-[#0B1F5C] via-[#39549a] to-[#B6E4A0]"/><CardContent className="p-4"><Badge variant="secondary">{tab==='Proposal Management'?'Template':x.type}</Badge><div className="mt-2 text-sm font-medium">{tab} · {x.title}</div><Button variant="ghost" size="sm" className="mt-2" onClick={()=>toast.success('Creative item opened')}>View</Button></CardContent></Card>)}</div></TabsContent>)}</Tabs></div>}
function Ratios({leads,wins,onBackToDashboard}:{leads:any[];wins:any[];onBackToDashboard?:()=>void}){const data=industries.map(industry=>({industry,opening:leads.filter(l=>l.industry===industry&&l.channel==='Email').length?Math.round(leads.filter(l=>l.industry===industry&&l.channel==='Email'&&l.response==='Positive').length/leads.filter(l=>l.industry===industry&&l.channel==='Email').length*100):0,meeting:Math.round(leads.filter(l=>l.industry===industry&&l.response==='Positive').length/Math.max(1,leads.filter(l=>l.industry===industry).length)*100),win:wins.filter(w=>w.industry===industry).length})); return <div className="flex flex-col gap-6"><SectionTitle eyebrow="Analytics" title="Ratios" onBack={onBackToDashboard}/><div className="grid gap-6 lg:grid-cols-3">{[['Email opening ratio','opening'],['Meeting ratio','meeting'],['Business win ratio','win']].map(([title,key])=><Card key={key}><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={240}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="industry" tick={{fontSize:9}} angle={-35} textAnchor="end" height={60}/><YAxis/><Tooltip/><Line type="monotone" dataKey={key} stroke="#0B1F5C" strokeWidth={3}/></LineChart></ResponsiveContainer></CardContent></Card>)}</div><DataTable title="Ratio detail by industry" rows={data} columns={['industry','opening','meeting','win']}/></div>}
