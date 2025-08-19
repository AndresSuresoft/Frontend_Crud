// src/Profile.jsx
import React, { useState, useEffect } from 'react';
import SocialMediaIcon from '../assets/SocialMediaIcon'; // <-- Import the new component

const API_URL = 'http://localhost:3000/api';

const Profile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [socialMedia, setSocialMedia] = useState([]);
    const [newSocialMedia, setNewSocialMedia] = useState({ name: '', url: '' });

    // Obtener datos del usuario y sus redes sociales
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userId) return;

            try {
                // Petición para obtener los datos del usuario
                const userResponse = await fetch(`${API_URL}/users/${userId}`);
                const userData = await userResponse.json();
                setUser(userData);

                // Petición para obtener las redes sociales del usuario
                const socialMediaResponse = await fetch(`${API_URL}/users/${userId}/social-media`);
                const socialMediaData = await socialMediaResponse.json();
                setSocialMedia(socialMediaData);
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
            }
        };
        fetchProfileData();
    }, [userId]);

    // Manejar el cambio de valores en el formulario de redes sociales
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSocialMedia(prevState => ({ ...prevState, [name]: value }));
    };

    // Crear una nueva red social
    const handleCreateSocialMedia = async (e) => {
        e.preventDefault();
        console.log('Datos a enviar:', newSocialMedia);
        try {
            const response = await fetch(`${API_URL}/users/${userId}/social-media`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(newSocialMedia),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Detalles del error del backend:", errorData);
                throw new Error('Error al crear la red social');
            }

            const createdSocialMedia = await response.json();
            setSocialMedia(prev => [...prev, createdSocialMedia]);
            setNewSocialMedia({ name: '', url: '' });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Eliminar una red social
    const handleDeleteSocialMedia = async (socialMediaId) => {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/social-media/${socialMediaId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar la red social');
            }
            setSocialMedia(prev => prev.filter(sm => sm.id !== socialMediaId));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (!user) {
        return <div>Cargando perfil...</div>;
    }

    return (
        <div>
            <h1>Perfil de Usuario</h1>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>Email: {user.email}</p>
            <p>Teléfono: {user.phone}</p>

            <hr />

            <h2>Redes Sociales</h2>
            {socialMedia.length > 0 ? (
                <ul>
                    {socialMedia.map(sm => (
                        <li key={sm.id}>
                            <SocialMediaIcon name={sm.name} /> {/* <-- Use the component here */}
                            <a href={sm.url} target="_blank" rel="noopener noreferrer">
                                {sm.name}
                            </a>
                            <button onClick={() => handleDeleteSocialMedia(sm.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tiene redes sociales registradas.</p>
            )}

            <h3>Añadir Red Social</h3>
            <form onSubmit={handleCreateSocialMedia}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre (ej: Twitter)"
                    value={newSocialMedia.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="url"
                    name="url"
                    placeholder="URL"
                    value={newSocialMedia.url}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Añadir</button>
            </form>
        </div>
    );
};

export default Profile;