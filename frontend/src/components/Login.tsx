import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import type { User } from '../types/user';

interface FormState {
    username: string;
    email: string;
    password: string;
}

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useTranslation();
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState<FormState>({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isRegistering ? '/api/users/register' : '/api/users/login';
            const payload = isRegistering
                ? formData
                : { username: formData.username, password: formData.password };

            const response = await axios.post<User>(`http://localhost:8080${endpoint}`, payload);
            login(response.data);
            navigate('/dashboard');
        } catch (submissionError) {
            if (axios.isAxiosError(submissionError)) {
                setError(submissionError.response?.data?.error || t('auth.error'));
            } else {
                setError(t('auth.error'));
            }
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative'
        }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <LanguageSwitcher />
            </div>
            <div className="form">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
                    {isRegistering ? t('auth.registerTitle') : t('auth.signInTitle')}
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
                        <label>{t('auth.usernameLabel')}</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder={t('auth.usernamePlaceholder')}
                        />
                    </div>

                    {isRegistering && (
                        <div className="form-group">
                        <label>{t('auth.emailLabel')}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder={t('auth.emailPlaceholder')}
                        />
                    </div>
                )}

                    <div className="form-group">
                        <label>{t('auth.passwordLabel')}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder={t('auth.passwordPlaceholder')}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-large"
                        disabled={loading}
                        style={{ width: '100%', marginBottom: '1rem' }}
                    >
                        {loading ? t('auth.working') : (isRegistering ? t('auth.submitRegister') : t('auth.submitSignIn'))}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#666' }}>
                    {isRegistering ? t('auth.toggleHaveAccount') : t('auth.toggleNeedAccount')}
                    <button
                        type="button"
                        onClick={() => setIsRegistering((prev) => !prev)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            marginLeft: '0.5rem'
                        }}
                    >
                        {isRegistering ? t('auth.toggleSignIn') : t('auth.toggleRegister')}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
