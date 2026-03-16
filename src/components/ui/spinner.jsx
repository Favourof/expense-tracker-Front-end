import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Spinner = ({ className, ...props }) => (
  <Loader2 className={cn("h-5 w-5 animate-spin", className)} {...props} />
);

export default Spinner;
