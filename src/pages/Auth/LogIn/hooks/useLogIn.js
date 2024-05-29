import { useToast } from "@/components/ui/use-toast";
import { publicRequest } from "@/shared/api/request";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
// import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

export const useLogIn = () => {
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  console.log(form.formState.errors);

  const onSubmit = async (data) => {
    // console.log(data);
    setisLoading(true);
    try {
      const res = await publicRequest.post('/loginuser', data)
      toast({
        title: "Success",
        description: ` Log In Succesfully`,
      });
      
      if (res.data) {
         localStorage.setItem('token', res.data.token )
 
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Hello",
        description: error.response.data.message,
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
