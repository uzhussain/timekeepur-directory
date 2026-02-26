import { StackProvider, StackTheme } from "@stack-auth/react"
import { stackServerApp } from "@/lib/stack-auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackProvider>
  )
}
