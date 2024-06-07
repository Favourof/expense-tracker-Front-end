import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { publicRequest } from "@/shared/api/request";
import { useGetAllIncome } from "../hooks/useGetAllIcome";


const AnimatedForm = () => {
    const { handleGetAllIncome} = useGetAllIncome()
    const [RandomNumber, setRandomNumber] = useState(5);
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
    console.log("Form data submitted:", formData);
    try {
        const response = await publicRequest.post('/income/addincome', formData)
        console.log(response);
        if (response) {
            setRandomNumber(Math.random() * 5)
        
              
        }
    } catch (error) {
        console.log(error);
    }
    // Add your form submission logic here
  };

  console.log(RandomNumber);



  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">User Data Form</h2>
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
          className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold"
        >
          Submit
        </motion.button>
        
      </form>
    </motion.div>
  );
};

export default AnimatedForm;
