import { getMenuById } from "@/actions/MenuAction";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Modules from "./_components/Modules";
import { getModuleByMenuId } from "@/actions/ModuleAction";
import CreateModule from "./_components/CreateModule";

const MenuBuilderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const menu = await getMenuById(Number(id));
  if (!menu?.success) throw new Error(menu?.message);
  const modules = await getModuleByMenuId(Number(id));
  if (!modules?.success) throw new Error(modules?.message);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{menu?.data?.menuName}</CardTitle>
        <CardDescription>Add and manage module for your menu.</CardDescription>
        <CardAction>
          <ButtonGroup>
            <Button asChild variant="secondary">
              <Link href="/admin/menu">
                <ArrowLeft />
                Back
              </Link>
            </Button>
            <CreateModule modules={modules?.data} id={Number(id)} />
          </ButtonGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Modules modules={modules?.data} />
      </CardContent>
    </Card>
  );
};

export default MenuBuilderPage;
