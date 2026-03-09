import CustomAlert from "./CustomAlert";

const TableAlert = ({
  message,
  colspan = 5,
  variant = "default",
  heading = "Info!",
  className = "",
}: {
  message: string;
  colspan?: number;
  variant?: "default" | "destructive" | null;
  heading?: string;
  className?: string;
}) => {
  return (
    <tr>
      <td colSpan={colspan} className="p-3">
        <CustomAlert
          message={message}
          heading={heading}
          variant={variant}
          className={className}
        />
      </td>
    </tr>
  );
};

export default TableAlert;
