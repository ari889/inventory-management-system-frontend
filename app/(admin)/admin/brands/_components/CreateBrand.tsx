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
import { Brand } from "@/@types/brand.types";
import CreateBrandForm from "./CreateBrandForm";

const CreateBrand = ({
  open,
  onSuccess,
  toggleModal,
}: {
  open: boolean;
  onSuccess: (data: Brand) => void;
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
            Create Brand <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new brand for your application.
          </DialogDescription>
        </DialogHeader>
        <CreateBrandForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBrand;
