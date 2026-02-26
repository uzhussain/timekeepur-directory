import { getStackServerApp, isStackAuthConfigured } from "@/lib/stack-auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Only wrap with StackProvider if Stack Auth is configured
  if (isStackAuthConfigured) {
    const stackApp = await getStackServerApp()
    if (stackApp) {
      const { StackProvider, StackTheme } = await import("@stack-auth/react")
      return (
        <StackProvider app={stackApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      )
    }
  }
  
  // Fallback: render without Stack Auth wrapper
  return <>{children}</>
}
