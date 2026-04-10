"use client";
import CustomAlert from "@/components/common/CustomAlert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useEffectEvent, useState } from "react";
import { createPortal } from "react-dom";
import { Customer } from "@/@types/customer.types";
import { getCustomerById } from "@/actions/CustomerAction";
import UpdateCustomerLoader from "./UpdateCustomerLoader";
import UpdateCustomerForm from "./UpdateCustomerForm";

const UpdateCustomerModal = ({
  id,
  open,
  toggleModal,
  onSuccess,
}: {
  id: number;
  open: boolean;
  toggleModal: () => void;
  onSuccess: (data: Customer) => void;
}) => {
  const [data, setData] = useState<Customer>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCustomer = useEffectEvent(async () => {
    setLoading(true);
    try {
      const data = await getCustomerById(id);
      if (!data?.success) throw new Error(data?.message);
      setData(data?.data);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) setError(error?.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      fetchCustomer();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading) content = <UpdateCustomerLoader />;
  else if (!loading && error)
    content = (
      <CustomAlert heading="Error!" message={error} variant="destructive" />
    );
  else if (!loading && !error && data)
    content = (
      <UpdateCustomerForm data={data as Customer} onSuccess={onSuccess} />
    );

  return open
    ? createPortal(
        <Dialog open={open} onOpenChange={toggleModal}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {loading ? (
                  <Skeleton className="h-5 w-1/2" />
                ) : (
                  `Edit "${data?.name}" Customer`
                )}
              </DialogTitle>
              <DialogDescription>
                {loading ? (
                  <Skeleton className="h-5 w-full block" as="span" />
                ) : (
                  "Edit and manage the customer details from here."
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
              {content}
            </div>
          </DialogContent>
        </Dialog>,
        document.body,
      )
    : null;
};

export default UpdateCustomerModal;
