import { useToast } from "@/components/ui/use-toast";
import { publicRequest } from "@/shared/api/request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().nonempty("First Name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
  gender: z.enum(["male", "female"]).optional(),
});

export const useSignUp = () => {
    const [imageSrc, setimageSrc] = useState();
    const [imageFile, setimageFile] = useState();
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),

  });
    console.log(form.formState.errors);

  const onSubmit = async (data) => {
    console.log(data)
    setisLoading(true);
    try {
        if (!imageFile) return alert("please upload an image");
    

    const formData = new FormData();

    formData.append("image", imageFile);
    formData.append("firstName", data.firstName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("gender", data.gender);

      const res = await publicRequest.post("/signupuser", formData)
      toast({
        title: "Success",
        description: ` Welcome to Our Website please verify your account`,
      });
      if (res.data) {
        localStorage.setItem('email', data.email)
        navigate("/otp");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Hello",
        description: error.response.data.message
      });
      if (error.response.data.error.code) {
        toast({
          title: "Hello",
          description: 'Email Already exit'
        });
      }
    } finally {
      setisLoading(false);
    }
  
  };

    function handleChange(e) {
    const file = e.target.files[0];
    //  console.log(file);
    const reader = new FileReader();
    if (file) {
      setimageFile(file);
    //   console.log(imageFile, 'hrer');
      reader.readAsDataURL(file);
      reader.onload = () => {
        setimageSrc(reader.result);
      };
    }
    // console.log(imageSrc, 'hrer');
  }


  return {
    form,
    onSubmit,
    isLoading,
    handleChange,
    imageSrc
  };
};