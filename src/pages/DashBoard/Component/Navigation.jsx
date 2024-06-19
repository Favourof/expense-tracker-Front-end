import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaEnvelope, FaInfoCircle, FaBars } from 'react-icons/fa';
import { MdDashboard, MdOutlineInsights } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { getCurrentUser } from "@/features/AuthPage/AuthSlice";



const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard className="h-6 w-6 text-white" /> },
  { name: 'Income', path: 'income', icon: <MdOutlineInsights className="h-6 w-6 text-white" /> },
  { name: 'Review', path: 'review', icon: <FaInfoCircle className="h-6 w-6 text-white" /> },
  { name: 'Expense', path: 'AddExpense', icon: <FaEnvelope className="h-6 w-6 text-white" /> },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  // console.log(currentUser);



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
         <div className='flex p-4  space-x-10 h-20  absolute'>
      <button onClick={toggleMenu} className="text-black ">
        <FaBars className="h-8 w-8" />
      </button>
      <div className='flex space-x-4'>
          <img src={currentUser?.image} alt="" className='w-12 h-12 rounded-full' />
          <div className='ml-2'>
          <p className='font-bold'>Hello</p>
          <p>{currentUser?.firstName}</p>
          </div>
      </div>
      </div>
       <div className=' w-70 h-full mt-20'>
      {isMenuOpen && (
        <nav className="bg-green-900 h-full text-orange-500 w-64 font-bold">
          <ul>
            {navItems.map((item, index) => (
              <li key={index} className="p-4 flex items-center">
                {item.icon}
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? 'bg-white/100 ml-2 px-10 py-2' : 'text-white ml-2'
                  }
                  end
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div></div>
   
  );
};

export default Navigation;

