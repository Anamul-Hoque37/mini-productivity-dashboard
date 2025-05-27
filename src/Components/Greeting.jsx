import { useEffect, useState } from 'react';
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import auth from '../../firebase.config';

const Greeting = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className='min-h-screen'>
            <div className="h-screen flex flex-col items-center px-4 sm:px-6 md:px-10 lg:px-14 justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white relative">
                <Motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-3xl md:text-5xl font-extrabold mb-4"
                >
                    Welcome to Mini Productivity Dashboard 🚀
                </Motion.h1>

                <Motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-lg md:text-xl text-gray-200 max-w-md text-center"
                >
                    Boost your productivity and manage your tasks efficiently with ease!
                </Motion.p>

                <Motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(user ? "/tasks" : "/")}
                    className="mt-6 px-6 py-3 bg-fuchsia-600 text-white font-semibold rounded-full shadow-lg hover:bg-fuchsia-800 transition"
                    aria-label={user ? "Go to Tasks" : "Sign In to Start"}
                >
                    {user ? "Get Started" : "Sign In to Get Started"}
                </Motion.button>

                {/* Background decorations */}
                <div className="absolute top-10 left-10 w-16 h-16 bg-white opacity-20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-white opacity-10 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Greeting;
