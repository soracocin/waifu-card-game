import AppLayout from '../layouts/AppLayout';
import CardManager from '../components/CardManager';
import AdminSectionNav from '../components/AdminSectionNav';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

function AdminPage() {
    const { user } = useAuth();
    const { t } = useTranslation();

    if (!user) {
        return null;
    }

    return (
        <AppLayout>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '18px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.09)',
                padding: '2rem 1rem',
                minHeight: '70vh',
                overflowX: 'auto',
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.25rem', fontWeight: 700, letterSpacing: 1, color: '#fff' }}>
                    {t('admin.cardsHeading')}
                </h2>
                <AdminSectionNav />
                <CardManager />
            </div>
        </AppLayout>
    );
}

export default AdminPage;
