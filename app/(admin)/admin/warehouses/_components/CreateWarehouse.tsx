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
import CreateWarehouseForm from "./CreateWarehouseForm";
import { Warehouse } from "@/@types/warehouse.types";

const CreateWarehouse = ({
  open,
  onSuccess,
  toggleModal,
}: {
  open: boolean;
  onSuccess: (data: Warehouse) => void;
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
            Create Warehouse <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new warehouse for your application.
          </DialogDescription>
        </DialogHeader>
        <CreateWarehouseForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWarehouse;
