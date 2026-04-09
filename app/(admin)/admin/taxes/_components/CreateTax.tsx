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
import { Tax } from "@/@types/tax.types";
import CreateTaxForm from "./CreateTaxForm";

const CreateTax = ({
  open,
  onSuccess,
  toggleModal,
}: {
  open: boolean;
  onSuccess: (data: Tax) => void;
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
            Create Tax <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new tax for your application.
          </DialogDescription>
        </DialogHeader>
        <CreateTaxForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTax;
