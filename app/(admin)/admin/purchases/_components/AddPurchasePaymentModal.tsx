"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddPurchasePaymentForm from "./AddPurchasePaymentForm";
import { Purchase } from "@/@types/purchase.types";
const AddPurchasePaymentModal = ({
  purchase,
  open,
  toggleModal,
  onSuccess,
}: {
  purchase: Purchase;
  open: boolean;
  toggleModal: () => void;
  onSuccess: (paymentSatatus: boolean, paidAmount: string) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Add new payment for purchase {purchase?.purchaseNo}
          </DialogTitle>
          <DialogDescription>
            Add payment for specific purchase by filling up this form.
          </DialogDescription>
        </DialogHeader>
        <AddPurchasePaymentForm
          purchase={purchase}
          onSuccess={onSuccess}
          toggleModal={toggleModal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddPurchasePaymentModal;
