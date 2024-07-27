
import { Form } from "@/components/ui/form";
import { useSignUp } from "../hooks/useSignUP";
import { Button } from "@/components/ui/button";
import google from '/src/assets/google.png'
import facebook from '/src/assets/facebook.png'
import { inputs } from "../utils/inputs";
import {Link} from "react-router-dom"
import GenericFormInputs from "@/shared/GenericFormInputs";
const SignupForm = () => {
  const { onSubmit, form, isLoading, handleChange, imageSrc } = useSignUp()
  return (
    <div>
     
    <div className='bg-black-400   w-[100%]'>
          <div className=' w-[80%] lg:w-[70%] md:w-[80%] sm:w-[80%]  h-[400px] m-auto mt-16 lg:ms-32 md:ms-18 sm:ms-14 ' >
            <h1 className='lg:text-2xl font-bold md:text-2xl sm:text-2xl text-xl'>Sign Up for an Account</h1> <br />
            <div >
      <Form {...form}>
      <div className="flex gap-5">
            <label htmlFor="">Profile picture</label> <br />
      <input
        type="file"
        placeholder="Enter your text"
        className="px-5 pt-2 w-44 bg-white border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-lg transition-shadow duration-300"
        onChange={handleChange}
      />
      <img src={imageSrc} className="w-10 h-10  rounded-full mt-1" alt="" />
    </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {inputs.map((elem, i) => (
            <GenericFormInputs  key={i + elem.name} form={form} {...elem} />
          ))}

        <p className="mb-3 text-sm">Your password must have at least 6 characters</p>
        <div className="flex items-center justify-center ">
          <Button className=' w-full bg-green-400 p-3' disabled={isLoading} type="Submit">
            {isLoading ? "loading..." : "Sign Up"}
          </Button>
        </div>
          
        </form>
      </Form>
    </div>
    <div className="flex items-center justify-center mt-4">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className=" text-gray-500">or sign up with</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
    <div className="lg:flex  md:flex items-center justify-center  sm:flex  block  m-auto w-[80%] mt-4">
          <img  src={google} alt="" />
          <img className="lg:ps-2 md:ps-2 sm:ps-2 ps-0"  src={facebook} alt="" />
    </div>
    <div className="flex items-center justify-center mt-4">
      <p>Already have an Account?</p>
      <Link className="text-green-600 font-bold cursor-pointer" to={"/login"}>Login</Link>
    </div>
          </div>
     
    </div>
    
    </div>
  );
}

export default SignupForm;

