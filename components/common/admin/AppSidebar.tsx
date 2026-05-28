import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { getModules } from "@/actions/ModuleAction";
import { Module } from "@/@types/module.types";
import CustomAlert from "@/components/common/CustomAlert";
import { getUser } from "@/actions/AuthAction";
import { NavUser } from "./NavUser";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser();
  const menus = await getModules();

  let content = null;
  if (!menus.success)
    content = (
      <div className="flex flex-1 items-center justify-center p-4">
        <CustomAlert
          heading="Error happened!"
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
      <div className="flex flex-1 items-center justify-center p-4">
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
      <SidebarHeader className="border-b border-sidebar-border pb-3">
        <NavUser user={user?.data} />
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">{content}</SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
