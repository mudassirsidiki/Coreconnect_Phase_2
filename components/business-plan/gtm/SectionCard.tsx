'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SectionCardProps {
  sectionNumber: number | string
  title: string
  subtitle?: string
  badge?: string
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionCard({
  sectionNumber,
  title,
  subtitle,
  badge,
  children,
  className = '',
  id
}: SectionCardProps) {
  return (
    <Card id={id} className={`border-slate-200 shadow-xs transition dark:border-slate-800 ${className}`}>
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 dark:border-slate-800/80 dark:bg-slate-900/30">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="grid size-7 place-items-center rounded-lg bg-[#0B1F5C] text-xs font-bold text-white shadow-xs dark:bg-blue-600">
              {sectionNumber}
            </span>
            <div>
              <CardTitle className="text-base font-bold text-[#0B1F5C] dark:text-white">
                {title}
              </CardTitle>
              {subtitle && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {badge && (
            <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-[10px] font-semibold text-[#0B1F5C] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5 sm:p-6">
        {children}
      </CardContent>
    </Card>
  )
}
