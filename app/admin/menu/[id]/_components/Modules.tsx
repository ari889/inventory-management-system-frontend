"use client";
import { Module as ModuleType } from "@/@types/module.types";
import { Fragment } from "react/jsx-runtime";
import Module from "./Module";
import { useState } from "react";
import EditModule from "./EditModule";

const Modules = ({ modules }: { modules: ModuleType[] }) => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const openModal = (id: number) => {
    setSelectedModule(id);
    setOpen(true);
  };

  const closeModal = () => {
    setSelectedModule(null);
    setOpen(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      {modules?.map((module: ModuleType) => (
        <Fragment key={module?.id}>
          <Module module={module} openModal={openModal} />
          {module?.children?.length > 0 &&
            module?.children?.map((child: ModuleType) => (
              <Module
                key={child?.id}
                module={child}
                isChild={true}
                openModal={openModal}
              />
            ))}
        </Fragment>
      ))}
      {selectedModule && (
        <EditModule
          open={open}
          setOpen={closeModal}
          id={selectedModule}
          modules={modules}
        />
      )}
    </div>
  );
};

export default Modules;
