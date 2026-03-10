"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { createPortal } from "react-dom";

const DeleteModal = ({
  open,
  onOpenChange,
  action,
  title = "Delete",
  description = "Are you sure you want to delete this data?",
  loading = false,
}: {
  open: boolean;
  onOpenChange: () => void;
  action: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}) => {
  return open
    ? createPortal(
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button variant="destructive" onClick={action} disabled={loading}>
                {loading ? <Spinner data-icon="inline-start" /> : ""}
                {loading ? "Deleting..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>,
        document.body,
      )
    : null;
};

export default DeleteModal;
