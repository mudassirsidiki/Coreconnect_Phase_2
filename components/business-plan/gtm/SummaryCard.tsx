'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SummaryCardProps {
  sectionNumber: number | string
  title: string
  priority?: number | null
  badge?: string
  children: React.ReactNode
  className?: string
}

export function SummaryCard({
  sectionNumber,
  title,
  priority,
  badge,
  children,
  className = ''
}: SummaryCardProps) {
  return (
    <Card className={`border-slate-200/90 shadow-xs dark:border-slate-800 ${className} print:border-slate-300 print:shadow-none print:break-inside-avoid`}>
      <CardHeader className="border-b border-slate-100 bg-slate-50/60 pb-3 pt-3.5 px-5 dark:border-slate-800/80 dark:bg-slate-900/40 print:bg-slate-100/50">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-6 place-items-center rounded-md bg-[#0B1F5C] text-[11px] font-bold text-white print:bg-slate-800">
              {sectionNumber}
            </span>
            <CardTitle className="text-sm font-bold text-[#0B1F5C] dark:text-white print:text-slate-900">
              {title}
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            {priority != null && (
              <Badge className="bg-[#FFC000] text-[#0B1F5C] text-[10px] font-bold shadow-xs hover:bg-[#FFC000] print:border print:border-slate-400">
                Priority #{priority}
              </Badge>
            )}
            {badge && (
              <Badge variant="outline" className="border-slate-300 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                {badge}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 text-sm text-slate-700 dark:text-slate-300">
        {children}
      </CardContent>
    </Card>
  )
}
