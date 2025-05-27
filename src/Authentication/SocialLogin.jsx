import React from 'react';
import { FcGoogle } from "react-icons/fc";
import auth from '../../firebase.config'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const SocialLogin = () => {
    
    const provider = new GoogleAuthProvider();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const location = useLocation();
    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result.user);
                const user = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    image: result.user?.photoURL,
                    uid: result.user?.uid,
                }
                axiosSecure.post('/users', user)
                    .then(res => {
                        console.log(res.data)
                        navigate(location?.state ? location.state : "/")
                        Swal.fire({
                            title: 'success',
                            text: 'Successfully login',
                            icon: 'success',
                        });
                    })

            })
            .catch(error => {
                Swal.fire({
                    title: 'Error',
                    text: 'Cannot Login', error,
                    icon: 'error',
                    footer: 'Please check your Google account.'
                });
            })
    }
    return (
        <div>
            <div>
                <button onClick={handleGoogleSignIn} className='btn text-xl font-semibold text-white w-full bg-fuchsia-600 hover:bg-fuchsia-800'>Sign In <FcGoogle className='text-3xl font-bold' /></button>
            </div>
        </div>
    );
};

export default SocialLogin;