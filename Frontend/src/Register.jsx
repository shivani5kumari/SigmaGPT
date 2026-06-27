import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Register({ setShowRegister }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    name,
                    email,
                    password,
                }
            );

            toast.success("🎉 Account created successfully!");

            setTimeout(() => {
                setShowRegister(false);
            }, 1500);

        } catch (err) {
            toast.error(
                err.response?.data?.message || "Registration Failed"
            );
        }
    };

    return (
        <div className="registerContainer">
            <div className="registerCard">

                <h1>Create Your Account </h1>

                <p className="registerSubText">
                    Join SigmaGPT and start chatting.
                </p>

                <form onSubmit={register}>

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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
                        Create Account
                    </button>

                    <p className="switchText">
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        className="switchBtn"
                        onClick={() => setShowRegister(false)}
                    >
                        Back To Login
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Register;