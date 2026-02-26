import "server-only"
import { StackServerApp } from "@stack-auth/stack"

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
})
