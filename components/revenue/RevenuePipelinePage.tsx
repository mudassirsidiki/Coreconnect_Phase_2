'use client'

import React, { useState, useMemo } from 'react'
import {
  TrendingUp, DollarSign, Briefcase, Award, ArrowUpRight,
  Calendar, Building2, Globe, Search, Download, ArrowLeft,
  CheckCircle2, Target, Layers, Filter, Sparkles, ChevronRight,
  SlidersHorizontal, BarChart3, PieChart as PieIcon, ArrowUpDown,
  FileText, ShieldCheck, Check
} from 'lucide-react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { toast } from 'sonner'
import {
  type Win,
  type Industry,
  type Region,
  industries,
  regions,
  money,
  formatDate,
  downloadCsv
} from '@/lib/data'

export interface RevenuePipelinePageProps {
  wins: Win[]
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

const REGION_COLORS: Record<string, string> = {
  'USA': '#0B1F5C',
  'Canada': '#FFC000',
  'Saudi Arabia': '#10B981'
}

export function RevenuePipelinePage({
  wins,
  selectedIndustry: globalIndustry = 'All',
  selectedRegion: globalRegion = 'All',
  onBackToDashboard
}: RevenuePipelinePageProps) {
  // Local filter states
  const [localIndustry, setLocalIndustry] = useState<string>(globalIndustry)
  const [localRegion, setLocalRegion] = useState<string>(globalRegion)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<'value-desc' | 'value-asc' | 'date-desc' | 'date-asc'>('value-desc')

  // Selected deal for slide-out inspection drawer
  const [selectedDeal, setSelectedDeal] = useState<Win | null>(null)

  // Filtered wins
  const filteredWins = useMemo(() => {
    return wins.filter(w => {
      const matchInd = localIndustry === 'All' || w.industry === localIndustry
      const matchReg = localRegion === 'All' || w.region === localRegion
      const matchSearch =
        searchQuery === '' ||
        w.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.project.toLowerCase().includes(searchQuery.toLowerCase())

      return matchInd && matchReg && matchSearch
    }).sort((a, b) => {
      if (sortBy === 'value-desc') return b.value - a.value
      if (sortBy === 'value-asc') return a.value - b.value
      if (sortBy === 'date-desc') return new Date(b.dateWon).getTime() - new Date(a.dateWon).getTime()
      return new Date(a.dateWon).getTime() - new Date(b.dateWon).getTime()
    })
  }, [wins, localIndustry, localRegion, searchQuery, sortBy])

  // Key KPI metrics calculations
  const stats = useMemo(() => {
    const total = filteredWins.reduce((sum, w) => sum + w.value, 0)
    const count = filteredWins.length
    const avg = count ? total / count : 0
    const max = filteredWins.length ? Math.max(...filteredWins.map(w => w.value)) : 0

    // Top territory
    const regSums = regions.map(reg => ({
      reg,
      total: filteredWins.filter(w => w.region === reg).reduce((s, w) => s + w.value, 0)
    })).sort((a, b) => b.total - a.total)

    // Top industry
    const indSums = industries.map(ind => ({
      ind,
      total: filteredWins.filter(w => w.industry === ind).reduce((s, w) => s + w.value, 0)
    })).sort((a, b) => b.total - a.total)

    return {
      total,
      count,
      avg,
      max,
      topRegion: regSums[0]?.total ? regSums[0] : null,
      topIndustry: indSums[0]?.total ? indSums[0] : null
    }
  }, [filteredWins])

  // Chart 1: Cumulative Trajectory
  const trajectoryData = useMemo(() => {
    const sorted = [...filteredWins].sort((a, b) => new Date(a.dateWon).getTime() - new Date(b.dateWon).getTime())
    let runningTotal = 0
    return sorted.map(w => {
      runningTotal += w.value
      return {
        date: formatDate(w.dateWon),
        value: w.value,
        cumulative: runningTotal,
        account: w.account,
        industry: w.industry
      }
    })
  }, [filteredWins])

  // Chart 2: Revenue By Industry
  const industryChartData = useMemo(() => {
    return industries.map(ind => {
      const indWins = filteredWins.filter(w => w.industry === ind)
      const value = indWins.reduce((sum, w) => sum + w.value, 0)
      return {
        industry: ind,
        value,
        deals: indWins.length
      }
    }).filter(x => x.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [filteredWins])

  // Chart 3: Regional Distribution
  const regionChartData = useMemo(() => {
    return regions.map(reg => {
      const regWins = filteredWins.filter(w => w.region === reg)
      const value = regWins.reduce((sum, w) => sum + w.value, 0)
      return {
        name: reg,
        value,
        deals: regWins.length
      }
    }).filter(x => x.value > 0)
  }, [filteredWins])

  // CSV Export
  const handleExportCsv = () => {
    const rows = filteredWins.map(w => ({
      'Account': w.account,
      'Lead': w.lead,
      'Value': w.value,
      'Formatted Value': money(w.value),
      'Meeting Date': w.meetingDate,
      'Date Won': w.dateWon,
      'Region': w.region,
      'Industry': w.industry,
      'Project': w.project
    }))
    downloadCsv('revenue-pipeline-sales.csv', rows)
    toast.success(`Exported ${filteredWins.length} closed win records to CSV`)
  }

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER WITH BREADCRUMB & DASHBOARD ACTIONS          */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToDashboard}
                className="gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="size-3.5" />
                Back to Dashboard
              </Button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex size-6 items-center justify-center rounded-md bg-[#0B1F5C] text-xs font-black text-white dark:bg-[#FFC000] dark:text-[#0B1F5C]">
                  $
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#0B1F5C] dark:text-white">
                  Revenue Pipeline & Sales
                </h1>
                <Badge className="bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700">
                  Closed Won Deals
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Executive revenue analytics, deal velocity telemetry, and verified commercial wins across enterprise accounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="gap-1.5 text-xs font-semibold"
            >
              <Download className="size-3.5" />
              Export Register CSV
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. EXECUTIVE REVENUE KPI CARDS                              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: TOTAL WON VALUE */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Won Revenue
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <DollarSign className="size-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
            {money(stats.total)}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs dark:border-slate-800">
            <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="size-3.5 mr-0.5" />
              +28.4% YoY Growth
            </span>
            <span className="text-muted-foreground">{stats.count} Closed Contracts</span>
          </div>
        </div>

        {/* KPI 2: AVERAGE DEAL SIZE */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 border-l-4 border-l-[#0B1F5C] dark:border-l-[#FFC000]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Average Deal Size
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-[#0B1F5C] dark:bg-slate-800 dark:text-[#FFC000]">
              <TrendingUp className="size-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
            {money(stats.avg)}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Max: {money(stats.max)}
            </span>
            <span className="text-muted-foreground">Enterprise Tier</span>
          </div>
        </div>

        {/* KPI 3: CLOSED WON DEALS */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 border-l-4 border-l-[#FFC000]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Closed Won Deals
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Briefcase className="size-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-extrabold text-[#0B1F5C] dark:text-white">
            {stats.count} <span className="text-lg font-semibold text-muted-foreground">Won</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs dark:border-slate-800">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              100% Contract Execution
            </span>
            <span className="text-muted-foreground">8 Sectors</span>
          </div>
        </div>

        {/* KPI 4: TOP PERFORMING TERRITORY */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Leading Territory
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Globe className="size-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#0B1F5C] dark:text-white truncate">
            {stats.topRegion ? `${stats.topRegion.reg}` : 'Global'}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs dark:border-slate-800">
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {stats.topRegion ? money(stats.topRegion.total) : '$0'}
            </span>
            <span className="text-muted-foreground">
              {stats.total > 0 && stats.topRegion ? `${Math.round((stats.topRegion.total / stats.total) * 100)}% Share` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. INSIGHTFUL CHARTS & GRAPHS SECTION                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* CHART 1: CUMULATIVE REVENUE GROWTH TRAJECTORY (AREA CHART) */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-xs dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white flex items-center gap-2">
                <BarChart3 className="size-4 text-[#FFC000]" />
                Cumulative Revenue Trajectory
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Progression of closed enterprise contracts value over time ($ USD)
              </p>
            </div>
            <Badge variant="outline" className="text-[11px] font-semibold border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300">
              Target Surpassed
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B1F5C" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0B1F5C" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                    angle={-20}
                    textAnchor="end"
                    height={40}
                  />
                  <YAxis
                    tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 10 }}
                    stroke="#94a3b8"
                  />
                  <Tooltip
                    formatter={(v: any, name: any) => [
                      money(v),
                      name === 'cumulative' ? 'Cumulative Revenue' : 'Deal Value'
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    name="cumulative"
                    stroke="#0B1F5C"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
              <span>Start: {trajectoryData[0]?.date || '—'}</span>
              <span className="font-bold text-[#0B1F5C] dark:text-white">
                Total Closed: {money(stats.total)}
              </span>
              <span>Latest: {trajectoryData[trajectoryData.length - 1]?.date || '—'}</span>
            </div>
          </CardContent>
        </Card>

        {/* CHART 2: REGIONAL REVENUE SHARE (DONUT CHART) */}
        <Card className="border-slate-200/80 shadow-xs dark:border-slate-800">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white flex items-center gap-2">
              <PieIcon className="size-4 text-emerald-500" />
              Revenue by Territory
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Geographic contribution across 3 operating regions
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {regionChartData.map(entry => (
                      <Cell
                        key={entry.name}
                        fill={REGION_COLORS[entry.name] || '#94a3b8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [money(val), 'Revenue Won']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Region Breakdown Legend */}
            <div className="mt-3 space-y-2 border-t pt-3">
              {regionChartData.map(r => (
                <div key={r.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: REGION_COLORS[r.name] || '#94a3b8' }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{r.name}</span>
                    <span className="text-[10px] text-muted-foreground">({r.deals} deals)</span>
                  </div>
                  <div className="font-bold text-[#0B1F5C] dark:text-white">
                    {money(r.value)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHART 3: REVENUE WON BY INDUSTRY BAR CHART */}
      <Card className="border-slate-200/80 shadow-xs dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white flex items-center gap-2">
              <Building2 className="size-4 text-[#0B1F5C] dark:text-[#FFC000]" />
              Revenue Won by Industry Sector
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comparative contract value across enterprise vertical markets
            </p>
          </div>
          <Badge variant="secondary" className="text-xs font-semibold">
            {industryChartData.length} Target Sectors Won
          </Badge>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryChartData} margin={{ top: 10, right: 20, left: 10, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="industry"
                  tick={{ fontSize: 10 }}
                  stroke="#94a3b8"
                  angle={-25}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 10 }}
                  stroke="#94a3b8"
                />
                <Tooltip
                  formatter={(val: any, _, item: any) => [
                    `${money(val)} (${item.payload.deals} deals)`,
                    'Revenue Won'
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#FFC000"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. ENHANCED DATA TABLE: BUSINESS WINS REGISTER              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Table Toolbar & Slicers */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setLocalRegion('All')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                localRegion === 'All'
                  ? 'bg-white text-[#0B1F5C] shadow-xs dark:bg-slate-900 dark:text-[#FFC000]'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              All Regions ({wins.length})
            </button>
            {regions.map(reg => {
              const count = wins.filter(w => w.region === reg).length
              return (
                <button
                  key={reg}
                  onClick={() => setLocalRegion(reg)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    localRegion === reg
                      ? 'bg-white text-[#0B1F5C] shadow-xs dark:bg-slate-900 dark:text-[#FFC000]'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {reg} ({count})
                </button>
              )
            })}
          </div>

          {/* Slicers & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Industry Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Industry:</span>
              <Select value={localIndustry} onValueChange={setLocalIndustry}>
                <SelectTrigger className="h-8.5 w-40 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="font-semibold text-xs">All Industries (8)</SelectItem>
                  {industries.map(ind => (
                    <SelectItem key={ind} value={ind} className="text-xs">{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500">Sort:</span>
              <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                <SelectTrigger className="h-8.5 w-36 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value-desc" className="text-xs">Value: High to Low</SelectItem>
                  <SelectItem value="value-asc" className="text-xs">Value: Low to High</SelectItem>
                  <SelectItem value="date-desc" className="text-xs">Date: Newest First</SelectItem>
                  <SelectItem value="date-asc" className="text-xs">Date: Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
              <Input
                placeholder="Search account, lead, project..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8.5 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Table Register */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground dark:border-slate-800 dark:bg-slate-950/60">
                <th className="px-4 py-3.5 whitespace-nowrap">Account</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Lead</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Value</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Meeting Date</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Date Won</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Region</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Industry</th>
                <th className="px-4 py-3.5 text-right whitespace-nowrap">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredWins.map(win => (
                <tr
                  key={win.id}
                  onClick={() => setSelectedDeal(win)}
                  className="group transition hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                >
                  {/* 1. Account */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-7 shrink-0 place-items-center rounded-md bg-[#0B1F5C]/10 text-xs font-bold text-[#0B1F5C] dark:bg-white/10 dark:text-[#FFC000]">
                        {win.account.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {win.account}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-normal">
                          {win.project}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. Lead */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {win.lead.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {win.lead}
                      </span>
                    </div>
                  </td>

                  {/* 3. Value */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-emerald-700 dark:text-emerald-400">
                        {money(win.value)}
                      </span>
                      {win.value >= 100000 && (
                        <Badge variant="outline" className="text-[9px] font-bold border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Tier 1
                        </Badge>
                      )}
                    </div>
                  </td>

                  {/* 4. Meeting Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-slate-400" />
                      <span>{formatDate(win.meetingDate)}</span>
                    </div>
                  </td>

                  {/* 5. Date Won */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="size-2.5 stroke-[3]" />
                        {formatDate(win.dateWon)}
                      </span>
                    </div>
                  </td>

                  {/* 6. Region */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium border bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                      <Globe className="size-3 text-slate-400" />
                      {win.region}
                    </span>
                  </td>

                  {/* 7. Industry */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {win.industry}
                    </span>
                  </td>

                  {/* 8. Details Action */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedDeal(win)
                      }}
                    >
                      Inspect <ChevronRight className="size-3 ml-0.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredWins.length === 0 && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No closed wins match the current filter criteria.
            </div>
          )}
        </div>

        {/* Table Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredWins.length}</span> of {wins.length} recorded business wins
            <span className="ml-2 font-medium text-slate-500">
              (Filtered Value: {money(stats.total)})
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs gap-1.5"
          >
            <Download className="size-3" /> Export Filtered CSV
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. DEAL INSPECTION DRAWER                                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Sheet open={!!selectedDeal} onOpenChange={open => !open && setSelectedDeal(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Award className="size-4.5" />
              </div>
              <SheetTitle className="text-lg font-bold text-[#0B1F5C] dark:text-white">
                Closed Deal Dossier
              </SheetTitle>
            </div>
            <SheetDescription className="text-xs">
              Contract execution record and engagement telemetry.
            </SheetDescription>
          </SheetHeader>

          {selectedDeal && (
            <div className="mt-5 space-y-4 text-xs">
              {/* Account summary banner */}
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {selectedDeal.industry} · {selectedDeal.region}
                </div>
                <div className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                  {selectedDeal.account}
                </div>
                <div className="mt-1 font-semibold text-emerald-700 dark:text-emerald-300 text-sm">
                  Contract Value: {money(selectedDeal.value)}
                </div>
              </div>

              {/* Deal Data Grid */}
              <div className="space-y-2">
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Deal Executive / Lead:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedDeal.lead}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Strategic Initiative:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedDeal.project}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">First Discovery Meeting:</span>
                  <span>{formatDate(selectedDeal.meetingDate)}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Contract Close Date:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatDate(selectedDeal.dateWon)}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Operating Region:</span>
                  <span>{selectedDeal.region}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span className="text-muted-foreground">Target Industry:</span>
                  <span>{selectedDeal.industry}</span>
                </div>
              </div>

              {/* Milestones Card */}
              <div className="rounded-lg border p-3.5 bg-slate-50 dark:bg-slate-900 space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Contract Execution Milestones
                </div>
                <div className="space-y-1.5 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span>Discovery & Scope validation completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span>Commercial terms and SOW executed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <span>Billing schedule verified & recorded in ERP</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 text-xs font-semibold bg-[#0B1F5C] text-white hover:bg-[#07153d]"
                  onClick={() => {
                    toast.success(`Exported deal statement for ${selectedDeal.account}`)
                    setSelectedDeal(null)
                  }}
                >
                  <Download className="size-3.5 mr-1" />
                  Download Deal Sheet
                </Button>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => setSelectedDeal(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
