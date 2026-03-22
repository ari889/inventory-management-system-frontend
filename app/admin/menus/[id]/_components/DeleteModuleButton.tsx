"use client";
import { deleteModule } from "@/actions/ModuleAction";
import DeleteModal from "@/components/common/DeleteModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const DeleteModuleButton = ({
  id,
  menuId,
  onDeleteSuccess,
}: {
  id: number;
  menuId: number;
  onDeleteSuccess: (id: number) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const deleteModal = () =>
    startTransition(async () => {
      try {
        const data = await deleteModule(id, menuId);
        if (!data.success) throw new Error(data.message);
        setOpen(false);
        onDeleteSuccess(id);
        toast.success(data.message, {
          position: "top-right",
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message, {
            position: "top-right",
          });
        } else {
          toast.error("Something went wrong!", {
            position: "top-right",
          });
        }
      }
    });

  return (
    <>
      <Button
        variant="destructive"
        size="xs"
        className="cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Trash2 />
        Delete
      </Button>
      {open && (
        <DeleteModal
          open={open}
          onOpenChange={() => setOpen((prev) => !prev)}
          action={deleteModal}
          title="Delete!"
          description="Are you sure to delete this module?"
          loading={isPending}
        />
      )}
    </>
  );
};

export default DeleteModuleButton;
