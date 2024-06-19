import React, { useState } from 'react';

const AddSubCategoryForm = ({ category, onAddSubCategory, onClose }) => {
  const [subCategoryName, setSubCategoryName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryName || !amount) return;
    await onAddSubCategory(category, { name: subCategoryName, amount, description });
    setSubCategoryName('');
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">Add SubCategory to {category.name}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            placeholder="SubCategory Name"
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full mb-2 p-2 border rounded"
          />
          <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Add SubCategory</button>
        </form>
        <button onClick={onClose} className="mt-2 w-full p-2 bg-red-500 text-white rounded">Close</button>
      </div>
    </div>
  );
};

export default AddSubCategoryForm;
