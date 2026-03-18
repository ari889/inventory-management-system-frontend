"use client";
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
import CreateMenuForm from "./CreateMenuForm";
import { Menu } from "@/@types/menu.types";

const CreateMenu = ({
  open,
  onSuccess,
  toggleModal,
}: {
  open: boolean;
  onSuccess: (data: Menu) => void;
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
            Create Menu <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new menu for your application.
          </DialogDescription>
        </DialogHeader>
        <CreateMenuForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMenu;
