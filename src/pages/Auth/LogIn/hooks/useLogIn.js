import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

export const useLogIn = () => {
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setisLoading(true);
    try {
      await login(data);
      toast({
        title: "Success",
        description: "Log In Successfully",
      });
      const from = location.state?.from;
      const destination = from
        ? `${from.pathname || ""}${from.search || ""}${from.hash || ""}`
        : "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      toast({
        title: "Hello",
        description: error?.response?.data?.message || "Login failed",
      });
    } finally {
      setisLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
  };
};
