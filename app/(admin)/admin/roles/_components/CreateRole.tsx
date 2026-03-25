"use client";
import { Role } from "@/@types/role.types";
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
import CreateRoleForm from "./CreateRoleForm";

const CreateRole = ({
  open,
  onSuccess,
  toggleModal,
}: {
  open: boolean;
  onSuccess: (data: Role) => void;
  toggleModal: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <CirclePlus />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Role <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new role for your application.
          </DialogDescription>
        </DialogHeader>
        <CreateRoleForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateRole;
