import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SubscriptionLevels } from '../models/SubscriptionLevels';

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [subscriptionId, setSubscriptionId] = useState(1);
    const [subscriptions, setSubscriptions] = useState<SubscriptionLevels[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get<SubscriptionLevels[]>("/api/levels");
                setSubscriptions(response.data);
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            }
        };

        fetchSubscriptions();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post("/api/users/create-user", {
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
                        {subscriptions.map(subscription => (
                            <option key={subscription._id} value={subscription._id}>
                                {subscription.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <button type="submit">Skapa konto</button>
            </form>
            {message && <p>{message}</p>}
        </>
    );
};
