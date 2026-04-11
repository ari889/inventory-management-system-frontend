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
import { ExpenseCategory } from "@/@types/expense-category.types";
import { getExpenseCategoryById } from "@/actions/ExpenseCategoryAction";
import UpdateExpenseCategoryLoader from "./UpdateExpenseCategoryLoader";
import UpdateExpenseCategoryForm from "./UpdateExpenseCategoryForm";

const UpdateExpenseCategoryModal = ({
  id,
  open,
  toggleModal,
  onSuccess,
}: {
  id: number;
  open: boolean;
  toggleModal: () => void;
  onSuccess: (data: ExpenseCategory) => void;
}) => {
  const [data, setData] = useState<ExpenseCategory>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchExpenseCategory = useEffectEvent(async () => {
    setLoading(true);
    try {
      const data = await getExpenseCategoryById(id);
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
      fetchExpenseCategory();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading) content = <UpdateExpenseCategoryLoader />;
  else if (!loading && error)
    content = (
      <CustomAlert heading="Error!" message={error} variant="destructive" />
    );
  else if (!loading && !error && data)
    content = (
      <UpdateExpenseCategoryForm
        data={data as ExpenseCategory}
        onSuccess={onSuccess}
      />
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
                  `Edit "${data?.name}" Expense Category`
                )}
              </DialogTitle>
              <DialogDescription>
                {loading ? (
                  <Skeleton className="h-5 w-full block" as="span" />
                ) : (
                  "Edit and manage the expense category details from here."
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

export default UpdateExpenseCategoryModal;
