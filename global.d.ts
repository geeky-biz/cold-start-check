// global.d.ts (add to your existing file)
declare global {
    var __INSTANCE_INIT_TIME: number | undefined
    var __REQUEST_COUNT: number | undefined
    var __PAGE_START_TIME: number | undefined
    var __INITIALIZED_FROM: string | undefined
    // ... your existing declarations
  }
  
  export {}