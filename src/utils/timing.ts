// src/lib/timing.ts
export interface TimingData {
    isColdStart: boolean
    requestCount: number
    instanceAge: number
    instanceInitTime: number
    initializedFrom: string | undefined
  }
  
  export function getTimingData(): TimingData {
    // Initialize if not already done
    if (typeof global.__REQUEST_COUNT === 'undefined') {
      global.__REQUEST_COUNT = 0
      global.__INSTANCE_INIT_TIME = Date.now()
      global.__INITIALIZED_FROM = 'timing'
    }
    
    const requestCount = ++global.__REQUEST_COUNT
    const instanceInitTime = global.__INSTANCE_INIT_TIME || Date.now()
    const isColdStart = requestCount === 1
    const instanceAge = Date.now() - instanceInitTime
    
    return {
      isColdStart,
      requestCount,
      instanceAge,
      instanceInitTime,
      initializedFrom: global.__INITIALIZED_FROM,
    }
  }
  
  export function markPageStart() {
    global.__PAGE_START_TIME = performance.now()
  }
  
  export function getPageProcessingTime(): number {
    if (!global.__PAGE_START_TIME) return 0
    return performance.now() - global.__PAGE_START_TIME
  }

  export function getInitializedFrom(): string | undefined {
    return global.__INITIALIZED_FROM
  }