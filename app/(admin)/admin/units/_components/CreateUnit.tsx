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
import { Unit } from "@/@types/unit.types";
import CreateUnitForm from "./CreateUnitForm";

const CreateUnit = ({
  open,
  onSuccess,
  toggleModal,
}: {
  open: boolean;
  onSuccess: (data: Unit) => void;
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
            Create Unit <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new unit for your application.
          </DialogDescription>
        </DialogHeader>
        <CreateUnitForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateUnit;
