import { Form } from "@/components/ui/form";
import { useLogIn } from "../hooks/useLogIn";
import { Button } from "@/components/ui/button";
import google from "/src/assets/google.png";
import facebook from "/src/assets/facebook.png";
import {Link} from "react-router-dom"
import { inputs } from "../utils/inputs";
import GenericFormInputs from "@/shared/GenericFormInputs";
const LogInForm = () => {
  const { onSubmit, form, isLoading } = useLogIn();
  return (
    <div>
      <div className="bg-black-400   w-[100%]">
        <div className=" w-[80%] lg:w-[70%] md:w-[80%] sm:w-[80%]  h-[400px] m-auto mt-16 lg:ms-32 md:ms-18 sm:ms-14 ">
          <h1 className="lg:text-2xl font-bold md:text-2xl sm:text-2xl text-xl">
            LogIn for an Account
          </h1>{" "}
          <br />
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {inputs.map((elem, i) => (
                  <GenericFormInputs
                    key={i + elem.name}
                    form={form}
                    {...elem}
                  />
                ))}

                <p className="mb-3 text-sm">
                  Your password must have at least 6 characters
                </p>
                
                <div className="flex items-center justify-center ">
                  <Button
                    className=" w-full bg-green-400 p-3"
                    disabled={isLoading}
                    type="Submit"
                  >
                    {isLoading ? "loading..." : "Log In"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <div className="flex items-center justify-center mt-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className=" text-gray-500">or Log In with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="lg:flex items-center justify-center md:flex items-center justify-center  sm:flex items-center justify-center block items-center m-auto w-[80%] mt-4">
            <img src={google} alt="" />
            <img
              className="lg:ps-2 md:ps-2 sm:ps-2 ps-0"
              src={facebook}
              alt=""
            />
          </div>
          <div className="flex items-center justify-center mt-4">
            <p>create An Account?</p>
            <Link className="text-green-600 font-bold cursor-pointer" to={"/signup"}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
