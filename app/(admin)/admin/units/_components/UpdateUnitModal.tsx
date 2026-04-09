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
import { Unit } from "@/@types/unit.types";
import { getUnitById } from "@/actions/UnitAction";
import UpdateUnitLoader from "./UpdateUnitLoader";
import UpdateUnitForm from "./UpdateUnitForm";

const UpdateUnitModal = ({
  id,
  open,
  toggleModal,
  onSuccess,
}: {
  id: number;
  open: boolean;
  toggleModal: () => void;
  onSuccess: (data: Unit) => void;
}) => {
  const [data, setData] = useState<Unit>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUnit = useEffectEvent(async () => {
    setLoading(true);
    try {
      const data = await getUnitById(id);
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
      fetchUnit();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading) content = <UpdateUnitLoader />;
  else if (!loading && error)
    content = (
      <CustomAlert heading="Error!" message={error} variant="destructive" />
    );
  else if (!loading && !error && data)
    content = <UpdateUnitForm data={data as Unit} onSuccess={onSuccess} />;

  return open
    ? createPortal(
        <Dialog open={open} onOpenChange={toggleModal}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {loading ? (
                  <Skeleton className="h-5 w-1/2" />
                ) : (
                  `Edit "${data?.unitName}" Unit`
                )}
              </DialogTitle>
              <DialogDescription>
                {loading ? (
                  <Skeleton className="h-5 w-full block" as="span" />
                ) : (
                  "Edit and manage the unit details from here."
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

export default UpdateUnitModal;
