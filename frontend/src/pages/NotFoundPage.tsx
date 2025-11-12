import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from '../layouts/AuthLayout';
import LanguageSwitcher from '../components/LanguageSwitcher';

function NotFoundPage() {
    const { t } = useTranslation();

    return (
        <AuthLayout>
            <div style={{
                position: 'relative',
                textAlign: 'center',
                color: 'white',
                padding: '2rem'
            }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                    <LanguageSwitcher />
                </div>
                <div style={{
                    fontSize: '6rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    404
                </div>
                
                <h1 style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    fontWeight: '600'
                }}>
                    {t('notFound.title')}
                </h1>
                
                <p style={{
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                    opacity: 0.9,
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                }}>
                    {t('notFound.description')}
                </p>
                
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Link 
                        to="/dashboard" 
                        className="btn btn-primary"
                        style={{
                            textDecoration: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {t('notFound.home')}
                    </Link>
                    
                    <button 
                        onClick={() => window.history.back()}
                        className="btn btn-secondary"
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {t('notFound.back')}
                    </button>
                </div>
                
                <div style={{
                    marginTop: '3rem',
                    fontSize: '3rem',
                    opacity: 0.7
                }}>
                    {t('notFound.emoji')}
                </div>
            </div>
        </AuthLayout>
    );
}

export default NotFoundPage;
