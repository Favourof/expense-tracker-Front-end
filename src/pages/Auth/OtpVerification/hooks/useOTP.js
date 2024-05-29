import { useToast } from "@/components/ui/use-toast";
import { publicRequest } from "@/shared/api/request";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useOTP = () => {
    const [isLoading, setisLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
  
    const handleOtp = async (value) => {
      console.log(value);
      const email = localStorage.getItem('email')
      const data = {
         email,
        otps: value,
      }
     
      setisLoading(true);
      try {
        const res = await publicRequest.post('/verifyotp', data )
        toast({
          title: "Success",
          description: ` your account is successfully verified please login`,
        });
        if (res.data) {
         localStorage.removeItem('email')
          navigate("/login");
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
        handleOtp,
        isLoading
    };
  };