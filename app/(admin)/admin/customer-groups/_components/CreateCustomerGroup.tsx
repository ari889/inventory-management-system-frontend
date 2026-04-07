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
import CreateCustomerGroupForm from "./CreateCustomerGroupForm";
import { CustomerGroup } from "@/@types/customer-group.types";

const CreateCustomerGroup = ({
  open,
  onSuccess,
  toggleModal,
}: {
  open: boolean;
  onSuccess: (data: CustomerGroup) => void;
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
            Create Customer Group <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new customer group for your application.
          </DialogDescription>
        </DialogHeader>
        <CreateCustomerGroupForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerGroup;
