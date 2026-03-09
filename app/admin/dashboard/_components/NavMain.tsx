"use client";

import { DynamicIcon } from "lucide-react/dynamic";

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
import { Module } from "@/@types/module.types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function NavMain({ items }: { items: Module[] }) {
  return (
    <SidebarGroup>
      {items.map((item) =>
        item.type ? (
          <SidebarGroupLabel key={item.id}>
            {item.dividerTitle}
          </SidebarGroupLabel>
        ) : (
          <SidebarMenu id={String(item.id)} key={item.id}>
            {item?.children?.length > 0 ? (
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.moduleName as string}>
                    <DynamicIcon name="camera" />
                    <span>{item.moduleName}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item?.children?.map((child: Module) => (
                      <SidebarMenuSubItem key={child.id}>
                        <SidebarMenuSubButton asChild>
                          <a href="/url">
                            <span>{child.moduleName}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                  <Link href={item.url as string}>
                    <DynamicIcon name="camera" />
                    <span>{item.moduleName}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <Collapsible
              asChild
              defaultOpen={false}
              className="group/collapsible"
            ></Collapsible>
          </SidebarMenu>
        ),
      )}
    </SidebarGroup>
  );
}
