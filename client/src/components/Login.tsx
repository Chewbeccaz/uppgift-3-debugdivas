import axios from "axios";
import { useState } from "react";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/login', { 
                email: email,
                password: password
            });
            console.log('Login successful:', response.data);
        } catch (error) {
            console.error('Login failed:', error); 
        }

        setEmail('');
        setPassword('');
    };



    return (
        <>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <label>
                Email:
                <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
            </label>
            <br />
            <label>
                Password:
                <input 
                    type="password" 
                    name="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </label>
            <br />
            <button type="submit">Login</button>
        </form>
    </>
);
};