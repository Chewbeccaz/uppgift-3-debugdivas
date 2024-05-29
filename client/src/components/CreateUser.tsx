import React, { useState } from 'react';
import axios from 'axios';

export const CreateUser = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [subscriptionId, setSubscriptionId] = useState(1); 
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/create-user', {
                email,
                password,
                subscription_id: subscriptionId,
            });

            if (response.status === 201) {
                setMessage('Konto skapat!');
            } else {
                setMessage('Något gick fel, vänligen försök igen.');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            setMessage('Något gick fel, vänligen försök igen.');
        }
    };
// TODO hämta subscription_level från db/backend, CORS? 
    return (
        <>
            <h1>Skapa konto</h1>
            <form onSubmit={handleSubmit}>
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
                    Lösenord:
                    <input 
                        type="password" 
                        name="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
            
                <label>
                    Prenumeration:
                    <select
                        name="subscription_id"
                        value={subscriptionId}
                        onChange={(e) => setSubscriptionId(Number(e.target.value))}
                    >
                        <option value={1}>No Access</option>
                        <option value={2}>Blunders Bubblor</option>
                        <option value={3}>Ariels Antikviteter</option>
                        <option value={4}>Tritons Treudd</option>
                    </select>
                </label>
                <br />
                <button type="submit">Skapa konto</button>
            </form>
            {message && <p>{message}</p>}
        </>
    );
};
