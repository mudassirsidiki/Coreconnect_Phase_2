'use client'

import React from 'react'
import { PriorityValue } from '@/lib/gtm-types'
import { AlertCircle } from 'lucide-react'

interface PriorityPickerProps {
  value: PriorityValue
  onChange: (val: PriorityValue) => void
  label?: string
  hasConflict?: boolean
  disabled?: boolean
  size?: 'sm' | 'default'
}

export function PriorityPicker({
  value,
  onChange,
  label = 'Priority',
  hasConflict = false,
  disabled = false,
  size = 'default'
}: PriorityPickerProps) {
  const priorities: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5]

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          {label}
        </span>
        {hasConflict && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
            <AlertCircle className="size-3 shrink-0" />
            Duplicate
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {priorities.map((p) => {
          const isSelected = value === p
          return (
            <button
              key={p}
              type="button"
              disabled={disabled}
              onClick={() => onChange(isSelected ? null : p)}
              title={`Assign Priority ${p}${isSelected ? ' (Click to clear)' : ''}`}
              className={`grid size-7 place-items-center rounded-md text-xs font-bold transition-all ${
                isSelected
                  ? hasConflict
                    ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                    : p === 1
                    ? 'bg-[#0B1F5C] text-white shadow-xs ring-2 ring-blue-300 dark:bg-blue-600'
                    : p === 2
                    ? 'bg-[#1e3a8a] text-white'
                    : p === 3
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-700 text-white dark:bg-slate-600'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {p}
            </button>
          )
        })}

        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="ml-1 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Clear Priority"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
