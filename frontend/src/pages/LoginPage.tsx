import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import Login from '../components/Login';

interface LoginPageProps {
    onLogin: (userData: any) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
    return (
        <AuthLayout>
            <Login onLogin={onLogin} />
        </AuthLayout>
    );
}

export default LoginPage;