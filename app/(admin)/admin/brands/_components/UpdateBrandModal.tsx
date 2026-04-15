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
import { Brand } from "@/@types/brand.types";
import { getBrandById } from "@/actions/BrandAction";
import UpdateBrandLoader from "./UpdateBrandLoader";
import UpdateBrandForm from "./UpdateBrandForm";

const UpdateBrandModal = ({
  id,
  open,
  toggleModal,
  onSuccess,
}: {
  id: number;
  open: boolean;
  toggleModal: () => void;
  onSuccess: (data: Brand) => void;
}) => {
  const [data, setData] = useState<Brand>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBrand = useEffectEvent(async () => {
    setLoading(true);
    try {
      const data = await getBrandById(id);
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
      fetchBrand();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading) content = <UpdateBrandLoader />;
  else if (!loading && error)
    content = (
      <CustomAlert heading="Error!" message={error} variant="destructive" />
    );
  else if (!loading && !error && data)
    content = <UpdateBrandForm data={data as Brand} onSuccess={onSuccess} />;

  return open
    ? createPortal(
        <Dialog open={open} onOpenChange={toggleModal}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {loading ? (
                  <Skeleton className="h-5 w-1/2" />
                ) : (
                  `Edit "${data?.title}" Brand`
                )}
              </DialogTitle>
              <DialogDescription>
                {loading ? (
                  <Skeleton className="h-5 w-full block" as="span" />
                ) : (
                  "Edit and manage the brand details from here."
                )}
              </DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>,
        document.body,
      )
    : null;
};

export default UpdateBrandModal;
