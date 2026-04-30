import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
    FormDescription,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import {
    Select,
    SelectContent,
    SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const GenericFormInputs = ({
  form,
  placeholder,
  type,
  label,
  required,
  description,
  name,
  options,
  itemClassName,
  controlClassName,
  labelClassName,
}) => {
  switch (type) {
    case "text":
    case "password":
    case "email":
      case "number":
        return (
          <div>
            <FormField
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className={cn("space-y-2", itemClassName)}>
                  <div className="flex items-center gap-1">
                    <FormLabel className={labelClassName}>{label}</FormLabel>
                    {required && <span className="text-red-500">*</span>}
                  </div>
                  <FormControl>
                    <Input
                      type={type}
                      placeholder={placeholder}
                      className={controlClassName}
                      {...field}
                    />
                  </FormControl>
                  {description && (
                    <FormDescription>{description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case "textarea":
        return (
          <div>
            <FormField
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className={cn("space-y-2", itemClassName)}>
                  <FormLabel className={labelClassName}>{label}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={placeholder}
                      className={cn("resize-none", controlClassName)}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
  
      case "select":
        if (options) {
          return (
            <div>
              <FormField
              control={form.control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem className={cn("space-y-2", itemClassName)}>
                    <FormLabel className={labelClassName}>{label}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={controlClassName}>
                          <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                      </FormControl>
                        <SelectContent>
                          {options?.map((opt, i) => {
                            return (
                              <SelectItem key={i} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
  
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };
  
  export default GenericFormInputs;
  
