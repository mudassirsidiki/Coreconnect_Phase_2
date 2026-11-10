'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { GtmStrategyFormData, PriorityValue, ValidationErrors } from '@/lib/gtm-types'
import { GTM_CONFIG } from '@/lib/gtm-config'
import { SectionCard } from './SectionCard'
import { PriorityPicker } from './PriorityPicker'
import { RepeatableRows } from './RepeatableRows'
import { ChipInput } from './ChipInput'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Save,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building,
  User,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Check,
  Globe,
  Sliders,
  Users,
  Target,
  Briefcase,
  Phone,
  Clock,
  Layers
} from 'lucide-react'

interface GtmWizardFormProps {
  initialData: GtmStrategyFormData
  onComplete: (data: GtmStrategyFormData) => void
}

const WIZARD_STEPS = [
  { id: 1, title: 'Offer & Geo', subtitle: 'Products & Locations', sections: [1, 2] },
  { id: 2, title: 'Target Market', subtitle: 'Industry, Size & Persona', sections: [3, 4, 5] },
  { id: 3, title: 'Accounts & Outreach', subtitle: 'Target Accounts & Channels', sections: [6, 7, 8] },
  { id: 4, title: 'Operations & Setup', subtitle: 'CRM, Cadence & Contact', sections: [9, 10, 11, 12, 13] }
]

export function GtmWizardForm({ initialData, onComplete }: GtmWizardFormProps) {
  const [formData, setFormData] = useState<GtmStrategyFormData>(initialData)
  const [currentStep, setCurrentStep] = useState(1)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [activeTabSection, setActiveTabSection] = useState<number>(1)

  // Auto-save debounced effect
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('coreconnect_gtm_draft', JSON.stringify(formData))
        const now = new Date()
        setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      } catch (err) {
        console.error('Failed to auto-save GTM draft to localStorage', err)
      }
    }, 1200)

    return () => clearTimeout(timer)
  }, [formData])

  // Manual save draft handler
  const handleSaveDraft = () => {
    try {
      localStorage.setItem('coreconnect_gtm_draft', JSON.stringify(formData))
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setLastSaved(timeStr)
      toast.success('Draft saved successfully', {
        description: `Saved locally at ${timeStr}`
      })
    } catch {
      toast.error('Could not save draft to local storage.')
    }
  }

  // Reset to initial config
  const handleReset = () => {
    if (confirm('Reset questionnaire to default values? Any unsaved edits will be lost.')) {
      setFormData(initialData)
      setErrors({})
      toast.info('Form reset to default values')
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PRIORITY COLLISION DETECTIONS
  // ─────────────────────────────────────────────────────────────
  // Check duplicates in Section 2 (Geo)
  const geoPriorityConflicts = useMemo(() => {
    const counts: Record<number, number> = {}
    formData.geography.regions.forEach((r) => {
      if (r.priority != null) counts[r.priority] = (counts[r.priority] || 0) + 1
    })
    return counts
  }, [formData.geography.regions])

  // Check duplicates in Section 3 (Industry)
  const industryPriorityConflicts = useMemo(() => {
    const counts: Record<number, number> = {}
    const p1 = formData.industry.subContractors.selected ? formData.industry.subContractors.priority : null
    const p2 = formData.industry.generalContractors.selected ? formData.industry.generalContractors.priority : null
    const p3 = formData.industry.otherIndustry.selected ? formData.industry.otherIndustry.priority : null

    if (p1 != null) counts[p1] = (counts[p1] || 0) + 1
    if (p2 != null) counts[p2] = (counts[p2] || 0) + 1
    if (p3 != null) counts[p3] = (counts[p3] || 0) + 1
    return counts
  }, [formData.industry])

  // Check duplicates in Section 4 (Company Size)
  const sizePriorityConflicts = useMemo(() => {
    const counts: Record<number, number> = {}
    formData.companySize.options.forEach((o) => {
      if (o.selected && o.priority != null) counts[o.priority] = (counts[o.priority] || 0) + 1
    })
    return counts
  }, [formData.companySize.options])

  // ─────────────────────────────────────────────────────────────
  // VALIDATION & SUBMISSION
  // ─────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Required Company Name
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company Name is required to generate strategy'
    }

    // Email format (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address'
    }

    // Check duplicate priorities in Geo
    const hasGeoDuplicate = Object.values(geoPriorityConflicts).some((count) => count > 1)
    if (hasGeoDuplicate) {
      newErrors.geoPriorityDuplicate = 'Each selected region must have a unique priority (no duplicate ranks).'
    }

    // Check duplicate priorities in Industry
    const hasIndustryDuplicate = Object.values(industryPriorityConflicts).some((count) => count > 1)
    if (hasIndustryDuplicate) {
      newErrors.industryPriorityDuplicate = 'Each selected target industry group must have a unique priority.'
    }

    // Check duplicate priorities in Size
    const hasSizeDuplicate = Object.values(sizePriorityConflicts).some((count) => count > 1)
    if (hasSizeDuplicate) {
      newErrors.sizePriorityDuplicate = 'Each selected company size tier must have a unique priority.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGenerateStrategy = () => {
    if (!validate()) {
      toast.error('Please resolve the highlighted errors before generating strategy', {
        description: errors.companyName || 'Check required fields and priority conflicts.'
      })
      // If error is in header, bring user to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    onComplete({ ...formData, isCompleted: true })
    toast.success('GTM Strategy Generated!', {
      description: 'Your completed ICP & Go-To-Market blueprint is ready.'
    })
  }

  // Calculate overall completion percentage
  const completionPercentage = useMemo(() => {
    let filled = 0
    let total = 8

    if (formData.companyName.trim()) filled++
    if (formData.products.selectedProducts.length > 0) filled++
    if (formData.geography.regions.length > 0) filled++
    if (formData.industry.subContractors.selected || formData.industry.generalContractors.selected) filled++
    if (formData.companySize.options.some((o) => o.selected)) filled++
    if (formData.jobTitles.selectedTitles.length > 0) filled++
    if (formData.focusedAccounts.accounts.length > 0 || formData.focusedAccounts.decideLater) filled++
    if (formData.outreach.email.enabled || formData.outreach.linkedIn.enabled || formData.outreach.calls.enabled) filled++

    return Math.round((filled / total) * 100)
  }, [formData])

  return (
    <div className="flex flex-col gap-6">
      {/* ─────────────────────────────────────────────────────────────
          TOP CONTROL BAR & HEADER FIELDS
      ───────────────────────────────────────────────────────────── */}
      <Card className="border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#0B1F5C] text-white hover:bg-[#0B1F5C] dark:bg-blue-600">
                  Questionnaire
                </Badge>
                {lastSaved && (
                  <span className="text-xs text-slate-400">
                    Auto-saved at {lastSaved}
                  </span>
                )}
              </div>
              <h2 className="mt-1.5 text-xl font-bold tracking-tight text-[#0B1F5C] dark:text-white sm:text-2xl">
                Ideal Customer Profile & Go-To-Market Strategy
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Complete this questionnaire to build your tailored revenue outreach roadmap and internal ICP spreadsheet.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                className="gap-1.5 text-xs text-[#0B1F5C] hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
              >
                <Save className="size-3.5" />
                Save draft
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleGenerateStrategy}
                className="gap-1.5 bg-[#FFC000] text-xs font-bold text-[#0B1F5C] hover:bg-[#e6ad00] shadow-xs"
              >
                <Sparkles className="size-3.5" />
                Generate Strategy
              </Button>
            </div>
          </div>

          {/* Header Metadata Inputs */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Building className="size-3.5 text-[#0B1F5C] dark:text-blue-400" />
                Company Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.companyName}
                onChange={(e) => {
                  setFormData({ ...formData, companyName: e.target.value })
                  if (errors.companyName) setErrors({ ...errors, companyName: undefined })
                }}
                placeholder="e.g., Pinnacle BIM Solutions"
                className={`mt-1.5 h-9 text-xs ${errors.companyName ? 'border-red-500 focus-visible:ring-red-400' : ''}`}
              />
              {errors.companyName && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="size-3.5 text-[#0B1F5C] dark:text-blue-400" />
                Contact Person
              </label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g., Alex Miller"
                className="mt-1.5 h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Mail className="size-3.5 text-[#0B1F5C] dark:text-blue-400" />
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (errors.email) setErrors({ ...errors, email: undefined })
                }}
                placeholder="alex@pinnacle.com"
                className={`mt-1.5 h-9 text-xs ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Calendar className="size-3.5 text-[#0B1F5C] dark:text-blue-400" />
                Strategy Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1.5 h-9 text-xs"
              />
            </div>
          </div>

          {/* Progress Bar & Step Navigation */}
          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Form Completion: {completionPercentage}%
              </span>
              <span>Step {currentStep} of {WIZARD_STEPS.length}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-[#0B1F5C] via-blue-600 to-[#FFC000] transition-all duration-300"
                style={{ width: `${Math.max(10, completionPercentage)}%` }}
              />
            </div>

            {/* Stepper Tabs */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {WIZARD_STEPS.map((step) => {
                const isActive = currentStep === step.id
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col rounded-lg p-2.5 text-left transition ${
                      isActive
                        ? 'border-2 border-[#0B1F5C] bg-blue-50/50 shadow-xs dark:border-blue-500 dark:bg-blue-950/40'
                        : 'border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-[#0B1F5C] dark:text-blue-300' : 'text-slate-400'}`}>
                        Part {step.id}
                      </span>
                      {isActive && <span className="size-2 rounded-full bg-[#FFC000]" />}
                    </div>
                    <span className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {step.title}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {step.subtitle}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          STEP 1: PRODUCTS / SERVICES & GEOGRAPHY (Sections 1 & 2)
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-6">
          {/* SECTION 1: PRODUCTS / SERVICES */}
          <SectionCard
            sectionNumber={1}
            title="Products / Services"
            subtitle="Select the primary solutions you want to position in this campaign."
            badge="Offering Definition"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select core capabilities:
                </span>
                <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                  {GTM_CONFIG.products.prefilledList.map((product) => {
                    const isChecked = formData.products.selectedProducts.includes(product)
                    return (
                      <label
                        key={product}
                        className={`flex items-center gap-2.5 rounded-lg border p-3 text-xs font-medium cursor-pointer transition ${
                          isChecked
                            ? 'border-blue-300 bg-blue-50/60 text-[#0B1F5C] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200'
                            : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const newSelected = e.target.checked
                              ? [...formData.products.selectedProducts, product]
                              : formData.products.selectedProducts.filter((p) => p !== product)
                            setFormData({
                              ...formData,
                              products: { ...formData.products, selectedProducts: newSelected }
                            })
                          }}
                          className="size-4 rounded text-[#0B1F5C] focus:ring-blue-500"
                        />
                        <span>{product}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Other (specify) */}
              <div className="flex flex-col gap-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Other (specify custom offering):
                </label>
                <Input
                  value={formData.products.otherProduct}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      products: { ...formData.products, otherProduct: e.target.value }
                    })
                  }
                  placeholder="e.g., Laser Scanning & As-Built Verification"
                  className="max-w-md h-9 text-xs"
                />
              </div>

              {/* Collaterals Available */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Collaterals Available?
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Do you have case studies, brochures, model samples, or slide decks ready?
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          products: { ...formData.products, hasCollaterals: true }
                        })
                      }
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                        formData.products.hasCollaterals
                          ? 'bg-[#0B1F5C] text-white'
                          : 'border bg-white text-slate-600 dark:bg-slate-800'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          products: { ...formData.products, hasCollaterals: false }
                        })
                      }
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                        !formData.products.hasCollaterals
                          ? 'bg-[#0B1F5C] text-white'
                          : 'border bg-white text-slate-600 dark:bg-slate-800'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {formData.products.hasCollaterals && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Specify available collaterals, cloud link, or upload notes:
                    </label>
                    <Textarea
                      value={formData.products.collateralsDetails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          products: { ...formData.products, collateralsDetails: e.target.value }
                        })
                      }
                      placeholder="e.g., Capability statement PDF, Google Drive link to sample Revit RVT files, past project portfolio."
                      className="mt-1 text-xs min-h-[60px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* SECTION 2: GEOGRAPHICAL LOCATIONS */}
          <SectionCard
            sectionNumber={2}
            title="Geographical Locations"
            subtitle="Choose your target operating countries and regions. Assign unique priorities (1–5) to each."
            badge="Market Territory"
          >
            <div className="flex flex-col gap-5">
              {/* Country Dropdown */}
              <div className="max-w-xs">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Country
                </label>
                <select
                  value={formData.geography.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      geography: { ...formData.geography, country: e.target.value }
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-input bg-transparent px-3 text-xs outline-none focus:ring-2 focus:ring-[#0B1F5C] dark:bg-slate-900"
                >
                  {GTM_CONFIG.geography.countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {errors.geoPriorityDuplicate && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  <AlertCircle className="size-4 shrink-0 text-amber-600" />
                  <span>{errors.geoPriorityDuplicate}</span>
                </div>
              )}

              {/* Regions Table / Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Regions & Priority Ranks:
                </span>
                <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                  {formData.geography.regions.map((region) => {
                    const hasConflict = region.priority != null && (geoPriorityConflicts[region.priority] || 0) > 1
                    return (
                      <div
                        key={region.id}
                        className="flex flex-wrap items-center justify-between gap-3 p-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => {
                              // Remove region
                              setFormData({
                                ...formData,
                                geography: {
                                  ...formData.geography,
                                  regions: formData.geography.regions.filter((r) => r.id !== region.id)
                                }
                              })
                            }}
                            className="size-4 rounded text-[#0B1F5C]"
                            title="Uncheck to remove"
                          />
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {region.name}
                          </span>
                          {region.isCustom && (
                            <Badge variant="outline" className="text-[10px] py-0">Custom</Badge>
                          )}
                        </div>

                        <PriorityPicker
                          value={region.priority}
                          onChange={(newPriority) => {
                            const updated = formData.geography.regions.map((r) =>
                              r.id === region.id ? { ...r, priority: newPriority } : r
                            )
                            setFormData({
                              ...formData,
                              geography: { ...formData.geography, regions: updated }
                            })
                          }}
                          hasConflict={hasConflict}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Add Custom Region */}
              <div className="pt-2">
                <ChipInput
                  chips={[]}
                  onAddChip={(customName) => {
                    const newRegion = {
                      id: `custom_geo_${Date.now()}`,
                      name: customName,
                      priority: null,
                      isCustom: true
                    }
                    setFormData({
                      ...formData,
                      geography: {
                        ...formData.geography,
                        regions: [...formData.geography.regions, newRegion]
                      }
                    })
                  }}
                  onRemoveChip={() => {}}
                  placeholder="e.g., Greater Toronto Area, Midwest Corridor..."
                  buttonLabel="Add custom region"
                  label="Add Custom Region"
                  helperText="Press Enter or click Add to append a custom territory to your list."
                />
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: TARGET MARKET & PERSONA (Sections 3, 4, 5)
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-6">
          {/* SECTION 3: TARGET INDUSTRY */}
          <SectionCard
            sectionNumber={3}
            title="Target Industry"
            subtitle="Configure target subcontractor trades, general contracting firms, and start date."
            badge="Industry Segment"
          >
            <div className="flex flex-col gap-5">
              {errors.industryPriorityDuplicate && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  <AlertCircle className="size-4 shrink-0 text-amber-600" />
                  <span>{errors.industryPriorityDuplicate}</span>
                </div>
              )}

              {/* Group A: Sub-Contractors */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <label className="flex items-center gap-2.5 font-bold text-xs text-[#0B1F5C] dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.industry.subContractors.selected}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          industry: {
                            ...formData.industry,
                            subContractors: { ...formData.industry.subContractors, selected: e.target.checked }
                          }
                        })
                      }
                      className="size-4 rounded text-[#0B1F5C]"
                    />
                    <span>Sub-Contractors</span>
                  </label>

                  <PriorityPicker
                    value={formData.industry.subContractors.priority}
                    onChange={(p) =>
                      setFormData({
                        ...formData,
                        industry: {
                          ...formData.industry,
                          subContractors: { ...formData.industry.subContractors, priority: p }
                        }
                      })
                    }
                    disabled={!formData.industry.subContractors.selected}
                    hasConflict={
                      formData.industry.subContractors.priority != null &&
                      (industryPriorityConflicts[formData.industry.subContractors.priority] || 0) > 1
                    }
                  />
                </div>

                {formData.industry.subContractors.selected && (
                  <div className="mt-3 flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Sub-options (Trade specialties):
                    </span>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                      {GTM_CONFIG.industry.subContractorTrades.map((trade) => {
                        const isChecked = formData.industry.subContractors.trades.includes(trade)
                        return (
                          <label
                            key={trade}
                            className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium cursor-pointer transition ${
                              isChecked
                                ? 'border-blue-300 bg-blue-50/50 text-[#0B1F5C] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200'
                                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const newTrades = e.target.checked
                                  ? [...formData.industry.subContractors.trades, trade]
                                  : formData.industry.subContractors.trades.filter((t) => t !== trade)
                                setFormData({
                                  ...formData,
                                  industry: {
                                    ...formData.industry,
                                    subContractors: { ...formData.industry.subContractors, trades: newTrades }
                                  }
                                })
                              }}
                              className="size-3.5 rounded text-[#0B1F5C]"
                            />
                            <span>{trade}</span>
                          </label>
                        )
                      })}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        value={formData.industry.subContractors.otherTrade}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            industry: {
                              ...formData.industry,
                              subContractors: { ...formData.industry.subContractors, otherTrade: e.target.value }
                            }
                          })
                        }
                        placeholder="Other trade (e.g., Concrete, Glazing...)"
                        className="h-8 max-w-xs text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Group B: General Contractors */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <label className="flex items-center gap-2.5 font-bold text-xs text-[#0B1F5C] dark:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.industry.generalContractors.selected}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        industry: {
                          ...formData.industry,
                          generalContractors: { ...formData.industry.generalContractors, selected: e.target.checked }
                        }
                      })
                    }
                    className="size-4 rounded text-[#0B1F5C]"
                  />
                  <div>
                    <span>General Contractors</span>
                    <p className="text-[11px] font-normal text-slate-500">Commercial, Healthcare & Institutional GCs</p>
                  </div>
                </label>

                <PriorityPicker
                  value={formData.industry.generalContractors.priority}
                  onChange={(p) =>
                    setFormData({
                      ...formData,
                      industry: {
                        ...formData.industry,
                        generalContractors: { ...formData.industry.generalContractors, priority: p }
                      }
                    })
                  }
                  disabled={!formData.industry.generalContractors.selected}
                  hasConflict={
                    formData.industry.generalContractors.priority != null &&
                    (industryPriorityConflicts[formData.industry.generalContractors.priority] || 0) > 1
                  }
                />
              </div>

              {/* Group C: Other Industry */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                  <label className="flex items-center gap-2.5 font-bold text-xs text-[#0B1F5C] dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.industry.otherIndustry.selected}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          industry: {
                            ...formData.industry,
                            otherIndustry: { ...formData.industry.otherIndustry, selected: e.target.checked }
                          }
                        })
                      }
                      className="size-4 rounded text-[#0B1F5C]"
                    />
                    <span>Other Industry</span>
                  </label>
                  {formData.industry.otherIndustry.selected && (
                    <Input
                      value={formData.industry.otherIndustry.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          industry: {
                            ...formData.industry,
                            otherIndustry: { ...formData.industry.otherIndustry, name: e.target.value }
                          }
                        })
                      }
                      placeholder="Specify other industry (e.g., Engineering Consultancies, Owners)"
                      className="h-8 text-xs max-w-sm mt-1"
                    />
                  )}
                </div>

                <PriorityPicker
                  value={formData.industry.otherIndustry.priority}
                  onChange={(p) =>
                    setFormData({
                      ...formData,
                      industry: {
                        ...formData.industry,
                        otherIndustry: { ...formData.industry.otherIndustry, priority: p }
                      }
                    })
                  }
                  disabled={!formData.industry.otherIndustry.selected}
                  hasConflict={
                    formData.industry.otherIndustry.priority != null &&
                    (industryPriorityConflicts[formData.industry.otherIndustry.priority] || 0) > 1
                  }
                />
              </div>

              {/* Optional Date Field: Target Start Date */}
              <div className="max-w-xs pt-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Priority / Targeting Start Date (Optional)
                </label>
                <Input
                  type="date"
                  value={formData.industry.targetStartDate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      industry: { ...formData.industry, targetStartDate: e.target.value }
                    })
                  }
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
          </SectionCard>

          {/* SECTION 4: COMPANY SIZE */}
          <SectionCard
            sectionNumber={4}
            title="Company Size"
            subtitle="Define business scale criteria by Number of Employees or Annual Revenue."
            badge="Firmographic Scale"
          >
            <div className="flex flex-col gap-4">
              {/* Basis Selector Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Measurement Basis:
                </span>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        companySize: { ...formData.companySize, basis: 'employees' }
                      })
                    }
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      formData.companySize.basis === 'employees'
                        ? 'bg-[#0B1F5C] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                    }`}
                  >
                    Number of Employees
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        companySize: { ...formData.companySize, basis: 'revenue' }
                      })
                    }
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      formData.companySize.basis === 'revenue'
                        ? 'bg-[#0B1F5C] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                    }`}
                  >
                    Annual Revenue
                  </button>
                </div>
              </div>

              {errors.sizePriorityDuplicate && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  <AlertCircle className="size-4 shrink-0 text-amber-600" />
                  <span>{errors.sizePriorityDuplicate}</span>
                </div>
              )}

              {/* Tiers List with Priority */}
              <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {formData.companySize.options.map((option) => {
                  const hasConflict = option.selected && option.priority != null && (sizePriorityConflicts[option.priority] || 0) > 1
                  return (
                    <div
                      key={option.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={option.selected}
                          onChange={(e) => {
                            const updated = formData.companySize.options.map((o) =>
                              o.id === option.id ? { ...o, selected: e.target.checked } : o
                            )
                            setFormData({
                              ...formData,
                              companySize: { ...formData.companySize, options: updated }
                            })
                          }}
                          className="size-4 rounded text-[#0B1F5C]"
                        />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                          {option.label}
                        </span>
                      </label>

                      {option.id === 'size_custom' && option.selected && (
                        <Input
                          value={option.customRange || ''}
                          onChange={(e) => {
                            const updated = formData.companySize.options.map((o) =>
                              o.id === option.id ? { ...o, customRange: e.target.value } : o
                            )
                            setFormData({
                              ...formData,
                              companySize: { ...formData.companySize, options: updated }
                            })
                          }}
                          placeholder="Specify custom range (e.g. 1000+)"
                          className="h-8 max-w-[200px] text-xs"
                        />
                      )}

                      <PriorityPicker
                        value={option.priority}
                        onChange={(p) => {
                          const updated = formData.companySize.options.map((o) =>
                            o.id === option.id ? { ...o, priority: p } : o
                          )
                          setFormData({
                            ...formData,
                            companySize: { ...formData.companySize, options: updated }
                          })
                        }}
                        disabled={!option.selected}
                        hasConflict={hasConflict}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </SectionCard>

          {/* SECTION 5: TARGET JOB TITLES */}
          <SectionCard
            sectionNumber={5}
            title="Target Job Titles"
            subtitle="Target personas, buyers, and champions inside prospect accounts."
            badge="Buyer Persona"
          >
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Core Job Titles:
              </span>
              <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
                {GTM_CONFIG.jobTitles.prefilledList.map((title) => {
                  const isChecked = formData.jobTitles.selectedTitles.includes(title)
                  return (
                    <label
                      key={title}
                      className={`flex items-center gap-2.5 rounded-lg border p-3 text-xs font-medium cursor-pointer transition ${
                        isChecked
                          ? 'border-blue-300 bg-blue-50/60 text-[#0B1F5C] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200'
                          : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const newTitles = e.target.checked
                            ? [...formData.jobTitles.selectedTitles, title]
                            : formData.jobTitles.selectedTitles.filter((t) => t !== title)
                          setFormData({
                            ...formData,
                            jobTitles: { ...formData.jobTitles, selectedTitles: newTitles }
                          })
                        }}
                        className="size-4 rounded text-[#0B1F5C]"
                      />
                      <span>{title}</span>
                    </label>
                  )
                })}
              </div>

              {/* Add Custom Title (Chips UI) */}
              <div className="pt-2">
                <ChipInput
                  chips={formData.jobTitles.customTitles}
                  onAddChip={(newTitle) =>
                    setFormData({
                      ...formData,
                      jobTitles: {
                        ...formData.jobTitles,
                        customTitles: [...formData.jobTitles.customTitles, newTitle]
                      }
                    })
                  }
                  onRemoveChip={(titleToRemove) =>
                    setFormData({
                      ...formData,
                      jobTitles: {
                        ...formData.jobTitles,
                        customTitles: formData.jobTitles.customTitles.filter((t) => t !== titleToRemove)
                      }
                    })
                  }
                  placeholder="e.g., BIM Coordinator, Director of Preconstruction"
                  buttonLabel="Add custom title"
                  label="Add Custom Title"
                  helperText="Add specialized roles or company-specific designations."
                />
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 3: ACCOUNTS & OUTREACH (Sections 6, 7, 8)
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-6">
          {/* SECTION 6: FOCUSED ACCOUNTS / CUSTOMERS */}
          <SectionCard
            sectionNumber={6}
            title="Focused Accounts / Named Clients"
            subtitle="List high-value target accounts, buying committees, and specific target projects."
            badge="Named Account List"
          >
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.focusedAccounts.decideLater}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      focusedAccounts: { ...formData.focusedAccounts, decideLater: e.target.checked }
                    })
                  }
                  className="size-4 rounded text-[#0B1F5C]"
                />
                <span>Decide later (Skip named accounts for now)</span>
              </label>

              {formData.focusedAccounts.decideLater ? (
                <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
                  Target accounts will be established during the initial sprint review.
                </div>
              ) : (
                <RepeatableRows
                  rows={formData.focusedAccounts.accounts}
                  columns={[
                    { key: 'companyName', label: 'Company Name', placeholder: 'e.g. Meridian Builders', width: '30%' },
                    { key: 'comments', label: 'Comments / Notes', placeholder: 'Key initiatives, sponsors, or context' },
                    { key: 'targetProjects', label: 'Target Projects', placeholder: 'Specific builds, hospital wings, data centers' }
                  ]}
                  onAddRow={() => {
                    const newRow = {
                      id: `acc_${Date.now()}`,
                      companyName: '',
                      comments: '',
                      targetProjects: ''
                    }
                    setFormData({
                      ...formData,
                      focusedAccounts: {
                        ...formData.focusedAccounts,
                        accounts: [...formData.focusedAccounts.accounts, newRow]
                      }
                    })
                  }}
                  onRemoveRow={(id) => {
                    setFormData({
                      ...formData,
                      focusedAccounts: {
                        ...formData.focusedAccounts,
                        accounts: formData.focusedAccounts.accounts.filter((a) => a.id !== id)
                      }
                    })
                  }}
                  onChangeRow={(id, key, val) => {
                    const updated = formData.focusedAccounts.accounts.map((a) =>
                      a.id === id ? { ...a, [key]: val } : a
                    )
                    setFormData({
                      ...formData,
                      focusedAccounts: { ...formData.focusedAccounts, accounts: updated }
                    })
                  }}
                  addButtonText="Add Target Account"
                  emptyMessage="No focused accounts added. Click below to add your first named target."
                />
              )}
            </div>
          </SectionCard>

          {/* SECTION 7: OUTREACH STRATEGY */}
          <SectionCard
            sectionNumber={7}
            title="Outreach Strategy & Channels"
            subtitle="Select campaign outreach channels and define specific cadence instructions."
            badge="Channel Orchestration"
          >
            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <label className="flex items-center gap-2.5 font-bold text-xs text-[#0B1F5C] dark:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.outreach.email.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        outreach: {
                          ...formData.outreach,
                          email: { ...formData.outreach.email, enabled: e.target.checked }
                        }
                      })
                    }
                    className="size-4 rounded text-[#0B1F5C]"
                  />
                  <span>Email Channel</span>
                </label>
                {formData.outreach.email.enabled && (
                  <div className="mt-2.5">
                    <label className="text-[11px] font-medium text-slate-500">
                      Cadence, templates & notes:
                    </label>
                    <Textarea
                      value={formData.outreach.email.details}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outreach: {
                            ...formData.outreach,
                            email: { ...formData.outreach.email, details: e.target.value }
                          }
                        })
                      }
                      placeholder="e.g. 3-touch sequence, subject lines, personalized case study references."
                      className="mt-1 text-xs min-h-[60px]"
                    />
                  </div>
                )}
              </div>

              {/* LinkedIn */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <label className="flex items-center gap-2.5 font-bold text-xs text-[#0B1F5C] dark:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.outreach.linkedIn.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        outreach: {
                          ...formData.outreach,
                          linkedIn: { ...formData.outreach.linkedIn, enabled: e.target.checked }
                        }
                      })
                    }
                    className="size-4 rounded text-[#0B1F5C]"
                  />
                  <span>LinkedIn Outreach</span>
                </label>
                {formData.outreach.linkedIn.enabled && (
                  <div className="mt-2.5">
                    <label className="text-[11px] font-medium text-slate-500">
                      Cadence, templates & notes:
                    </label>
                    <Textarea
                      value={formData.outreach.linkedIn.details}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outreach: {
                            ...formData.outreach,
                            linkedIn: { ...formData.outreach.linkedIn, details: e.target.value }
                          }
                        })
                      }
                      placeholder="e.g. Connection message + 2 direct message follow-ups with relevant project clips."
                      className="mt-1 text-xs min-h-[60px]"
                    />
                  </div>
                )}
              </div>

              {/* Calls */}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <label className="flex items-center gap-2.5 font-bold text-xs text-[#0B1F5C] dark:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.outreach.calls.enabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        outreach: {
                          ...formData.outreach,
                          calls: { ...formData.outreach.calls, enabled: e.target.checked }
                        }
                      })
                    }
                    className="size-4 rounded text-[#0B1F5C]"
                  />
                  <span>Phone Calls Channel</span>
                </label>
                {formData.outreach.calls.enabled && (
                  <div className="mt-2.5">
                    <label className="text-[11px] font-medium text-slate-500">
                      Cadence, templates & notes:
                    </label>
                    <Textarea
                      value={formData.outreach.calls.details}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outreach: {
                            ...formData.outreach,
                            calls: { ...formData.outreach.calls, details: e.target.value }
                          }
                        })
                      }
                      placeholder="e.g. Follow-up calls within 24 hours of email opens, discovery talk track."
                      className="mt-1 text-xs min-h-[60px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* SECTION 8: UPCOMING CONFERENCES / TRADE SHOWS */}
          <SectionCard
            sectionNumber={8}
            title="Upcoming Conferences / Trade Shows"
            subtitle="Track relevant industry trade exhibitions and request event research support."
            badge="Event Intelligence"
          >
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.conferences.requestResearchSupport}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      conferences: { ...formData.conferences, requestResearchSupport: e.target.checked }
                    })
                  }
                  className="size-4 rounded text-[#0B1F5C]"
                />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  Request research support from our team
                </span>
                <span className="text-slate-400 font-normal">
                  (We will research conferences, attendees, and exhibitor lists for you)
                </span>
              </label>

              <RepeatableRows
                rows={formData.conferences.conferences}
                columns={[
                  { key: 'eventName', label: 'Event Name', placeholder: 'e.g. Autodesk University', width: '28%' },
                  { key: 'date', label: 'Date', type: 'date', width: '18%' },
                  { key: 'location', label: 'Location', placeholder: 'e.g. San Diego, CA', width: '22%' },
                  { key: 'notes', label: 'Notes', placeholder: 'Goals, booth presence, target attendees' }
                ]}
                onAddRow={() => {
                  const newRow = {
                    id: `conf_${Date.now()}`,
                    eventName: '',
                    date: '',
                    location: '',
                    notes: ''
                  }
                  setFormData({
                    ...formData,
                    conferences: {
                      ...formData.conferences,
                      conferences: [...formData.conferences.conferences, newRow]
                    }
                  })
                }}
                onRemoveRow={(id) => {
                  setFormData({
                    ...formData,
                    conferences: {
                      ...formData.conferences,
                      conferences: formData.conferences.conferences.filter((c) => c.id !== id)
                    }
                  })
                }}
                onChangeRow={(id, key, val) => {
                  const updated = formData.conferences.conferences.map((c) =>
                    c.id === id ? { ...c, [key]: val } : c
                  )
                  setFormData({
                    ...formData,
                    conferences: { ...formData.conferences, conferences: updated }
                  })
                }}
                addButtonText="Add Conference / Event"
                emptyMessage="No specific conferences listed. Click below to add an upcoming trade show."
              />
            </div>
          </SectionCard>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 4: OPERATIONS & SETUP (Sections 9, 10, 11, 12, 13)
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 4 && (
        <div className="flex flex-col gap-6">
          {/* SECTION 9: OTHERS */}
          <SectionCard
            sectionNumber={9}
            title="Strategic Notes & Additional Context"
            subtitle="Free-text instructions, positioning notes, or competitive intelligence."
            badge="Strategic Context"
          >
            <Textarea
              value={formData.otherNotes}
              onChange={(e) => setFormData({ ...formData, otherNotes: e.target.value })}
              placeholder="e.g. Client specializes in fast turnaround BIM clash detection models. Key differentiator is 100% native Revit authoring. Avoid prospects with strict on-site security clearances."
              className="text-xs min-h-[100px]"
            />
          </SectionCard>

          {/* SECTION 10: CRM */}
          <SectionCard
            sectionNumber={10}
            title="CRM Integration & Pipeline System"
            subtitle="Connect your customer relationship management software for lead sync."
            badge="Tech Stack"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Do you use a CRM?
                </span>
                <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        crm: { ...formData.crm, usesCrm: true }
                      })
                    }
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      formData.crm.usesCrm
                        ? 'bg-[#0B1F5C] text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        crm: { ...formData.crm, usesCrm: false }
                      })
                    }
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      !formData.crm.usesCrm
                        ? 'bg-[#0B1F5C] text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {formData.crm.usesCrm && (
                <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      CRM Platform
                    </label>
                    <select
                      value={formData.crm.crmProvider}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          crm: { ...formData.crm, crmProvider: e.target.value }
                        })
                      }
                      className="mt-1 h-9 w-full rounded-lg border border-input bg-transparent px-3 text-xs outline-none focus:ring-2 focus:ring-[#0B1F5C] dark:bg-slate-900"
                    >
                      {GTM_CONFIG.crm.providers.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Details / Access Notes
                    </label>
                    <Input
                      value={formData.crm.crmDetails}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          crm: { ...formData.crm, crmDetails: e.target.value }
                        })
                      }
                      placeholder="e.g. HubSpot Enterprise, API key will be provided"
                      className="mt-1 h-9 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* SECTION 11: WEEKLY MEETING */}
          <SectionCard
            sectionNumber={11}
            title="Weekly Strategy & Review Meeting"
            subtitle="Set your preferred weekly alignment cadence and time zone."
            badge="Governance Cadence"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="size-3.5 text-[#0B1F5C] dark:text-blue-400" />
                  Day of Week
                </label>
                <select
                  value={formData.weeklyMeeting.day}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weeklyMeeting: { ...formData.weeklyMeeting, day: e.target.value }
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-input bg-transparent px-3 text-xs outline-none focus:ring-2 focus:ring-[#0B1F5C] dark:bg-slate-900"
                >
                  {GTM_CONFIG.weeklyMeeting.daysOfWeek.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="size-3.5 text-[#0B1F5C] dark:text-blue-400" />
                  Preferred Time
                </label>
                <Input
                  value={formData.weeklyMeeting.time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weeklyMeeting: { ...formData.weeklyMeeting, time: e.target.value }
                    })
                  }
                  placeholder="10:00 AM"
                  className="mt-1.5 h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Globe className="size-3.5 text-[#0B1F5C] dark:text-blue-400" />
                  Time Zone
                </label>
                <select
                  value={formData.weeklyMeeting.timeZone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weeklyMeeting: { ...formData.weeklyMeeting, timeZone: e.target.value }
                    })
                  }
                  className="mt-1.5 h-9 w-full rounded-lg border border-input bg-transparent px-3 text-xs outline-none focus:ring-2 focus:ring-[#0B1F5C] dark:bg-slate-900"
                >
                  {GTM_CONFIG.weeklyMeeting.timeZones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* SECTION 12: POINT OF CONTACT */}
          <SectionCard
            sectionNumber={12}
            title="Designated Points of Contact"
            subtitle="Internal client stakeholders responsible for campaign review, leads, and approvals."
            badge="Stakeholder Directory"
          >
            <RepeatableRows
              rows={formData.pointOfContact.contacts}
              columns={[
                { key: 'name', label: 'Full Name', placeholder: 'e.g. Sarah Jenkins', width: '25%' },
                { key: 'role', label: 'Role / Title', placeholder: 'e.g. VP of Business Development', width: '25%' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'sarah@example.com', width: '25%' },
                { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 234-5678' }
              ]}
              onAddRow={() => {
                const newRow = {
                  id: `poc_${Date.now()}`,
                  name: '',
                  role: '',
                  email: '',
                  phone: ''
                }
                setFormData({
                  ...formData,
                  pointOfContact: {
                    ...formData.pointOfContact,
                    contacts: [...formData.pointOfContact.contacts, newRow]
                  }
                })
              }}
              onRemoveRow={(id) => {
                setFormData({
                  ...formData,
                  pointOfContact: {
                    ...formData.pointOfContact,
                    contacts: formData.pointOfContact.contacts.filter((c) => c.id !== id)
                  }
                })
              }}
              onChangeRow={(id, key, val) => {
                const updated = formData.pointOfContact.contacts.map((c) =>
                  c.id === id ? { ...c, [key]: val } : c
                )
                setFormData({
                  ...formData,
                  pointOfContact: { ...formData.pointOfContact, contacts: updated }
                })
              }}
              addButtonText="Add Stakeholder Contact"
              emptyMessage="No stakeholders added. Click below to add a designated point of contact."
            />
          </SectionCard>

          {/* SECTION 13: MODE OF COMMUNICATION */}
          <SectionCard
            sectionNumber={13}
            title="Preferred Modes of Communication"
            subtitle="Select the team communication channels you prefer for day-to-day updates."
            badge="Communication Protocol"
          >
            <div className="flex flex-col gap-4">
              <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
                {GTM_CONFIG.communicationModes.map((mode) => {
                  const isChecked = formData.communication.selectedModes.includes(mode)
                  return (
                    <label
                      key={mode}
                      className={`flex items-center gap-2.5 rounded-lg border p-3 text-xs font-medium cursor-pointer transition ${
                        isChecked
                          ? 'border-emerald-300 bg-emerald-50/60 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                          : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const newModes = e.target.checked
                            ? [...formData.communication.selectedModes, mode]
                            : formData.communication.selectedModes.filter((m) => m !== mode)
                          setFormData({
                            ...formData,
                            communication: { ...formData.communication, selectedModes: newModes }
                          })
                        }}
                        className="size-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{mode}</span>
                    </label>
                  )
                })}
              </div>

              {formData.communication.selectedModes.includes('Other') && (
                <div className="pt-2 max-w-sm">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Specify other channel:
                  </label>
                  <Input
                    value={formData.communication.otherMode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communication: { ...formData.communication, otherMode: e.target.value }
                      })
                    }
                    placeholder="e.g. Asana, Discord, Signal..."
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM NAVIGATION / STEP CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div>
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft className="size-4" />
              Previous: {WIZARD_STEPS[currentStep - 2]?.title}
            </Button>
          ) : (
            <span className="text-xs text-slate-400">Step 1 of {WIZARD_STEPS.length}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {currentStep < WIZARD_STEPS.length ? (
            <Button
              type="button"
              size="sm"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="gap-1.5 bg-[#0B1F5C] text-xs font-semibold text-white hover:bg-[#152e7a] dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Next: {WIZARD_STEPS[currentStep]?.title}
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleGenerateStrategy}
              className="gap-1.5 bg-[#FFC000] text-xs font-bold text-[#0B1F5C] hover:bg-[#e6ad00] shadow-xs"
            >
              <Sparkles className="size-4" />
              Generate My GTM Strategy
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

