import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './styles.css';
import { useNavigate } from "react-router-dom";


const Register = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    const schema = yup.object().shape({
        username: yup.string().required('Username is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data: { username: string; email: string; password: string }) => { 
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: data.username
            });

            console.log("User registered successfully:", user);
        } catch (error: any) {
            setErrorMessage(error.message);
            console.error("Error registering user:", error.message);
        }
        navigate("/main")
    }

    return (
        <div className="login-container">
            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>Create Account</h1>

                    <div>
                        <h2>Username</h2>
                        <input type="text" {...register('username')} />
                        {errors.username && <p className="error-message">{errors.username.message}</p>}
                    </div>

                    <div>
                        <h2>Email</h2>
                        <input type='email' {...register('email')} />
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>

                    <div>
                        <h2>Password</h2>
                        <input type='password' {...register('password')} />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <button type="submit">Register</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </div>
        </div>
    )
}

export default Register;
