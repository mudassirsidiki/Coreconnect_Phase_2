'use client'

import React, { useState, useRef } from 'react'
import { US_STATE_PATHS } from './usStatePaths'
import { Badge } from '@/components/ui/badge'
import { MapPin, CheckCircle2, Info } from 'lucide-react'

export interface TargetRegion {
  id: string
  name: string
  priority: number
  color: string
  hoverColor: string
  borderColor: string
  badgeBg: string
  states: string[]
  metroHubs: string
  description: string
  pin: { x: number; y: number }
}

export const TARGET_REGIONS: TargetRegion[] = [
  {
    id: 'reg_1',
    name: 'California, Nevada, Oregon/Seattle',
    priority: 1,
    color: '#1D4ED8', // Vibrant Sapphire Blue / Core Navy
    hoverColor: '#1E40AF',
    borderColor: '#60A5FA',
    badgeBg: 'bg-blue-600 text-white',
    states: ['CA', 'NV', 'OR', 'WA'],
    metroHubs: 'San Francisco, Los Angeles, Seattle, Las Vegas, Portland',
    description: 'Pacific & Northwest innovation corridor; primary high-growth territory.',
    pin: { x: 165, y: 220 }
  },
  {
    id: 'reg_2',
    name: 'North Carolina',
    priority: 2,
    color: '#D97706', // Vibrant Amber / Gold
    hoverColor: '#B45309',
    borderColor: '#FCD34D',
    badgeBg: 'bg-amber-600 text-white',
    states: ['NC'],
    metroHubs: 'Raleigh-Durham (Research Triangle), Charlotte Financial Center',
    description: 'East Coast tech & financial institution powerhouse.',
    pin: { x: 885, y: 410 }
  },
  {
    id: 'reg_3',
    name: 'Texas',
    priority: 3,
    color: '#059669', // Emerald Green
    hoverColor: '#047857',
    borderColor: '#6EE7B7',
    badgeBg: 'bg-emerald-600 text-white',
    states: ['TX'],
    metroHubs: 'Austin, Dallas-Fort Worth, Houston Energy Hub',
    description: 'Central enterprise scaling cluster and corporate relocations.',
    pin: { x: 495, y: 495 }
  },
  {
    id: 'reg_4',
    name: 'Florida',
    priority: 4,
    color: '#7C3AED', // Violet / Purple
    hoverColor: '#6D28D9',
    borderColor: '#C4B5FD',
    badgeBg: 'bg-purple-600 text-white',
    states: ['FL'],
    metroHubs: 'Miami, Tampa Bay, Orlando Commercial Hub',
    description: 'Rapidly expanding private equity and family office hub.',
    pin: { x: 845, y: 535 }
  },
  {
    id: 'reg_5',
    name: 'New York',
    priority: 5,
    color: '#0284C7', // Electric Ocean Teal
    hoverColor: '#0369A1',
    borderColor: '#7DD3FC',
    badgeBg: 'bg-sky-600 text-white',
    states: ['NY'],
    metroHubs: 'New York City (Manhattan, Tri-State), Albany',
    description: 'Global financial capital and Fortune 500 headquarters epicenter.',
    pin: { x: 875, y: 215 }
  }
]

interface UsaMapProps {
  activeRegionId?: string | null
  onHoverRegion?: (id: string | null) => void
}

export function UsaMap({ activeRegionId, onHoverRegion }: UsaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)

  // Map state ID to region
  const stateToRegionMap = React.useMemo(() => {
    const map: Record<string, TargetRegion> = {}
    TARGET_REGIONS.forEach((reg) => {
      reg.states.forEach((st) => {
        map[st] = reg
      })
    })
    return map
  }, [])

  const currentHoveredRegion = hoveredStateId
    ? stateToRegionMap[hoveredStateId]
    : activeRegionId
    ? TARGET_REGIONS.find((r) => r.id === activeRegionId)
    : null

  const handleMouseMove = (e: React.MouseEvent, stateId: string) => {
    const reg = stateToRegionMap[stateId]
    if (!reg) {
      setHoveredStateId(null)
      setTooltipPos(null)
      if (onHoverRegion) onHoverRegion(null)
      return
    }

    setHoveredStateId(stateId)
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const relX = e.clientX - containerRect.left
      const relY = e.clientY - containerRect.top
      const clampedX = Math.max(80, Math.min(relX, containerRect.width - 80))
      setTooltipPos({
        x: clampedX,
        y: relY
      })
    }
    if (onHoverRegion) onHoverRegion(reg.id)
  }

  const handlePinMouseMove = (e: React.MouseEvent, reg: TargetRegion) => {
    setHoveredStateId(reg.states[0])
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const relX = e.clientX - containerRect.left
      const relY = e.clientY - containerRect.top
      const clampedX = Math.max(80, Math.min(relX, containerRect.width - 80))
      setTooltipPos({
        x: clampedX,
        y: relY
      })
    }
    if (onHoverRegion) onHoverRegion(reg.id)
  }

  const handleMouseLeave = () => {
    setHoveredStateId(null)
    setTooltipPos(null)
    if (onHoverRegion) onHoverRegion(null)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/80 via-white to-blue-50/30 p-4 shadow-xs dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-900 dark:to-slate-950">
      {/* Top Banner inside Map */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#0B1F5C] dark:text-blue-300">
            Coverage Map: United States of America (USA)
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-500 dark:text-slate-400">
            5 Targeted Expansion Zones Highlighted
          </span>
        </div>

        <div className="text-[11px] font-medium text-slate-500">
          Hover over highlighted territories to inspect priority details
        </div>
      </div>

      {/* SVG Map Container */}
      <div ref={containerRef} className="relative w-full aspect-[960/590] max-h-[580px]">
        <svg
          viewBox="0 0 1000 620"
          className="size-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Grid Watermark */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-slate-200/50 dark:text-slate-800/40" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1000" height="620" fill="url(#grid)" />

          {/* Render All 50 US States */}
          <g className="transition-all duration-300">
            {US_STATE_PATHS.map((state) => {
              const targetRegion = stateToRegionMap[state.id]
              const isTargeted = Boolean(targetRegion)
              const isRegionActive =
                (currentHoveredRegion && targetRegion && currentHoveredRegion.id === targetRegion.id) ||
                (activeRegionId && targetRegion && targetRegion.id === activeRegionId)

              // Base fills
              let fillColor = '#E2E8F0' // Neutral slate for non-targeted
              let strokeColor = '#CBD5E1'
              let strokeWidth = 1.2
              let opacity = 0.85

              if (isTargeted && targetRegion) {
                fillColor = targetRegion.color
                strokeColor = targetRegion.borderColor
                strokeWidth = isRegionActive ? 2.5 : 1.8
                opacity = isRegionActive ? 1 : 0.92
              } else if (currentHoveredRegion) {
                // Dim non-targeted states slightly when hovering a targeted state
                opacity = 0.5
              }

              return (
                <path
                  key={state.id}
                  id={state.id}
                  d={state.d}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  opacity={opacity}
                  className={`transition-all duration-200 ${
                    isTargeted ? 'cursor-pointer hover:brightness-110 drop-shadow-xs' : 'cursor-default'
                  }`}
                  onMouseEnter={(e) => handleMouseMove(e, state.id)}
                  onMouseMove={(e) => handleMouseMove(e, state.id)}
                  onMouseLeave={handleMouseLeave}
                />
              )
            })}
          </g>

          {/* Pin Markers & Priority Badges directly on map */}
          {TARGET_REGIONS.map((reg) => {
            const isHovered = currentHoveredRegion?.id === reg.id
            return (
              <g
                key={`pin_${reg.id}`}
                transform={`translate(${reg.pin.x}, ${reg.pin.y})`}
                className="cursor-pointer transition-transform duration-200"
                style={{
                  transform: isHovered
                    ? `translate(${reg.pin.x}px, ${reg.pin.y}px) scale(1.15)`
                    : `translate(${reg.pin.x}px, ${reg.pin.y}px) scale(1)`
                }}
                onMouseEnter={(e) => handlePinMouseMove(e, reg)}
                onMouseMove={(e) => handlePinMouseMove(e, reg)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Glow ring */}
                <circle
                  r={isHovered ? 18 : 14}
                  fill={reg.color}
                  opacity={0.25}
                  className={isHovered ? 'animate-ping' : ''}
                />
                {/* Center marker circle */}
                <circle
                  r={12}
                  fill={reg.color}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  className="shadow-md"
                />
                {/* Priority Number Label */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  {reg.priority}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Floating Tooltip (Displays location name only, accurately positioned over target) */}
        {currentHoveredRegion && tooltipPos && (
          <div
            className={`pointer-events-none absolute z-30 -translate-x-1/2 rounded-lg border border-slate-200/90 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-xs transition-opacity duration-150 dark:border-slate-700 dark:bg-slate-900/95 ${
              tooltipPos.y < 50 ? 'translate-y-3' : '-translate-y-full'
            }`}
            style={{
              left: `${tooltipPos.x}px`,
              top: tooltipPos.y < 50 ? `${tooltipPos.y}px` : `${tooltipPos.y - 12}px`
            }}
          >
            <span className="text-xs font-bold text-[#0B1F5C] dark:text-white whitespace-nowrap">
              {currentHoveredRegion.name}
            </span>
          </div>
        )}
      </div>

      {/* Mini Helper Footer inside map card */}
      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-200/80 pt-3 text-[11px] text-slate-500 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Info className="size-3.5 text-blue-600" />
          <span>Non-highlighted states represent secondary phases outside the current active scope.</span>
        </div>
        <div className="font-medium text-slate-600 dark:text-slate-400">
          Total Territory Reach: <span className="font-bold text-[#0B1F5C] dark:text-white">8 US States across 5 Priority Hubs</span>
        </div>
      </div>
    </div>
  )
}

