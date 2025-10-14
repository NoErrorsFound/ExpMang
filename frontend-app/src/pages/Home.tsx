import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
    onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const handleLogoutClick = async () => {
        await onLogout();
        navigate('/login');
    };
    return (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <h1>Welcome to the Home Page</h1>
            <p>This is the homepage of the application.</p>
            <button 
                style={{
                    marginTop: '32px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(102,126,234,0.15)'
                }}
                onClick={handleLogoutClick}
            >
                Logout
            </button>
        </div>
    );
};

export default Home;