import { auth, provider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const navigate = useNavigate();

  const validateLoginForm = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/main');
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setLoginError("Invalid Credential");
      } else {
        setLoginError(error.message);
      }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      navigate('/main');
    } catch (error: any) { 
      setLoginError(error.message);
    }
  }

  return (
    <div className="login-container">
      <div className="card">
        <form onSubmit={login}>
          <h1>Login</h1>

          <h2> Email </h2>
          <input type='email' placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
          {emailError && <p className="error-message">{emailError}</p>}
          
          <h2> Password </h2>
          <input type='password' placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {passwordError && <p className="error-message">{passwordError}</p>}
          
          <button type="submit">Login</button>
          {loginError && <p className="error-message">{loginError}</p>}
        </form>
      </div>
      <p className="login-message">Sign In With Google To Continue</p>
      <button className="login-button" onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  )
}

export default Login;
