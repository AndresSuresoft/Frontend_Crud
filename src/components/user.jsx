import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api/users';

const Users = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
    });
    const [editingUser, setEditingUser] = useState(null);

    // 1. Obtener todos los usuarios
    const fetchUsers = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // 2. Crear un nuevo usuario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Error al crear el usuario');
            }
            const newUser = await response.json();
            setUsers(prevUsers => [...prevUsers, newUser]);
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: ''
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // 3. Editar un usuario
    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
        });
    };

    // 4. Actualizar un usuario
    const handleUpdate = async () => {
        if (!editingUser) return;
        try {
            const response = await fetch(`${API_URL}/${editingUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }
            const updatedUser = await response.json();
            setUsers(prevUsers =>
                prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
            );
            setEditingUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: ''
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // 5. Eliminar un usuario
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Gestión de Usuarios</h1>

            {/* Formulario de creación/edición */}
            <form onSubmit={editingUser ? handleUpdate : handleSubmit}>
                <h2>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h2>
                <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{editingUser ? 'Actualizar' : 'Crear'}</button>
                {editingUser && <button type="button" onClick={() => {
                    setEditingUser(null);
                    setFormData({ firstName: '', lastName: '', phone: '', email: '' });
                }}>Cancelar</button>}
            </form>

            {/* Lista de usuarios */}
            <h2>Lista de Usuarios</h2>
            <ul>
                {users.length > 0 ? (
                    users.map(user => (
                        <li key={user.id}>
                            {user.firstName} {user.lastName} - {user.email}
                            {/* Botón para ver el perfil */}
                            <button onClick={() => onSelectUser(user.id)}>Ver Perfil</button>
                            <button onClick={() => handleEdit(user)}>Editar</button>
                            <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                        </li>
                    ))
                ) : (
                    <p>No hay usuarios.</p>
                )}
            </ul>
        </div>
    );
};

export default Users;