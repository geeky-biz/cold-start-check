'use client'

import { useEffect, useState, useMemo } from 'react'

interface TimingInfo {
  isColdStart: boolean
  requestCount: number
  instanceAge: number
  pageProcessingTime: number
  clientTTFB: number
}

export default function TimingFooter() {
  const [clientTTFB, setClientTTFB] = useState(0)

  // Calculate timing data from meta tags (doesn't need to be in state)
  const timingInfo = useMemo<TimingInfo | null>(() => {
    if (typeof window === 'undefined') return null

    const isColdStart = document.querySelector('meta[name="x-is-cold-start"]')?.getAttribute('content') === 'true'
    const requestCount = parseInt(document.querySelector('meta[name="x-request-count"]')?.getAttribute('content') || '0')
    const instanceInitTime = parseInt(document.querySelector('meta[name="x-instance-init-time"]')?.getAttribute('content') || '0')
    const pageProcessingTime = parseFloat(document.querySelector('meta[name="x-page-processing-time"]')?.getAttribute('content') || '0')
    
    const instanceAge = Date.now() - instanceInitTime

    return {
      isColdStart,
      requestCount,
      instanceAge,
      pageProcessingTime,
      clientTTFB,
    }
  }, [clientTTFB])

  // Get client-side TTFB separately (only needs to run once)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        setClientTTFB(navigation.responseStart - navigation.requestStart)
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
          Browser-side TTFB Time: {timingInfo.clientTTFB.toFixed(2)}ms
        </div>
      </div>
    </div>
  )
}