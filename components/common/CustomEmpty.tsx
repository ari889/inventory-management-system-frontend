import { LucideIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

const typeToColor = {
  success: "text-green-600",
  info: "text-blue-600",
  warning: "text-yellow-600",
  error: "text-red-600",
};

const typeToBg = {
  success: "bg-green-200",
  info: "bg-blue-200",
  warning: "bg-yellow-200",
  error: "bg-red-200",
};

const CustomEmpty = ({
  icon: Icon,
  title,
  type = "success",
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  type?: "success" | "info" | "warning" | "error";
  description?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className={typeToBg[type]}>
          <Icon className={typeToColor[type]} />
        </EmptyMedia>
        <EmptyTitle className={typeToColor[type]}>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {children}
      </EmptyContent>
    </Empty>
  );
};

export default CustomEmpty;
