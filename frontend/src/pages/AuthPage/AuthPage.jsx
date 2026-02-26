import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './AuthPage.scss';

const AuthPage = ({ mode = 'login' }) => {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const { showToast } = useToast();

    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isLogin = mode === 'login';

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = isLogin
                ? await login({ email: form.email, password: form.password })
                : await register({ username: form.username, email: form.email, password: form.password });

            loginUser(res.data.token, res.data.user);
            showToast(
                isLogin
                    ? `Welcome back, ${res.data.user?.username || 'there'}!`
                    : `Account created! Welcome, ${res.data.user?.username}!`,
                'success'
            );
            navigate('/assignments');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-page__card">
                <div className="auth-page__logo">
                    <div className="auth-page__logo-icon" aria-hidden="true">⚡</div>
                    <h1>Cipher<span>SQL</span>Studio</h1>
                    <p>{isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}</p>
                </div>

                <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
                    {!isLogin && (
                        <div className="auth-page__field">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="johndoe"
                                value={form.username}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                            />
                        </div>
                    )}

                    <div className="auth-page__field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="auth-page__field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder={isLogin ? 'Your password' : 'Min. 6 characters'}
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />
                    </div>

                    {error && (
                        <div className="alert alert--error" role="alert">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-page__submit"
                        disabled={loading}
                        id={isLogin ? 'login-submit-btn' : 'register-submit-btn'}
                    >
                        {loading ? (
                            <><span className="spinner spinner--sm" aria-hidden="true"></span> {isLogin ? 'Signing in...' : 'Creating account...'}</>
                        ) : (
                            isLogin ? '🔑 Sign In' : '🚀 Create Account'
                        )}
                    </button>
                </form>

                <p className="auth-page__footer">
                    {isLogin ? (
                        <>Don't have an account? <Link to="/register">Sign up free</Link></>
                    ) : (
                        <>Already have an account? <Link to="/login">Sign in</Link></>
                    )}
                </p>
            </div>
        </main>
    );
};

export default AuthPage;