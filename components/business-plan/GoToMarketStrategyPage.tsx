'use client'

import React, { useState } from 'react'
import { GtmStrategyFormData } from '@/lib/gtm-types'
import { getInitialGtmFormData } from '@/lib/gtm-config'
import { GtmWizardForm } from './gtm/GtmWizardForm'
import { GtmCompletedSummary } from './gtm/GtmCompletedSummary'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react'

interface GoToMarketStrategyPageProps {
  onBackToDashboard?: () => void
}

export function GoToMarketStrategyPage({ onBackToDashboard }: GoToMarketStrategyPageProps) {
  const [formData, setFormData] = useState<GtmStrategyFormData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('coreconnect_gtm_draft')
        if (saved) {
          const parsed = JSON.parse(saved)
          return parsed
        }
      } catch (err) {
        console.error('Failed to parse saved GTM draft', err)
      }
    }
    return getInitialGtmFormData()
  })

  const [viewMode, setViewMode] = useState<'wizard' | 'summary'>('wizard')

  // Listen to complete event
  const handleComplete = (completedData: GtmStrategyFormData) => {
    setFormData(completedData)
    setViewMode('summary')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Return to editing
  const handleEdit = () => {
    setViewMode('wizard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <div className="text-xs font-bold uppercase tracking-[.18em] text-[#b18400]">
            Account Business Plan
          </div>
          <h1 className="mt-1 text-2xl font-black text-[#0B1F5C] dark:text-white">
            Go-To-Market Strategy
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {viewMode === 'wizard'
              ? 'Complete the structured questionnaire to build and align your ICP and outreach program.'
              : 'Completed read-only executive strategy document mirroring the internal GTM spreadsheet.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'summary' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="gap-1.5 text-xs text-[#0B1F5C] hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
            >
              <FileText className="size-3.5" />
              Edit Questionnaire
            </Button>
          ) : (
            formData.companyName && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('summary')}
                className="gap-1.5 text-xs"
              >
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                View Current Summary
              </Button>
            )
          )}

          {onBackToDashboard && (
            <Button variant="outline" size="sm" onClick={onBackToDashboard} className="gap-1.5 text-xs">
              <ArrowLeft className="size-3.5" />
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Main Content: Wizard or Completed Summary */}
      {viewMode === 'wizard' ? (
        <GtmWizardForm
          initialData={formData}
          onComplete={handleComplete}
        />
      ) : (
        <GtmCompletedSummary
          data={formData}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}
