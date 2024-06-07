// import { color } from 'framer-motion'
import React from 'react'
import { Link } from 'react-router-dom'

const HeroPage = () => {
  
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
            Track Your Expenses with Ease
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-6">
            Stay on top of your finances with our intuitive expense tracker. Manage your budget, monitor your spending, and achieve your financial goals.
          </p>
          <Link to={'/login'} className=" bg-green-400 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-600"

          
          >
            Get Started
          </Link>
        </div>
        <div className="lg:w-1/2 mt-12 lg:mt-0">
        <video src='https://res.cloudinary.com/dqwkg8qcx/video/upload/v1717159210/sbseg-en_row-Reports_iqbwmr.mp4' autoPlay loop></video>
        </div>
      </div>
    </div>
  </div>
  )
}

export default HeroPage
