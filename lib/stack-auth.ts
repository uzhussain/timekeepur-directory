import "server-only"

// Check if Stack Auth is configured
const isStackAuthConfigured = !!(
  process.env.NEXT_PUBLIC_STACK_PROJECT_ID &&
  process.env.STACK_SECRET_SERVER_KEY
)

// Lazy initialization to avoid initialization errors when env vars are missing
let _stackServerApp: any = null

export async function getStackServerApp() {
  if (!isStackAuthConfigured) {
    return null
  }
  
  if (!_stackServerApp) {
    const { StackServerApp } = await import("@stack-auth/stack")
    _stackServerApp = new StackServerApp({
      tokenStore: "nextjs-cookie",
    })
  }
  
  return _stackServerApp
}

export { isStackAuthConfigured }
