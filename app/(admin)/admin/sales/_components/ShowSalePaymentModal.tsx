"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sale } from "@/@types/sale.types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Ban, Trash2 } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { Payment } from "@/@types/payment.types";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import DeleteModal from "@/components/common/DeleteModal";
import { deletePaymentById, getPaymentById } from "@/actions/SalePaymentAction";
const ShowSalePaymentModal = ({
  sale,
  open,
  toggleModal,
  onDeleteSuccess,
}: {
  sale: Sale;
  open: boolean;
  toggleModal: () => void;
  onDeleteSuccess: (
    paymentSatatus: "PAID" | "PARTIAL" | "DUE",
    paidAmount: string,
  ) => void;
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const fetchPayments = useEffectEvent(async () => {
    setLoading(true);
    try {
      const data = await getPaymentById(sale?.id, "saleId");

      if (!data?.success) throw new Error(data?.message);
      setPayments(data?.data);
    } catch (error) {
      if (error instanceof Error) setError(error?.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    let mount = true;

    if (mount) fetchPayments();

    return () => {
      mount = false;
    };
  }, [sale?.id]);

  const deletePayment = async () => {
    setDeleteLoading(true);
    try {
      const data = await deletePaymentById(selectedId!);
      if (!data?.success && !data?.errors) throw new Error(data.message);
      toast.success(data.message, {
        position: "top-right",
      });
      setPayments((prevPayment) =>
        prevPayment.filter((payment) => payment.id !== selectedId),
      );
      onDeleteSuccess(data?.data?.paymentStatus, data?.data?.paidAmount);
      setOpenDeleteModal(false);
      setSelectedId(null);
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
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading)
    content = (
      <TableRow>
        <TableCell className="text-center">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-5 w-full" />
        </TableCell>
        <TableCell align="center">
          <Skeleton className="h-5 w-full" />
        </TableCell>
      </TableRow>
    );
  else if (!loading && error)
    content = (
      <TableRow>
        <TableCell colSpan={6}>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Ban className="text-red-600" />
              </EmptyMedia>
              <EmptyTitle className="text-red-600">{error}</EmptyTitle>
              <EmptyDescription>
                Something went wrong! Please try again.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </TableCell>
      </TableRow>
    );
  else if (payments?.length === 0)
    content = (
      <TableRow>
        <TableCell colSpan={6}>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Ban />
              </EmptyMedia>
              <EmptyTitle>No payments found</EmptyTitle>
              <EmptyDescription>
                There are no payments found for this sale {sale.saleNo}.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </TableCell>
      </TableRow>
    );
  else
    content = payments?.map((payment) => (
      <TableRow key={payment.id}>
        <TableCell className="text-center">{payment.account?.name}</TableCell>
        <TableCell className="text-center">{payment.paymentNo}</TableCell>
        <TableCell className="text-center">{payment.amount}</TableCell>
        <TableCell className="text-center">{payment.change}</TableCell>
        <TableCell className="text-center">
          {new Date(payment.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell align="center">
          <Button
            variant="destructive"
            onClick={() => {
              setOpenDeleteModal(true);
              setSelectedId(payment.id);
            }}
            disabled={deleteLoading}
          >
            <Trash2 />
          </Button>
        </TableCell>
      </TableRow>
    ));

  return (
    <>
      <Dialog open={open} onOpenChange={toggleModal}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {loading ? (
                <Skeleton className="h-5 w-1/2" />
              ) : (
                `Payments for ${sale.saleNo}`
              )}
            </DialogTitle>
            <DialogDescription>
              {loading ? (
                <Skeleton className="h-5 w-full block" as="span" />
              ) : (
                "See and manage payments for this sale."
              )}
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableCaption>Payments for sale {sale.saleNo}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Account</TableHead>
                <TableHead className="text-center">Sale No</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Change</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{content}</TableBody>
            <TableFooter>
              <TableRow>
                <TableHead className="text-right" colSpan={2}>
                  Total:
                </TableHead>
                <TableHead className="text-center">
                  {payments?.reduce((a, b) => a + parseFloat(b.amount), 0)}
                </TableHead>
                <TableHead className="text-center">
                  {payments?.reduce((a, b) => a + parseFloat(b.change), 0)}
                </TableHead>
                <TableHead className="text-center">-</TableHead>
                <TableHead className="text-center">-</TableHead>
              </TableRow>
            </TableFooter>
          </Table>
        </DialogContent>
      </Dialog>
      <DeleteModal
        open={openDeleteModal}
        loading={deleteLoading}
        onOpenChange={() => setOpenDeleteModal(false)}
        action={deletePayment}
        title="Delete all payment!"
        description="Are you sure you want to delete all these payments?"
      />
    </>
  );
};

export default ShowSalePaymentModal;
