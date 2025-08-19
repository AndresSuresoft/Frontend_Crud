// src/components/SocialMediaIcon.jsx

import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa';

const SocialMediaIcon = ({ name }) => {
    const iconSize = 24; // Puedes ajustar el tamaño aquí

    switch (name.toLowerCase()) {
        case 'facebook':
            return <FaFacebook size={iconSize} />;
        case 'twitter':
            return <FaTwitter size={iconSize} />;
        case 'instagram':
            return <FaInstagram size={iconSize} />;
        default:
            return <FaGlobe size={iconSize} />; // Ícono genérico si no coincide
    }
};

export default SocialMediaIcon;