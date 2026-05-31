"use client";

import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Sparkles,
  Settings,
  UserLock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { User } from "@/@types/user.types";
import Link from "next/link";

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();

  const name = user?.name ?? "Unknown User";
  const email = user?.email ?? "";
  const image = user?.avatar ?? "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-12 rounded-xl px-3 transition-colors hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                  alt={name}
                />
                <AvatarFallback className="rounded-lg bg-sidebar-primary/20 text-[12px] font-semibold text-sidebar-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-[13px] font-medium text-sidebar-foreground">
                  {name}
                </span>
                <span className="truncate text-[11px] text-sidebar-foreground/50">
                  {email}
                </span>
              </div>

              {/* Online indicator */}
              <span className="relative mr-1 flex size-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-60 rounded-xl border border-border bg-popover p-1.5 shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            {/* Profile header */}
            <DropdownMenuLabel className="p-0">
              <div className="flex items-center gap-2.5 rounded-lg px-2 py-2.5">
                <Avatar className="size-9 rounded-lg">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API_URL}${image}`}
                    alt={name}
                  />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-[12px] font-semibold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 leading-tight">
                  <span className="truncate text-[13px] font-medium text-foreground">
                    {name}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {[
                { icon: BadgeCheck, label: "Profile", link: "/admin/profile" },
                { icon: UserLock, label: "Privacy", link: "/admin/privacy" },
                { icon: CreditCard, label: "Billing", link: "/admin/accounts" },
                {
                  icon: Bell,
                  label: "Product Quantity ALert",
                  link: "/admin/reports/product-quantity-alert",
                },
                { icon: Settings, label: "Settings", link: "/admin/settings" },
              ].map(({ icon: Icon, label, link }) => (
                <DropdownMenuItem
                  key={label}
                  className="cursor-pointer gap-2.5 rounded-lg px-2 py-2 text-[13px]"
                  asChild
                >
                  <Link href={link}>
                    <Icon className="size-4 text-muted-foreground" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
              className="cursor-pointer gap-2.5 rounded-lg px-2 py-2 text-[13px] text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
