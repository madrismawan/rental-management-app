"use client";

import * as React from "react";
import { NavUser } from "./nav-user";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SearchBar } from "@/components/common/search-bar";
import { SidebarData, SidebarItem } from "./sidebar/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Collapsible } from "@radix-ui/react-collapsible";
import { User } from "@/lib/api/resource/user";

export function Sidebar({
  user,
  ...props
}: React.ComponentProps<typeof SidebarComponent> & { user: User }) {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <SidebarComponent collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser
              className="rounded-md shadow-md p-1 bg-white"
              user={user}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SearchBar
            searchOptions={Object.values(SidebarData).flat()}
            onSelect={(item: SidebarItem) => {
              handleNavigation(item.url);
            }}
          />
        </SidebarGroup>
        {Object.keys(SidebarData).map((key) => {
          return (
            <SidebarGroup
              key={key}
              className="group-data-[collapsible=icon]:hidden py-0"
            >
              <SidebarGroupLabel className="font-semibold">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SidebarGroupLabel>
              <SidebarMenu>
                {SidebarData[key as keyof typeof SidebarData].map(
                  (item: SidebarItem) => (
                    <React.Fragment key={item.title}>
                      {(item.items?.length ?? 0) > 0 ? (
                        <Collapsible asChild className="group/collapsible">
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={item.title}>
                                <item.icon />
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              {item.items && (
                                <SidebarMenuSub>
                                  {item.items.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton asChild>
                                        <Link href={subItem.url}>
                                          <span>{subItem.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              )}
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      ) : (
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild>
                            <Link href={item.url}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </React.Fragment>
                  ),
                )}
              </SidebarMenu>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </SidebarComponent>
  );
}
