"use client";

import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Link from "next/link";
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

export function NavMain({ items }: { items: Module[] }) {
  return (
    <SidebarGroup>
      {items.map((item) =>
        item.type ? (
          // Divider
          <SidebarGroupLabel key={item.id}>
            {item.dividerTitle}
          </SidebarGroupLabel>
        ) : (
          // Module
          <SidebarMenu id={String(item.id)} key={item.id}>
            {item.children?.length > 0 ? (
              // Module with children → collapsible
              <SidebarMenuItem key={item.id}>
                <Collapsible defaultOpen={false} className="group/collapsible">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.moduleName as string}>
                      {/* <DynamicIcon
                        name={(item.iconClass || "camera") as IconName}
                        className="mr-2"
                      /> */}
                      <span>{item.moduleName}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((child: Module) => (
                        <SidebarMenuSubItem key={child.id}>
                          <SidebarMenuSubButton asChild>
                            <Link href={child.url || "#"}>
                              {/* <DynamicIcon
                                name={(item.iconClass || "camera") as IconName}
                                className="mr-2"
                              /> */}
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
              // Module without children → normal link
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                  <Link href={item.url || "#"}>
                    {/* <DynamicIcon
                      name={(item.iconClass || "camera") as IconName}
                      className="mr-2"
                    /> */}
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
