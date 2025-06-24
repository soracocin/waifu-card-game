import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isRegistering ? '/api/users/register' : '/api/users/login';
            const payload = isRegistering
                ? formData
                : { username: formData.username, password: formData.password };

            const response = await axios.post(`http://localhost:8080${endpoint}`, payload);

            if (response.data && response.data.id) {
                onLogin(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div className="form">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
                    {isRegistering ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}
                </h2>

                {error && (
                    <div style={{
                        background: '#f8d7da',
                        color: '#721c24',
                        padding: '0.8rem',
                        borderRadius: '5px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên đăng nhập:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên đăng nhập"
                        />
                    </div>

                    {isRegistering && (
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Nhập email"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Mật khẩu:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-large"
                        disabled={loading}
                        style={{ width: '100%', marginBottom: '1rem' }}
                    >
                        {loading ? 'Đang xử lý...' : (isRegistering ? 'Đăng Ký' : 'Đăng Nhập')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#666' }}>
                    {isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
                    <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            marginLeft: '0.5rem'
                        }}
                    >
                        {isRegistering ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;