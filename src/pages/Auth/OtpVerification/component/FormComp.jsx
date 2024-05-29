import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import { useOTP } from "../hooks/useOTP";
// import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const FormComp = () => {
  const [value, setValue] = useState("");
  const { handleOtp, isLoading } = useOTP();


  return (
    <div className="text-center">
      <div className="bg-black-400   w-[100%] sm:mt-40 mt-1  ">
        <div className=" w-[80%] lg:w-[70%] md:w-[80%] sm:w-[80%]  h-[400px] m-auto mt-16 lg:ms-32 md:ms-18 sm:ms-14 ">
          <h1 className="lg:text-2xl font-bold md:text-2xl sm:text-2xl text-xl text-center">
            Account Verification
          </h1>
          <br />
          <div>
        
              <p className="font-light sm:font-bold text-red-600 ">
                Kindly check your email for otp Verification code
              </p>
              {/* <Input className="mt-1 mb-3" type='number'></Input> */}
              <InputOTP></InputOTP>

              <div className="space-y-2 flex items-center justify-center">
                <InputOTP
                  maxLength={5}
                  value={value}
                  onChange={(value) => setValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>{" "}
                <br />
              </div>
              <div className=" text-sm">
                {value === "" ? (
                  <>Enter your one-time password.</>
                ) : (
                  <>You entered: {value}</>
                )}
              </div>

              <div className="flex items-center justify-center ">
                <Button
                  className=" w-[50%] bg-red-600 p-3 mt-2"
                  onClick={()=> handleOtp(value)}
                  disabled={isLoading}
                  type="Submit"
                >
                  {isLoading ? "loading..." : "verify"}
                </Button>
              </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComp;
