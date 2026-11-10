'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface ChipInputProps {
  chips: string[]
  onAddChip: (chip: string) => void
  onRemoveChip: (chip: string) => void
  placeholder?: string
  buttonLabel?: string
  label?: string
  helperText?: string
}

export function ChipInput({
  chips,
  onAddChip,
  onRemoveChip,
  placeholder = 'Add custom title...',
  buttonLabel = 'Add',
  label,
  helperText
}: ChipInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    if (!chips.includes(trimmed)) {
      onAddChip(trimmed)
    }
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-9 max-w-sm text-sm"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="h-9 gap-1 bg-[#0B1F5C] text-xs font-medium text-white hover:bg-[#152e7a] dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <Plus className="size-3.5" />
          {buttonLabel}
        </Button>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}

      {chips.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/70 py-1 pr-1.5 pl-3 text-xs font-medium text-[#0B1F5C] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200"
            >
              <span>{chip}</span>
              <button
                type="button"
                onClick={() => onRemoveChip(chip)}
                className="grid size-4 place-items-center rounded-full hover:bg-blue-200/80 dark:hover:bg-blue-800"
                title={`Remove ${chip}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

