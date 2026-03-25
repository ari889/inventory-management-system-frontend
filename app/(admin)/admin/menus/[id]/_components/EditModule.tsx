"use client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createPortal } from "react-dom";
import EditModuleForm from "./EditModalForm";
import { Module } from "@/@types/module.types";
import { useEffect, useEffectEvent, useState } from "react";
import { getModule } from "@/actions/ModuleAction";
import UpdateModuleLoader from "./UpdateModuleLoader";
import CustomAlert from "@/components/common/CustomAlert";

const EditModule = ({
  open,
  onSuccess,
  onClose,
  id,
  modules,
}: {
  open: boolean;
  onSuccess: (module: Module) => void;
  onClose: () => void;
  id: number;
  modules: Module[];
}) => {
  const [module, setModule] = useState<Module>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModule = useEffectEvent(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getModule(id);
      if (!data?.success) throw new Error(data?.message);
      setModule(data?.data);
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
      fetchModule();
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * decide what to be rendered
   */
  let content = null;

  if (loading) content = <UpdateModuleLoader />;
  else if (!loading && error)
    content = (
      <CustomAlert heading="Error!" message={error} variant="destructive" />
    );
  else if (!loading && !error && module)
    content = (
      <EditModuleForm
        modules={modules}
        id={id}
        module={module}
        onSuccess={onSuccess}
      />
    );

  return open
    ? createPortal(
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Create Module <Badge>New</Badge>
              </DialogTitle>
              <DialogDescription>
                Create a new module for your application.
              </DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>,
        document.body,
      )
    : null;
};

export default EditModule;
