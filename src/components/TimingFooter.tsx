'use client'

import { useEffect, useState, useMemo } from 'react'

interface TimingInfo {
  isColdStart: boolean
  requestCount: number
  instanceAge: number
  pageProcessingTime: number
  startRender: number
  initializedFrom: string | undefined
}

export default function TimingFooter() {
  const [mounted, setMounted] = useState(false)
  const [startRender, setStartRender] = useState(0)
  const [instanceAge, setInstanceAge] = useState(0)

  // Calculate timing data from meta tags (doesn't need to be in state)
  const timingInfo = useMemo<TimingInfo | null>(() => {
    if (!mounted || typeof window === 'undefined') return null

    const isColdStart = document.querySelector('meta[name="x-is-cold-start"]')?.getAttribute('content') === 'true'
    const requestCount = parseInt(document.querySelector('meta[name="x-request-count"]')?.getAttribute('content') || '0')
    const pageProcessingTime = parseFloat(document.querySelector('meta[name="x-page-processing-time"]')?.getAttribute('content') || '0')

    return {
      isColdStart,
      requestCount,
      instanceAge,
      pageProcessingTime,
      startRender,
      initializedFrom: document.querySelector('meta[name="x-initialized-from"]')?.getAttribute('content') || undefined,
    }
  }, [mounted, startRender, instanceAge])

  // Mark component as mounted after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate instance age separately (only needs to run once)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const instanceInitTime = parseInt(document.querySelector('meta[name="x-instance-init-time"]')?.getAttribute('content') || '0')
      if (instanceInitTime > 0) {
        setInstanceAge(Date.now() - instanceInitTime)
      }
    }
  }, [])

  // Get start-render time separately (only needs to run once)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation && navigation.domInteractive > 0) {
        // Start-render is measured as time from fetch start to when DOM becomes interactive
        setStartRender(navigation.domInteractive - navigation.fetchStart)
      }
    }
  }, [])


  if (!timingInfo) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        padding: '12px 20px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 99999,
        borderTop: '2px solid #4CAF50',
      }}
    >
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <strong style={{ color: timingInfo.isColdStart ? '#ff9800' : '#4CAF50' }}>
            {timingInfo.isColdStart ? '🥶 COLD START' : '🔥 WARM'}
          </strong>
        </div>
        <div>
          Request #{timingInfo.requestCount}
        </div>
        <div>
          Instance Age: {(timingInfo.instanceAge / 1000).toFixed(2)}s
        </div>
        <div>
          Server-side Page Processing Time: {timingInfo.pageProcessingTime.toFixed(2)}ms
        </div>
        <div>
          Start Render Time: {timingInfo.startRender.toFixed(2)}ms
        </div>
        <div>
          Initialized From: {timingInfo.initializedFrom || 'Unknown'}
        </div>
      </div>
    </div>
  )
}