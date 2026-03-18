"use client";
import { Module as ModuleType } from "@/@types/module.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Grip, SquarePen } from "lucide-react";
import DeleteModuleButton from "./DeleteModuleButton";
import DynamicIcon from "@/components/common/DynamicIcon";

const Module = ({
  module,
  isChild = false,
  openModal,
}: {
  module: ModuleType;
  isChild?: boolean;
  openModal?: (id: number) => void;
}) => {
  return (
    <div
      className={`border rounded grid grid-cols-[auto_1fr] overflow-hidden bg-white ${isChild ? "ml-10" : ""}`}
    >
      <div className="bg-gray-100 flex items-center justify-center aspect-square h-full cursor-grab">
        <Grip className="w-5 h-5 text-gray-500" />
      </div>
      <div className="flex flex-row justify-between items-center px-3 py-2">
        <div>
          <h3 className="font-medium flex flex-row items-center space-x-2 mb-1">
            {module?.iconClass ? (
              <DynamicIcon name={module?.iconClass} />
            ) : null}
            <span>{module?.moduleName ?? module?.dividerTitle}</span>
            {module?.url && (
              <Badge variant="outline">Path: {module?.url}</Badge>
            )}
          </h3>
          <div className="flex flex-row items-center space-x-2">
            <Badge variant={module?.type ? "destructive" : "default"}>
              {module?.type ? "Divider" : "Module"}
            </Badge>
          </div>
        </div>
        <ButtonGroup>
          <Button
            size="xs"
            className="cursor-pointer"
            onClick={() => openModal?.(module?.id)}
          >
            <SquarePen />
            Edit
          </Button>
          <DeleteModuleButton id={module?.id} menuId={module?.menuId} />
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Module;
