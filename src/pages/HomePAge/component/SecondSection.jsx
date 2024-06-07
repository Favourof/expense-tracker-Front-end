import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Features and Advantages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="bg-blue-500 text-white p-4 rounded-full mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12 7c0-.28.11-.53.29-.71l2-2a1.003 1.003 0 00-1.42-1.42l-2 2A1.003 1.003 0 0011 7v4c0 .28-.11.53-.29.71l-2 2a1.003 1.003 0 001.42 1.42l2-2c.18-.18.29-.43.29-.71V7zm-8 2c0-.28.11-.53.29-.71l2-2a1.003 1.003 0 10-1.42-1.42l-2 2C2.11 6.47 2 6.72 2 7v4c0 .28.11.53.29.71l2 2a1.003 1.003 0 101.42-1.42l-2-2A1.003 1.003 0 014 11V9zm8 5c-.28 0-.53.11-.71.29l-2 2a1.003 1.003 0 101.42 1.42l2-2c.18-.18.29-.43.29-.71V9a1.003 1.003 0 10-2 0v5z"/>
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Track Expenses</h3>
            <p className="text-gray-600 text-center">Easily monitor your spending and manage your budget efficiently.</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="bg-green-500 text-white p-4 rounded-full mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3.05V1a1 1 0 00-1 1v2.05a7.002 7.002 0 00-6 6.95 1 1 0 102 0 5.002 5.002 0 0110 0 1 1 0 102 0 7.002 7.002 0 00-6-6.95zM3 9H1a1 1 0 00-1 1v1a1 1 0 001 1h2a7.002 7.002 0 016.95 6 1 1 0 102 0 5.002 5.002 0 0110 0 1 1 0 102 0 7.002 7.002 0 00-6-6.95z"/>
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Detailed Reports</h3>
            <p className="text-gray-600 text-center">Get comprehensive insights into your financial habits.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="bg-red-500 text-white p-4 rounded-full mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2C5.589 2 2 5.589 2 10s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 15c-3.859 0-7-3.141-7-7s3.141-7 7-7 7 3.141 7 7-3.141 7-7 7zm-1-9V7h2v3h3v2h-3v3H9v-3H6v-2h3z"/>
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Data</h3>
            <p className="text-gray-600 text-center">Your financial data is safe and encrypted with us.</p>
          </motion.div>

          {/* Add more cards as needed */}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
