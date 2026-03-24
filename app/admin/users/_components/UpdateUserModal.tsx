"use client";
import { User } from "@/@types/user.types";
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
import UpdateUserLoader from "./UpdateUserLoader";
import UpdateUserForm from "./UpdateUserForm";
import { getUserById } from "@/actions/UserAction";

const UpdateUserModal = ({
  id,
  open,
  toggleModal,
  onSuccess,
}: {
  id: number;
  open: boolean;
  toggleModal: () => void;
  onSuccess: (data: User) => void;
}) => {
  const [data, setData] = useState<User>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = useEffectEvent(async () => {
    setLoading(true);
    try {
      const data = await getUserById(id);
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
      fetchUser();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading) content = <UpdateUserLoader />;
  else if (!loading && error)
    content = (
      <CustomAlert heading="Error!" message={error} variant="destructive" />
    );
  else if (!loading && !error && data)
    content = <UpdateUserForm data={data as User} onSuccess={onSuccess} />;

  return open
    ? createPortal(
        <Dialog open={open} onOpenChange={toggleModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {loading ? (
                  <Skeleton className="h-5 w-1/2" />
                ) : (
                  `Edit "${data?.name}"`
                )}
              </DialogTitle>
              <DialogDescription>
                {loading ? (
                  <Skeleton className="h-5 w-full block" as="span" />
                ) : (
                  "Edit and manage the user details from here."
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

export default UpdateUserModal;
