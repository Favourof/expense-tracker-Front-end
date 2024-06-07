import DashBorad from '@/pages/DashBoard'
import React from 'react'
import { Outlet } from 'react-router-dom'

const DashBoardRoute = () => {
  return (
    <div>
      <DashBorad>
        <Outlet />
      </DashBorad>

    </div>
  )
}

export default DashBoardRoute
