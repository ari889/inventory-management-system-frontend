"use client";
import { Menu } from "@/@types/menu.types";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateModule from "./CreateModule";
import Modules from "./Modules";
import { Module } from "@/@types/module.types";
import { useEffect, useEffectEvent, useState } from "react";
import { getModuleByMenuId } from "@/actions/ModuleAction";
import ModulesSkeleton from "./ModuelesSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MenuBuilder = ({ menu, id }: { menu: Menu; id: number }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * fetch modules by menu id
   */
  const fetchModules = useEffectEvent(async () => {
    try {
      const response = await getModuleByMenuId(id);

      if (!response?.success) throw new Error(response.message);
      setModules(response?.data);
    } catch (error) {
      if (error instanceof Error) setError(error?.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  });

  /**
   * effect for fetch modules
   */
  useEffect(() => {
    let mount = true;

    if (mount) fetchModules();

    return () => {
      mount = false;
    };
  }, [id]);

  /**
   * decide what to be rendered
   */
  let content: React.ReactNode = null;

  if (loading) {
    content = <ModulesSkeleton />;
  } else if (error) {
    content = (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load modules</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  } else {
    content = <Modules modules={modules} setModules={setModules} menuId={id} />;
  }

  return (
    <>
      <CardHeader>
        <CardTitle>{menu?.menuName}</CardTitle>
        <CardDescription>Add and manage module for your menu.</CardDescription>
        <CardAction>
          <ButtonGroup>
            <Button asChild variant="secondary">
              <Link href="/admin/menu">
                <ArrowLeft />
                Back
              </Link>
            </Button>
            <CreateModule
              id={Number(id)}
              modules={modules}
              setModules={setModules}
            />
          </ButtonGroup>
        </CardAction>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </>
  );
};

export default MenuBuilder;
