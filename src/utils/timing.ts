// src/lib/timing.ts
export interface TimingData {
    isColdStart: boolean
    requestCount: number
    instanceAge: number
    instanceInitTime: number
  }
  
  export function getTimingData(): TimingData {
    // Initialize if not already done
    if (typeof global.__REQUEST_COUNT === 'undefined') {
      global.__REQUEST_COUNT = 0
      global.__INSTANCE_INIT_TIME = Date.now()
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
    }
  }
  
  export function markPageStart() {
    global.__PAGE_START_TIME = performance.now()
  }
  
  export function getPageProcessingTime(): number {
    if (!global.__PAGE_START_TIME) return 0
    return performance.now() - global.__PAGE_START_TIME
  }