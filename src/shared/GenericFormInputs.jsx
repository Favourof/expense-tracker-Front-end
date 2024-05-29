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
  
  const GenericFormInputs = ({
    form,
    placeholder,
    type,
    label,
    required,
    description,
    name,
    options,
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
                <FormItem>
                  <div>
                    <FormLabel>{label}</FormLabel>
                    {required && <span className="w-4 h-4 text-red-500">*</span>}
                  </div>
                  <FormControl>
                    <Input type={type} placeholder={placeholder} {...field} />
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
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={placeholder}
                      className="resize-none"
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
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
  