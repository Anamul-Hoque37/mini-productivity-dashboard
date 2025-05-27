import React, { useEffect, useState } from 'react';
import SocialLogin from '../Authentication/SocialLogin';
import { MdDarkMode } from 'react-icons/md';
import { CiLight } from 'react-icons/ci';
import auth from '../../firebase.config';

const Navbar = () => {
    const user = auth.currentUser;
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }, []);
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
    };
    return (
        <div>
            <div className="navbar bg-fuchsia-100 dark:bg-slate-900 p-0 px-3">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl text-slate-900">Mini Productivity Dashboard</a>
                </div>
                <div className='flex gap-2'>
                    <div className="flex-none border rounded-lg py-1 px-2 text-center items-center bg-slate-50">
                        <label className="swap swap-rotate">
                            {/* This checkbox toggles the dark mode */}
                            <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                            {/* Light mode and Dark Mode icon */}
                            <div className='text-3xl items-center justify-center text-center'>
                                {isDarkMode ? <CiLight /> : <MdDarkMode />}
                            </div>
                        </label>
                    </div>
                    <div className="flex-none">
                        {user?.email ? <div className='h-14 w-14 border-2 border-white rounded-full'><img className='w-full h-full rounded-full' src={user?.photoURL} alt="" /></div>
                        : 
                        <ul className="menu menu-horizontal px-1">
                            <li><div className='p-0'>
                                <SocialLogin></SocialLogin>
                            </div></li>
                        </ul>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;