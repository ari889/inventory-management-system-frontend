"use client";
import { Permission } from "@/@types/permission.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import CreatePermission from "./CreatePermissionform";
import { useEffect, useEffectEvent, useState } from "react";
import { getPermissionById } from "@/actions/PermissionAction";
import EditPermissionLoader from "./EditPermissionLoader";
import CustomAlert from "@/components/common/CustomAlert";
import { createPortal } from "react-dom";
import { Skeleton } from "@/components/ui/skeleton";
import EditPermissionForm from "./EditPermissionForm";

const EditPermissionModal = ({
  id,
  open,
  toggleModal,
  onSuccess,
}: {
  id: number;
  open: boolean;
  toggleModal: () => void;
  onSuccess: (data: Permission) => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<Permission>();
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * fetch permission by id
   */
  const fetchPermission = useEffectEvent(async () => {
    try {
      const response = await getPermissionById(id);

      if (!response?.success) throw new Error(response?.message);

      setPermission(response?.data);
    } catch (error) {
      if (error instanceof Error) setError(error?.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  });

  /**
   * effect for fetch permission
   */
  useEffect(() => {
    let mount = true;

    if (mount) fetchPermission();

    return () => {
      mount = false;
    };
  }, [id]);

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading) content = <EditPermissionLoader />;
  else if (!loading && error)
    content = (
      <CustomAlert heading="Error!" message={error} variant="destructive" />
    );
  else if (!loading && !error && permission)
    content = (
      <EditPermissionForm onSuccess={onSuccess} permission={permission} />
    );

  return id && open
    ? createPortal(
        <Dialog open={open} onOpenChange={toggleModal}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {loading ? (
                  <Skeleton className="h-5 w-1/2" />
                ) : (
                  permission?.name
                )}
              </DialogTitle>
              <DialogDescription>
                {loading ? (
                  <Skeleton className="h-5 w-1/2" as="span" />
                ) : (
                  "Create a new permission for your application."
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

export default EditPermissionModal;
