'use client'

import React, { useState, useMemo } from 'react'
import {
  Building2, Users, Layers, Globe,
  Download, Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { industries, regions, type Industry, type Region, downloadCsv, money } from '@/lib/data'
import {
  initialResearchData,
  type ResearchedCompany
} from '@/lib/research-data'

export interface ResearchSectionProps {
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
}

export function ResearchSection({
  selectedIndustry = 'All',
  selectedRegion = 'All',
  startDate = '',
  endDate = ''
}: ResearchSectionProps) {
  const [researchList, setResearchList] = useState<ResearchedCompany[]>(initialResearchData)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // New research form state
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newIndustry, setNewIndustry] = useState<Industry>('Banking')
  const [newRegion, setNewRegion] = useState<Region>('USA')
  const [newCity, setNewCity] = useState('')
  const [newRevenue, setNewRevenue] = useState('$500M')
  const [newEmployees, setNewEmployees] = useState('1500')
  const [newResearchedBy, setNewResearchedBy] = useState('Sarah Chen')
  const [newOpportunityScore, setNewOpportunityScore] = useState('85')
  const [newStatus, setNewStatus] = useState<ResearchedCompany['status']>('High Priority')
  const [newNotes, setNewNotes] = useState('')

  // Filtered dataset reacting to top-level Slicers (Industry, Region, Date Range)
  const filteredCompanies = useMemo(() => {
    return researchList.filter(comp => {
      if (selectedIndustry !== 'All' && comp.industry !== selectedIndustry) return false
      if (selectedRegion !== 'All' && comp.region !== selectedRegion) return false
      if (startDate && comp.researchDate < startDate) return false
      if (endDate && comp.researchDate > endDate) return false
      return true
    })
  }, [researchList, selectedIndustry, selectedRegion, startDate, endDate])

  // ─────────────────────────────────────────────────────────────
  // 4 MANDATORY CARDS FOR RESEARCH:
  // 1. COMPANIES RESEARCHED
  // 2. CONTACTS RESEARCHED
  // 3. UNIQUE INDUSTRIES RESEARCHED
  // 4. UNIQUE REGIONS RESEARCHED
  // ─────────────────────────────────────────────────────────────

  // 1. Companies Researched count
  const companiesResearchedCount = useMemo(() => {
    return filteredCompanies.length
  }, [filteredCompanies])

  // 2. Contacts Researched total across filtered companies
  const contactsResearchedCount = useMemo(() => {
    return filteredCompanies.reduce((acc, comp) => acc + (comp.contactsCount ?? (comp.contractsCount ? comp.contractsCount * 2 + 1 : 4)), 0)
  }, [filteredCompanies])

  const totalContractPipelineValue = useMemo(() => {
    return filteredCompanies.reduce((acc, comp) => acc + (comp.totalContractValue || 0), 0)
  }, [filteredCompanies])

  // 3. Unique Industries Researched
  const uniqueIndustriesResearched = useMemo(() => {
    const set = new Set<string>()
    filteredCompanies.forEach(c => set.add(c.industry))
    return set
  }, [filteredCompanies])

  // 4. Unique Regions Researched
  const uniqueRegionsResearched = useMemo(() => {
    const set = new Set<string>()
    filteredCompanies.forEach(c => set.add(c.region))
    return set
  }, [filteredCompanies])

  // CSV Export
  const handleExportCsv = () => {
    const rows = filteredCompanies.map(c => ({
      'Company Name': c.companyName,
      'Industry': c.industry,
      'Region': c.region,
      'City': c.city,
      'Research Date': c.researchDate,
      'Researched By': c.researchedBy,
      'Opportunity Score': c.opportunityScore,
      'Contacts Researched': c.contactsCount ?? (c.contractsCount ? c.contractsCount * 2 + 1 : 4),
      'Total Contract Value': c.totalContractValue,
      'Annual Revenue': c.annualRevenue,
      'Status': c.status,
      'Notes': c.researchNotes
    }))
    downloadCsv('companies-researched.csv', rows)
    toast.success(`Exported ${filteredCompanies.length} researched companies to CSV`)
  }

  // Create Research Target
  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompanyName.trim()) {
      toast.error('Please enter a company name')
      return
    }

    const newCompany: ResearchedCompany = {
      id: `RES-${String(researchList.length + 1).padStart(3, '0')}`,
      companyName: newCompanyName.trim(),
      industry: newIndustry,
      region: newRegion,
      city: newCity.trim() || (newRegion === 'USA' ? 'New York, NY' : newRegion === 'Canada' ? 'Toronto, ON' : 'Riyadh'),
      researchDate: new Date().toISOString().slice(0, 10),
      researchedBy: newResearchedBy,
      annualRevenue: newRevenue,
      employeeCount: parseInt(newEmployees, 10) || 1000,
      opportunityScore: Math.min(100, Math.max(0, parseInt(newOpportunityScore, 10) || 85)),
      status: newStatus,
      website: `www.${newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      contractsCount: 1,
      contactsCount: 4,
      totalContractValue: 750000,
      painPoints: ['Digital transformation acceleration', 'Legacy system decoupling'],
      techStack: ['Cloud Native', 'REST APIs', 'PostgreSQL'],
      executiveContact: {
        name: 'Executive Contact',
        title: 'VP of Technology & Operations',
        email: `contact@${newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
      },
      contracts: [
        {
          id: `CON-NEW-${Date.now()}`,
          title: `${newCompanyName.trim()} Enterprise Modernization Scoping`,
          clientOrAgency: `${newCompanyName.trim()} Procurement`,
          estimatedValue: 750000,
          publishedDate: new Date().toISOString().slice(0, 10),
          submissionDeadline: '2026-11-30',
          status: 'Active',
          scope: 'Pre-RFP discovery and technology audit.'
        }
      ],
      researchNotes: newNotes.trim() || 'New research record captured.'
    }

    setResearchList(prev => [newCompany, ...prev])
    setIsAddModalOpen(false)
    setNewCompanyName('')
    setNewCity('')
    setNewNotes('')
    toast.success(`Researched company "${newCompany.companyName}" added successfully`)
  }

  return (
    <section id="section-research" className="scroll-mt-56 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. SECTION HEADING: 1- RESEARCH                             */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-6.5 items-center justify-center rounded-lg bg-[#0B1F5C] text-xs font-black text-white dark:bg-[#FFC000] dark:text-[#0B1F5C] shadow-2xs">
              1
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
              1- Research
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Market intelligence, target account dossiers, verified enterprise contacts, and sector segmentation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs font-medium gap-1.5 cursor-pointer"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
          <Button
            size="sm"
            className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C]/90 dark:bg-[#FFC000] dark:text-[#0B1F5C] dark:hover:bg-[#FFC000]/90 font-semibold gap-1.5 shadow-xs cursor-pointer text-xs"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="size-4" />
            Add Research Target
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. TOP 4 MANDATORY CARDS (AS EXPLICITLY REQUESTED):         */}
      {/*    - COMPANIES RESEARCHED                                   */}
      {/*    - CONTACTS RESEARCHED                                    */}
      {/*    - UNIQUE INDUSTRIES RESEARCHED                           */}
      {/*    - UNIQUE REGIONS RESEARCHED                              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: COMPANIES RESEARCHED */}
        <div className="group relative rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all duration-200 hover:border-blue-300 hover:bg-white hover:shadow-xs dark:border-slate-800 dark:bg-slate-850 dark:hover:border-blue-700/60 dark:hover:bg-slate-800 border-t-2 border-t-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Companies Researched
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:group-hover:bg-blue-900/60">
              <Building2 className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
            {companiesResearchedCount.toLocaleString()}
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Target enterprise accounts
          </div>
        </div>

        {/* CARD 2: CONTACTS RESEARCHED */}
        <div className="group relative rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all duration-200 hover:border-indigo-300 hover:bg-white hover:shadow-xs dark:border-slate-800 dark:bg-slate-850 dark:hover:border-indigo-700/60 dark:hover:bg-slate-800 border-t-2 border-t-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Contacts Researched
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:group-hover:bg-indigo-900/60">
              <Users className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
            {contactsResearchedCount.toLocaleString()}
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Key decision makers & stakeholders
          </div>
        </div>

        {/* CARD 3: UNIQUE INDUSTRIES RESEARCHED */}
        <div className="group relative rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all duration-200 hover:border-emerald-300 hover:bg-white hover:shadow-xs dark:border-slate-800 dark:bg-slate-850 dark:hover:border-emerald-700/60 dark:hover:bg-slate-800 border-t-2 border-t-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Unique Industries
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:group-hover:bg-emerald-900/60">
              <Layers className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
              {uniqueIndustriesResearched.size}
            </span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              / 8
            </span>
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Target industry sectors
          </div>
        </div>

        {/* CARD 4: UNIQUE REGIONS RESEARCHED */}
        <div className="group relative rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all duration-200 hover:border-amber-300 hover:bg-white hover:shadow-xs dark:border-slate-800 dark:bg-slate-850 dark:hover:border-amber-700/60 dark:hover:bg-slate-800 border-t-2 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Unique Regions
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 dark:group-hover:bg-amber-900/60">
              <Globe className="size-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tracking-tight text-[#0B1F5C] dark:text-white">
              {uniqueRegionsResearched.size}
            </span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              / 3
            </span>
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Active market geographies
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. ADD RESEARCH TARGET MODAL                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
              Add Researched Company Target
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record market intelligence, executive contacts, and potential procurement contracts
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCompany} className="flex flex-col gap-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Company Name *
              </label>
              <Input
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                placeholder="e.g. Sterling Global Energy"
                required
                className="mt-1 h-9 text-xs"
              />
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
                  City / Location
                </label>
                <Input
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  placeholder="e.g. Houston, TX"
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Priority Status
                </label>
                <Select value={newStatus} onValueChange={(v: ResearchedCompany['status']) => setNewStatus(v)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['High Priority', 'In Evaluation', 'Qualified for Outreach', 'Nurturing'].map(st => (
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
                Research Notes & Intelligence Summary
              </label>
              <textarea
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                rows={3}
                placeholder="Key digital initiatives, upcoming tender solicitations, or stakeholder insights..."
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
                Save Research Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
