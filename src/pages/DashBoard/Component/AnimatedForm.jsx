import React, { useState } from "react";
import { motion } from "framer-motion";
import { publicRequest } from "@/shared/api/request";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AnimatedForm = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    userId: localStorage.getItem("userId"),
    amount: 2000,
    source: "salary",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await publicRequest.post("/income/addincome", formData);
      if (response) {
        toast({
          title: "Success",
          description: `Income Added Successfully`,
        });
        onSuccess(); // Call the onSuccess callback
        setIsDialogOpen(false); // Close the dialog
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-orange-400'  onClick={() => setIsDialogOpen(true)}>Add Income</Button>
      </DialogTrigger>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 p-6 bg-white shadow-md rounded-lg relative z-10"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Add Income
          </h2>
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
              {isLoading ? "Loading..." : "Submit"}
            </motion.button>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AnimatedForm;
