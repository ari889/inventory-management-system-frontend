import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { getModules } from "@/actions/ModuleAction";
import { Module } from "@/@types/module.types";
import CustomAlert from "@/components/common/CustomAlert";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const menus = await getModules();

  let content = null;
  if (!menus.success)
    content = (
      <div className="h-screen flex items-center justify-center m-1">
        <CustomAlert
          heading="Error happen!"
          message={menus.message}
          variant="destructive"
        />
      </div>
    );
  else if (
    !menus.data ||
    (Array.isArray(menus.data) && menus.data.length === 0)
  )
    content = (
      <div className="h-screen flex items-center justify-center m-1">
        <CustomAlert
          heading="Contact admin!"
          message="No modules found. Please contact your administrator."
          variant="default"
        />
      </div>
    );
  else content = <NavMain items={menus.data as Module[]} />;

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        {content}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
