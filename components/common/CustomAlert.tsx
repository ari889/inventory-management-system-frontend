import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const CustomAlert = ({
  message,
  heading,
  variant = "default",
  className = "",
}: {
  message: string;
  heading: string;
  variant?: "default" | "destructive" | null;
  className?: string;
}) => {
  return (
    <Alert variant={variant} className={className}>
      <AlertCircleIcon />
      <AlertTitle>{heading}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default CustomAlert;
