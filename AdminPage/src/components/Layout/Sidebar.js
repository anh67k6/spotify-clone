import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaWrench, FaUser, FaMusic } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className='bg-[#4E73DF] px-[25px] h-screen'>
      <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]'>
      <Link to="/" className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer'>Admin page</Link>
      </div>
      <div className='flex items-center gap-[15px] py-[20px] border-b-[1px] border-[#EDEDED]/[0.3] cursor-pointer'>
        <FaTachometerAlt color='white' />
        <Link to="/" className='text-[14px] leading-[20px] font-bold text-white'>Dashboard</Link>
      </div>
      <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
        <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'> INTERFACE</p>
        <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
          <div className='flex items-center gap-[10px]'>
            <FaUser color='white' /> <Link to="/user" className='text-[14px] leading-[20px] font-normal text-white'>User</Link>
          </div>
        </div>
        <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
          <div className='flex items-center gap-[10px]'>
            <FaMusic color='white' /> <Link to="/song" className='text-[14px] leading-[20px] font-normal text-white'>Songs</Link>
          </div>
        </div>
        <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
          <div className='flex items-center gap-[10px]'>
            <FaWrench color='white' /> <Link to="/settings" className='text-[14px] leading-[20px] font-normal text-white'>SETTING</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
