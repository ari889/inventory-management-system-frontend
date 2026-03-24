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
import CreateUserForm from "./CreateUserForm";
import { User } from "@/@types/user.types";

const CreateUser = ({
  open,
  onSuccess,
  toggleModal,
}: {
  open: boolean;
  onSuccess: (data: User) => void;
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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Create User <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new user for your application.
          </DialogDescription>
        </DialogHeader>
        <CreateUserForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUser;
