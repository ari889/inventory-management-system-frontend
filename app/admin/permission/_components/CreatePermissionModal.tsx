"use client";
import { Permission } from "@/@types/permission.types";
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
import CreatePermission from "./CreatePermissionform";

const CreatePermissionModal = ({
  open,
  toggleModal,
  onSuccess,
}: {
  open: boolean;
  toggleModal: () => void;
  onSuccess: (data: Permission) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <CirclePlus />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Create Permissions <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new permission for your application.
          </DialogDescription>
        </DialogHeader>
        <CreatePermission onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePermissionModal;
