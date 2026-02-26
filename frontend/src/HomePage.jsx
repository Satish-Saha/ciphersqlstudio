import { Link } from 'react-router-dom';
import './HomePage.scss';

const FEATURES = [
    { icon: '📝', title: 'Curated Assignments', desc: 'Practice SQL with real-world datasets across 3 difficulty levels — Easy, Medium, and Hard.' },
    { icon: '⚡', title: 'Real-Time Execution', desc: 'Execute your SQL queries instantly against a live PostgreSQL sandbox and see results immediately.' },
    { icon: '💡', title: 'AI-Powered Hints', desc: 'Stuck? Get intelligent hints from AI that guide your thinking without giving away the answer.' },
    { icon: '🔒', title: 'Sandboxed Safety', desc: 'Each assignment runs in an isolated PostgreSQL schema. Your queries can\'t affect other students\' data.' },
    { icon: '📊', title: 'Visual Results', desc: 'Query results render as beautifully formatted tables with column headers and row counts.' },
    { icon: '📈', title: 'Track Progress', desc: 'Sign in to save your SQL attempts and track completion across all assignments.' },
];

const HomePage = () => (
    <div className="home-page">
        <section className="home-page__hero" aria-label="Hero">
            <div className="home-page__badge" aria-label="New feature">
                <span aria-hidden="true">✨</span> SQL Learning Platform
            </div>

            <h1 className="home-page__title">
                Master SQL with<br /><span>Real Queries</span>, Real Data
            </h1>

            <p className="home-page__subtitle">
                CipherSQLStudio gives you a live PostgreSQL sandbox to practice SQL assignments — with instant results and intelligent AI hints when you get stuck.
            </p>

            <div className="home-page__actions">
                <Link to="/assignments" className="btn btn--primary btn--lg" id="start-learning-btn">
                    🚀 Start Learning
                </Link>
                <Link to="/register" className="btn btn--secondary btn--lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                    Create Account
                </Link>
            </div>
        </section>

        <section aria-label="Features" style={{ background: '#F8FAFC' }}>
            <div className="home-page__features">
                {FEATURES.map((f) => (
                    <div key={f.title} className="home-page__feature-card">
                        <div className="home-page__feature-card-icon" aria-hidden="true">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    </div>
);

export default HomePage;