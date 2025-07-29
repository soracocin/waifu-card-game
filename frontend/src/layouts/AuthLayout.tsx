import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="auth-layout">
            <div className="auth-container">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;