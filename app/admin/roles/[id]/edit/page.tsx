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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const role = await getRoleById(Number(id));
  if (!role?.success) throw new Error(role?.message);
  return {
    title: `Edit ${role?.data?.roleName} | Inventory Management System`,
    description: "Edit and manage role",
  };
}

const EditRolePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const role = await getRoleById(Number(id));
  if (!role?.success) throw new Error(role?.message);
  const modules = await getModulesWithPermission();
  if (!modules?.success) throw new Error(modules?.message);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit {role?.data?.roleName}</CardTitle>
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
        <UpdateRoleForm role={role?.data} modules={modules?.data} />
      </CardContent>
    </Card>
  );
};

export default EditRolePage;
