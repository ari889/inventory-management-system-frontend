"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { ChevronRight } from "lucide-react";
import { Module } from "@/@types/module.types";
import DynamicIcon from "@/components/common/DynamicIcon";
import { cn } from "@/lib/utils";

export function NavMain({ items }: { items: Module[] }) {
  const pathname = usePathname();

  // Store currently opened menu id
  const [openItem, setOpenItem] = useState<number | null>(() => {
    const activeItem = items.find((item) =>
      item.children?.some((c: Module) => c.url === pathname),
    );

    return activeItem?.id ?? null;
  });

  return (
    <SidebarGroup className="gap-0.5 p-0">
      {items.map((item) =>
        item.type ? (
          <SidebarGroupLabel
            key={item.id}
            className="mb-1 mt-4 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 first:mt-1"
          >
            {item.dividerTitle}
          </SidebarGroupLabel>
        ) : (
          <SidebarMenu key={item.id} className="gap-0.5">
            {item.children?.length > 0 ? (
              <SidebarMenuItem>
                <Collapsible
                  open={openItem === item.id}
                  onOpenChange={(open) => {
                    setOpenItem(open ? item.id : null);
                  }}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.moduleName as string}
                      className={cn(
                        "h-9 rounded-lg px-3 text-[13px] font-medium text-sidebar-foreground/60",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "transition-colors duration-150",
                        openItem === item.id &&
                          "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                    >
                      {item?.iconClass && (
                        <DynamicIcon
                          name={item.iconClass}
                          className="size-4 shrink-0 text-sidebar-foreground/40"
                        />
                      )}

                      <span className="flex-1">{item.moduleName}</span>

                      <ChevronRight className="size-3.5 text-sidebar-foreground/30 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <SidebarMenuSub className="ml-3 mt-0.5 border-l border-sidebar-border pl-3">
                      {item.children.map((child: Module) => (
                        <SidebarMenuSubItem key={child.id}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              "h-8 rounded-lg text-[13px] text-sidebar-foreground/50",
                              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              "transition-colors duration-150",
                              pathname === child.url &&
                                "bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/15",
                            )}
                          >
                            <Link href={child.url || "#"}>
                              {child?.iconClass && (
                                <DynamicIcon
                                  name={child.iconClass}
                                  className="size-3.5 shrink-0"
                                />
                              )}

                              <span>{child.moduleName}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.moduleName as string}
                  className={cn(
                    "h-9 rounded-lg px-3 text-[13px] font-medium text-sidebar-foreground/60",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "transition-colors duration-150",
                    pathname === item.url &&
                      "bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/15",
                  )}
                >
                  <Link href={item.url || "#"}>
                    {item?.iconClass && (
                      <DynamicIcon
                        name={item.iconClass}
                        className="size-4 shrink-0"
                      />
                    )}

                    <span>{item.moduleName}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        ),
      )}
    </SidebarGroup>
  );
}
