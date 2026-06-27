import "./Login.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Login({ setShowRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "https://sigmagpt-1-pb0i.onrender.com/api/auth/login",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Welcome back! 👋");

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Login Failed"
            );
        }
    };

    return (
        <div className="loginContainer">
            <div className="loginCard">
                <h1>Welcome Back </h1>

                <p className="loginSubText">
                    Sign in to continue chatting with SigmaGPT
                </p>

                <form onSubmit={login}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        Login
                    </button>

                    <p className="switchText">
                        Don't have an account?
                    </p>

                    <button
                        className="switchBtn"
                        type="button"
                        onClick={() => setShowRegister(true)}
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;