import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactElement;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const { t } = useTranslation();

    if (loading) {
        return <div className="loading">{t('common.loading')}</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
