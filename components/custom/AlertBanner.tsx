import { Rocket, Terminal, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface AlertBannerProps {
  isCompleted: boolean;
  missingFieldCount: number;
  requiredFieldsCount: number;
  page?: string;
}
const AlertBanner = ({ isCompleted, missingFieldCount, requiredFieldsCount, page }: AlertBannerProps) => {
  return (
    <Alert className="my-4" variant={`${isCompleted ? "complete" : "destructive"}`}>
      {isCompleted ? <Rocket className="w-4 h-4" /> : <TriangleAlert className="w-4 h-4" />}
      <Terminal className="h-4 w-4" />
      <AlertTitle className=" text-xs font-medium">
        {missingFieldCount} missing field(s) / {requiredFieldsCount} required field(s)
      </AlertTitle>
      <AlertDescription className="text-xs">{isCompleted ? "Great job! Ready to publish" : "You can only publish when all the required fields all completed"}</AlertDescription>
    </Alert>
  );
};

export default AlertBanner;
