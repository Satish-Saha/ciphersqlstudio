import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignments } from '../../services/api';
import './AssignmentsPage.scss';

const FILTERS = [
    { key: 'all', label: 'ALL' },
    { key: 'easy', label: 'EASY' },
    { key: 'medium', label: 'MEDIUM' },
    { key: 'hard', label: 'HARD' },
];

const DIFFICULTY_ICONS = { Easy: '🟢', Medium: '🟡', Hard: '🔴' };

const AssignmentCard = ({ assignment, index, onAttempt }) => (
    <div
        className={`assignment-card assignment-card--${assignment.difficulty.toLowerCase()}`}
        onClick={() => onAttempt(assignment._id)}
        tabIndex={0}
        role="button"
        aria-label={`Attempt ${assignment.title}`}
        onKeyDown={(e) => e.key === 'Enter' && onAttempt(assignment._id)}
    >
        <div className="assignment-card__header">
            <div className="assignment-card__number">
                {DIFFICULTY_ICONS[assignment.difficulty] || index + 1}
            </div>
            <div className="assignment-card__meta">
                <span className={`badge badge--${assignment.difficulty.toLowerCase()}`}>
                    {assignment.difficulty}
                </span>
            </div>
        </div>

        <h3 className="assignment-card__title">{assignment.title}</h3>
        <p className="assignment-card__description">{assignment.description}</p>

        {assignment.tags?.length > 0 && (
            <div className="assignment-card__tags">
                {assignment.tags.map((tag) => (
                    <span key={tag} className="assignment-card__tag">{tag}</span>
                ))}
            </div>
        )}

        <div className="assignment-card__footer">
            <span className="assignment-card__tables-info">
                <span>📋 {assignment.sampleTables?.length || 0} table{(assignment.sampleTables?.length || 0) !== 1 ? 's' : ''}</span>
            </span>
            <button className="assignment-card__attempt-btn" onClick={(e) => { e.stopPropagation(); onAttempt(assignment._id); }}>
                Attempt →
            </button>
        </div>
    </div>
);

const AssignmentsPage = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await getAssignments();
            setAssignments(res.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load assignments. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const filteredAssignments = assignments.filter((a) => {
        const matchesDifficulty =
            activeFilter === 'all' || a.difficulty.toLowerCase() === activeFilter;
        const matchesSearch =
            !search ||
            a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.description.toLowerCase().includes(search.toLowerCase()) ||
            a.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return matchesDifficulty && matchesSearch;
    });

    const counts = {
        all: assignments.length,
        easy: assignments.filter((a) => a.difficulty === 'Easy').length,
        medium: assignments.filter((a) => a.difficulty === 'Medium').length,
        hard: assignments.filter((a) => a.difficulty === 'Hard').length,
    };

    return (
        <main className="assignments-page">
            <div className="container">
                {/* Header */}
                <header className="assignments-page__header">
                    <div className="assignments-page__title-group">
                        <h1>SQL <span>Assignments</span></h1>
                        <p>Practice SQL queries against pre-configured datasets with real-time hints</p>
                    </div>

                    <div className="assignments-page__controls">
                        {/* Filter pills - matching reference image design */}
                        <div className="assignments-page__filters" role="tablist" aria-label="Filter by difficulty">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.key}
                                    id={`filter-${f.key}`}
                                    className={`assignments-page__filter-btn assignments-page__filter-btn--${f.key} ${activeFilter === f.key ? 'assignments-page__filter-btn--active' : ''}`}
                                    onClick={() => setActiveFilter(f.key)}
                                    role="tab"
                                    aria-selected={activeFilter === f.key}
                                >
                                    {f.label}
                                    {counts[f.key] > 0 && <span style={{ marginLeft: '4px', opacity: 0.8 }}>({counts[f.key]})</span>}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="assignments-page__search">
                            <span className="assignments-page__search-icon" aria-hidden="true">🔍</span>
                            <input
                                type="search"
                                placeholder="Search assignments..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Search assignments"
                                id="assignment-search"
                            />
                        </div>
                    </div>
                </header>

                {/* Stats */}
                {!loading && !error && (
                    <div className="assignments-page__stats" role="status" aria-live="polite">
                        <div className="assignments-page__stat">
                            Showing <strong>{filteredAssignments.length}</strong> of <strong>{assignments.length}</strong> assignments
                        </div>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="page-loader" aria-busy="true">
                        <div className="spinner spinner--lg" aria-hidden="true"></div>
                        Loading assignments...
                    </div>
                ) : error ? (
                    <div className="empty-state" role="alert">
                        <div className="empty-state__icon">⚠️</div>
                        <div className="empty-state__title">Unable to load assignments</div>
                        <p className="empty-state__desc">{error}</p>
                        <button className="btn btn--primary" onClick={fetchAssignments} style={{ marginTop: '16px' }}>
                            Try Again
                        </button>
                    </div>
                ) : filteredAssignments.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state__icon">📭</div>
                        <div className="empty-state__title">No assignments found</div>
                        <p className="empty-state__desc">
                            {search ? `No results for "${search}"` : 'No assignments match the selected filter.'}
                        </p>
                        <button className="btn btn--secondary" onClick={() => { setSearch(''); setActiveFilter('all'); }} style={{ marginTop: '16px' }}>
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="assignments-page__grid" role="list">
                        {filteredAssignments.map((assignment, index) => (
                            <div key={assignment._id} role="listitem">
                                <AssignmentCard
                                    assignment={assignment}
                                    index={index}
                                    onAttempt={(id) => navigate(`/assignments/${id}`)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default AssignmentsPage;
