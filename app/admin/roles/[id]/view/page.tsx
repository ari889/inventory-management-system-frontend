import { Module } from "@/@types/module.types";
import { Permission } from "@/@types/permission.types";
import { getModulesWithPermission } from "@/actions/ModuleAction";
import { getRoleById } from "@/actions/RoleAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  ArrowLeft,
  CircleCheckBig,
  CircleX,
  Eye,
  SquarePen,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const role = await getRoleById(Number(id));
  if (!role?.success) throw new Error(role?.message);
  return {
    title: `View ${role?.data?.roleName} | Inventory Management System`,
    description: "View and manage role",
  };
}

const ViewRolePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const role = await getRoleById(Number(id));
  if (!role?.success) throw new Error(role?.message);
  const modules = await getModulesWithPermission();
  if (!modules?.success) throw new Error(modules?.message);

  const moduleRoles =
    role?.data?.moduleRole?.map((m: { module: Module }) => m?.module?.id) ?? [];
  const permissionRoles =
    role?.data?.permissionRole?.map(
      (m: { permission: Permission }) => m?.permission?.id,
    ) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{role?.data?.roleName}</CardTitle>
        <CardDescription>
          View and manage {role?.data?.roleName}
        </CardDescription>
        <CardAction>
          <ButtonGroup>
            <Button variant="outline" asChild>
              <Link href="/admin/roles">
                <ArrowLeft /> Back
              </Link>
            </Button>
            <Button variant="default" asChild>
              <Link href={`/admin/roles/${id}/edit`}>
                <SquarePen /> Edit
              </Link>
            </Button>
          </ButtonGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col gap-6">
          <ItemGroup className="gap-4">
            {modules?.data?.map((module: Module) => (
              <Fragment key={module?.id}>
                <Item
                  variant="outline"
                  asChild
                  role="listitem"
                  className={`${moduleRoles?.includes(module?.id) ? "border-green-600 bg-green-200/30" : "border-red-600 bg-red-200/30"}`}
                >
                  <div>
                    <ItemMedia
                      variant="icon"
                      className={`${moduleRoles?.includes(module?.id) ? "border-green-500 text-white bg-green-500" : "border-red-500 text-white bg-red-500"}`}
                    >
                      {moduleRoles?.includes(module?.id) ? (
                        <CircleCheckBig />
                      ) : (
                        <CircleX />
                      )}
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="line-clamp-1">
                        {module?.moduleName}
                      </ItemTitle>
                      <ItemDescription>
                        {module?.deletable ? (
                          <Badge variant="default">
                            <CircleCheckBig />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <CircleX />
                            No
                          </Badge>
                        )}
                      </ItemDescription>
                    </ItemContent>
                  </div>
                </Item>
                <ItemGroup className="gap-4 ml-10">
                  {module?.permissions?.map((permission: Permission) => (
                    <Fragment key={permission?.id}>
                      <Item
                        variant="outline"
                        asChild
                        role="listitem"
                        className={`${permissionRoles?.includes(permission?.id) ? "border-green-600 bg-green-200/30" : "border-red-600 bg-red-200/30"}`}
                      >
                        <div>
                          <ItemMedia
                            variant="icon"
                            className={`${permissionRoles?.includes(permission?.id) ? "border-green-500 text-white bg-green-500" : "border-red-500 text-white bg-red-500"}`}
                          >
                            {permissionRoles?.includes(permission?.id) ? (
                              <CircleCheckBig />
                            ) : (
                              <CircleX />
                            )}
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle className="line-clamp-1">
                              {permission?.name}{" "}
                              <span className="text-muted-foreground">
                                {permission?.slug}
                              </span>
                            </ItemTitle>
                            <ItemDescription>
                              Deletable:{" "}
                              {module?.deletable ? (
                                <Badge variant="default">
                                  <CircleCheckBig />
                                  Yes
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <CircleX />
                                  No
                                </Badge>
                              )}
                            </ItemDescription>
                          </ItemContent>
                        </div>
                      </Item>
                    </Fragment>
                  ))}
                </ItemGroup>
              </Fragment>
            ))}
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewRolePage;
