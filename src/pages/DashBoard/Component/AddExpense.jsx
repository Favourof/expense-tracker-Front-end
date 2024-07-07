import React, { useState } from 'react';
import { FaTshirt, FaAppleAlt, FaCar, FaHome, FaShoppingCart, FaQuestion } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { useAddExpense } from '../hooks/useAddExpense';
import Loader from './Loader';
import AddSubCategoryForm from './AddSubCategoryForm';
import { GiExpense } from "react-icons/gi";

const iconArray = [GiExpense];
const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-teal-500", "bg-indigo-500"];
const shadows = ["shadow-red-200", "shadow-orange-200", "shadow-yellow-200", "shadow-lime-200", "shadow-teal-200", "shadow-indigo-200"];

const hashStringToIndex = (str, arrayLength) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % arrayLength;
};

const AddExpense = () => {
  const { handleAddCategory, handleAddSubCategory, categories, isloading } = useAddExpense();
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const addCategory = async (categoryName) => {
    try {
      await handleAddCategory(categoryName);
      setNewCategory(""); // Clear input after successful addition
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const closeForm = () => {
    setSelectedCategory(null);
  };

  if (isloading) {
    return <Loader />;
  }

  return (
    <div>
      <h1>Expense Management</h1>
      <CategoryList addCategory={addCategory} />
      <div className="px-3 md:px-40 lg:px-40 border-t border-b py-20 bg-opacity-10" style={{ backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/dot-grid.png')" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 group bg-white shadow-xl shadow-neutral-100 border">
          {categories.map((category) => {
            const Icon = iconArray[hashStringToIndex(category.name, iconArray.length)];
            const bgColor = colors[hashStringToIndex(category.name, colors.length)];
            const shadowColor = shadows[hashStringToIndex(category.name, shadows.length)];
            return (
              <div key={uuidv4()} className="p-10 flex flex-col items-center text-center group border-r border-b hover:bg-slate-50 cursor-pointer" onClick={() => handleCategoryClick(category)}>
                <span className={`p-5 rounded-full ${bgColor} text-white shadow-lg ${shadowColor}`}>
                  <Icon className="h-10 w-10" />
                </span>
                <p className="text-xl font-medium text-slate-700 mt-3">{category.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      {selectedCategory && (
        <AddSubCategoryForm category={selectedCategory} onAddSubCategory={handleAddSubCategory} onClose={closeForm} />
      )}
    </div>
  );
};

const CategoryList = ({ addCategory }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (newCategory.trim() === "") return;
    await addCategory(newCategory.trim());
    setNewCategory(""); // Clear input after submission
  };

  return (
    <form onSubmit={handleCategorySubmit} className="mb-5">
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New Category"
        required
        className="mr-2 p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-green-500 text-white rounded">Add Category</button>
    </form>
  );
};

export default AddExpense;
