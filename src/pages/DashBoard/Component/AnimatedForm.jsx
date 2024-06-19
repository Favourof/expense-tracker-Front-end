import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { publicRequest } from "@/shared/api/request";
import { useGetAllIncome } from "../hooks/useGetAllIcome";
import { useToast } from "@/components/ui/use-toast";


const AnimatedForm = () => {
    const { handleGetAllIncome} = useGetAllIncome()
    const [RandomNumber, setRandomNumber] = useState(5);
    const [isLoading, setisLoading] = useState(false);
    const { toast } = useToast();
  const [formData, setFormData] = useState({
    userId: localStorage.getItem('userId'),
    amount: 2000,
    source: "salary",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    handleGetAllIncome()
  }, [RandomNumber])

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log("Form data submitted:", formData);
    setisLoading(true);
    try {
        const response = await publicRequest.post('/income/addincome', formData)
        console.log(response);
        if (response) {
          toast({
            title: "Success",
            description: ` Income Added Successfully`,
          });
            setRandomNumber(Math.random() * 5)
            
        
              
        }
    } catch (error) {
        console.log(error);
        toast({
          title: "Hello",
          description: error.message,
        });
    }finally{
      setisLoading(false);
    }
    // Add your form submission logic here
  };

  console.log(RandomNumber);



  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg relative z-10 sm:max-w-lg md:max-w-xl lg:max-w-2xl"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-600">Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold"
        >
     {isLoading ? "loading..." : "Submit"}
        </motion.button>
      </form>
    </motion.div>
  );
  
};

export default AnimatedForm;
