import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import UpdateRoleForm from "./_components/UpdateRoleForm";
import { getRoleById } from "@/actions/RoleAction";
import { getModulesWithPermission } from "@/actions/ModuleAction";
import type { Metadata } from "next";
import { ButtonGroup } from "@/components/ui/button-group";
import { handleResponse } from "@/utils/handle-response";
import { Role } from "@/@types/role.types";
import { Module } from "@/@types/module.types";
import { getSettings } from "@/actions/SettingsAction";
import { Setting } from "@/@types/settings.types";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const { data } = handleResponse<Setting[]>(await getSettings());
  const { id } = await params;
  const role = handleResponse<Role>(await getRoleById(Number(id)));
  return {
    title: `Edit ${role?.data?.roleName} | ${data.find((s) => s.name === "title")?.value || "Inventory Management System"}`,
    description: "Edit and manage role",
  };
};

const EditRolePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { data } = handleResponse<Role>(await getRoleById(Number(id)));
  const { data: modules } = handleResponse<Module[]>(
    await getModulesWithPermission(),
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {data?.roleName}</CardTitle>
        <CardDescription>Edit and Manage role</CardDescription>
        <CardAction>
          <ButtonGroup>
            <Button variant="outline" asChild>
              <Link href="/admin/roles">
                <ArrowLeft />
                Back
              </Link>
            </Button>
            <Button variant="default" asChild>
              <Link href={`/admin/roles/${id}/view`}>
                <Eye />
                View
              </Link>
            </Button>
          </ButtonGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <UpdateRoleForm role={data} modules={modules} />
      </CardContent>
    </Card>
  );
};

export default EditRolePage;
