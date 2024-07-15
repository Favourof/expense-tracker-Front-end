import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaInfoCircle, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard, MdOutlineInsights } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { GiExpense } from 'react-icons/gi';

import { getCurrentUser } from '@/features/AuthPage/AuthSlice';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard className="h-6 w-6 text-white" /> },
  { name: 'Income', path: 'income', icon: <MdOutlineInsights className="h-6 w-6 text-white" /> },
  { name: 'Expense', path: 'AddExpense', icon: <FaEnvelope className="h-6 w-6 text-white" /> },
  { name: 'My Expense', path: 'myExpense', icon: <GiExpense className="h-6 w-6 text-white" /> },
  { name: 'Review', path: 'review', icon: <FaInfoCircle className="h-6 w-6 text-white" /> },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [refresh, setRefresh] = useState(false); // State to trigger re-render
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (refresh) {
      dispatch(getCurrentUser());
      setRefresh(false); // Reset refresh state
    }
  }, [dispatch, refresh]);

  useEffect(() => {
    dispatch(getCurrentUser()); // Fetch user data on initial render
  }, [dispatch]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('currency');
    localStorage.removeItem('monthlyIncome');
    localStorage.removeItem('monthlyExpense');
    localStorage.removeItem('cov');
    setRefresh(true); // Trigger user data refresh
    navigate('/'); // Navigate to home page
  };

  return (
    <div>
      <div className='flex p-4 space-x-6 h-20 absolute bg-white w-[100%] shadow-lg z-50'>
        <button onClick={toggleMenu} className="text-black">
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
      <div className='w-70 h-full mt-20'>
        {isMenuOpen && (
          <nav className="bg-green-900 h-full text-orange-500 w-64 font-bold flex flex-col justify-between">
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
            <div className='p-4 mb-20' onClick={handleLogOut}>
              <p className='text-white cursor-pointer flex items-center'>
                <FaSignOutAlt className="h-6 w-6 mr-2" /> Log out
              </p>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Navigation;
