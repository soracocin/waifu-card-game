import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

function NotFoundPage() {
    return (
        <AuthLayout>
            <div style={{
                textAlign: 'center',
                color: 'white',
                padding: '2rem'
            }}>
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
                    Trang không tồn tại
                </h1>
                
                <p style={{
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                    opacity: 0.9,
                    lineHeight: '1.6'
                }}>
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại.<br />
                    Có thể đường dẫn đã bị thay đổi hoặc bị xóa.
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
                        🏠 Về trang chủ
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
                        ⬅️ Quay lại
                    </button>
                </div>
                
                <div style={{
                    marginTop: '3rem',
                    fontSize: '3rem',
                    opacity: 0.7
                }}>
                    🌸
                </div>
            </div>
        </AuthLayout>
    );
}

export default NotFoundPage;
