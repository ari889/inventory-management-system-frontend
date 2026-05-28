"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddSalePaymentForm from "./AddSalePaymentForm";
import { Sale } from "@/@types/sale.types";
const AddSalePaymentModal = ({
  sale,
  open,
  toggleModal,
  onSuccess,
}: {
  sale: Sale;
  open: boolean;
  toggleModal: () => void;
  onSuccess: (
    paymentSatatus: "PAID" | "PARTIAL" | "DUE",
    paidAmount: string,
  ) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={toggleModal}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add new payment for sale {sale?.saleNo}</DialogTitle>
          <DialogDescription>
            Add payment for specific sale by filling up this form.
          </DialogDescription>
        </DialogHeader>
        <AddSalePaymentForm
          sale={sale}
          onSuccess={onSuccess}
          toggleModal={toggleModal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddSalePaymentModal;
