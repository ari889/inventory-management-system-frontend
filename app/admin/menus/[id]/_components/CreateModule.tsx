"use client";

import { Module } from "@/@types/module.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import CreateModuleForm from "./CreateModuleForm";
import { useState } from "react";

const CreateModule = ({
  modules,
  id,
  setModules,
}: {
  modules: Module[];
  id: number;
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
}) => {
  const [open, setOpen] = useState(false);

  const onSuccess = (module: Module) => {
    setOpen(false);
    setModules((prev) => [module, ...prev]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <CirclePlus />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Module <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new module for your application.
          </DialogDescription>
        </DialogHeader>
        <CreateModuleForm modules={modules} id={id} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateModule;
