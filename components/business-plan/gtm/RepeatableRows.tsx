'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

export interface ColumnDef<T> {
  key: keyof T
  label: string
  placeholder?: string
  type?: 'text' | 'date' | 'email' | 'tel'
  width?: string
}

interface RepeatableRowsProps<T extends { id: string }> {
  rows: T[]
  columns: ColumnDef<T>[]
  onAddRow: () => void
  onRemoveRow: (id: string) => void
  onChangeRow: (id: string, key: keyof T, value: string) => void
  addButtonText?: string
  emptyMessage?: string
}

export function RepeatableRows<T extends { id: string }>({
  rows,
  columns,
  onAddRow,
  onRemoveRow,
  onChangeRow,
  addButtonText = 'Add Row',
  emptyMessage = 'No rows added yet.'
}: RepeatableRowsProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      {/* Table on tablet and desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/80 font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            <tr>
              <th className="w-10 px-3 py-2.5 text-center text-slate-400">#</th>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-3 py-2.5" style={{ width: col.width }}>
                  {col.label}
                </th>
              ))}
              <th className="w-12 px-3 py-2.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-6 text-center text-slate-400 italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="px-3 py-2 text-center text-slate-400 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-3 py-2">
                      <Input
                        type={col.type || 'text'}
                        value={String(row[col.key] ?? '')}
                        onChange={(e) => onChangeRow(row.id, col.key, e.target.value)}
                        placeholder={col.placeholder || col.label}
                        className="h-8 text-xs bg-white dark:bg-slate-900"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(row.id)}
                      className="grid size-7 place-items-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition"
                      title="Remove row"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card stack on mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 italic dark:border-slate-800">
            {emptyMessage}
          </div>
        ) : (
          rows.map((row, idx) => (
            <div
              key={row.id}
              className="relative rounded-lg border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-2 flex items-center justify-between border-b pb-1 text-xs font-semibold text-slate-500 dark:border-slate-800">
                <span>Row #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => onRemoveRow(row.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove row"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {columns.map((col) => (
                  <div key={String(col.key)} className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      {col.label}
                    </label>
                    <Input
                      type={col.type || 'text'}
                      value={String(row[col.key] ?? '')}
                      onChange={(e) => onChangeRow(row.id, col.key, e.target.value)}
                      placeholder={col.placeholder || col.label}
                      className="h-8 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddRow}
          className="gap-1.5 text-xs text-[#0B1F5C] hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
        >
          <Plus className="size-3.5" />
          {addButtonText}
        </Button>
      </div>
    </div>
  )
}

