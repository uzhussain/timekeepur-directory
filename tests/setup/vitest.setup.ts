import { vi } from 'vitest'

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}))
