'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/glass/dropdown-menu'
import { useSession, signOut } from '@/lib/auth-client'

export function UserMenu() {
  const router = useRouter()
  const { data: session } = useSession()

  if (!session) return null

  const { user } = session
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase()

  async function handleSignOut() {
    await signOut()
    router.push('/sign-in')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="User menu"
            className="rounded-full glass hover:bg-transparent hover:opacity-70 active:scale-95 size-9"
          >
            <span className="text-[11px] font-semibold text-foreground/70 font-heading select-none">
              {initials}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="w-52 bg-transparent glass-lg ring-0 shadow-none rounded-xl"
      >
        <div className="flex flex-col gap-0.5 px-2 py-1.5">
          <span className="text-sm font-semibold truncate">{user.name}</span>
          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
