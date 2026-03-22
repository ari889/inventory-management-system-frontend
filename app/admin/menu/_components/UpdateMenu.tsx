"use client";
import { Menu } from "@/@types/menu.types";
import { getMenuById } from "@/actions/MenuAction";
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
import UpdateMenuForm from "./UpdateMenuForm";
import UpdateFromLoader from "./UpdateFromLoader";

const UpdateMenu = ({
  id,
  open,
  toggleModal,
  onSuccess,
}: {
  id: number;
  open: boolean;
  toggleModal: () => void;
  onSuccess: (data: Menu) => void;
}) => {
  const [data, setData] = useState<Menu>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMenu = useEffectEvent(async () => {
    setLoading(true);
    try {
      const data = await getMenuById(id);
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
      fetchMenu();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading) content = <UpdateFromLoader />;
  else if (!loading && error)
    content = (
      <CustomAlert heading="Error!" message={error} variant="destructive" />
    );
  else if (!loading && !error && data)
    content = <UpdateMenuForm data={data as Menu} onSuccess={onSuccess} />;

  return open
    ? createPortal(
        <Dialog open={open} onOpenChange={toggleModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {loading ? (
                  <Skeleton className="h-5 w-1/2" />
                ) : (
                  `Edit "${data?.menuName}"`
                )}
              </DialogTitle>
              <DialogDescription>
                {loading ? (
                  <Skeleton className="h-5 w-full block" as="span" />
                ) : (
                  "Edit and manage the menu"
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

export default UpdateMenu;
