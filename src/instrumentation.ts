export function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const initTime = Date.now()
        
        // Mark this instance as initialized
        global.__INSTANCE_INIT_TIME = initTime
        global.__REQUEST_COUNT = 0
        global.__INITIALIZED_FROM = 'instrumentation'
        
    }
  }