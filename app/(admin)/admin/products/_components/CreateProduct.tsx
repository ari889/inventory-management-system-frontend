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
import { Product } from "@/@types/product.types";
import CreateProductForm from "./CreateProductForm";

const CreateProduct = ({
  open,
  onSuccess,
  toggleModal,
}: {
  open: boolean;
  onSuccess: (data: Product) => void;
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
            Create Product <Badge>New</Badge>
          </DialogTitle>
          <DialogDescription>
            Create a new product for your application.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <CreateProductForm onSuccess={onSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProduct;
