import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getAssignment, executeQuery, getHint, saveProgress, getProgress } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AttemptPage.scss';

const SampleDataViewer = ({ sampleTables }) => {
    const [open, setOpen] = useState(true);

    if (!sampleTables?.length) return null;

    return (
        <div className="sample-data">
            <div
                className="sample-data__header"
                onClick={() => setOpen(!open)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
                aria-expanded={open}
            >
                <h4>📊 Sample Data ({sampleTables.length} table{sampleTables.length !== 1 ? 's' : ''})</h4>
                <span className={`chevron ${open ? 'chevron--open' : ''}`} aria-hidden="true">▼</span>
            </div>

            {open && (
                <div className="sample-data__tables">
                    {sampleTables.map((table) => (
                        <div key={table.tableName}>
                            <div className="sample-data__table-name">{table.tableName}</div>
                            <div className="sample-data__table-wrapper">
                                <table aria-label={`Sample data for ${table.tableName}`}>
                                    <thead>
                                        <tr>
                                            {table.columns.map((col) => (
                                                <th key={col.columnName} title={col.dataType}>
                                                    {col.columnName}
                                                    <span style={{ opacity: 0.5, marginLeft: '4px', fontSize: '10px' }}>
                                                        {col.dataType}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.rows.map((row, i) => (
                                            <tr key={i}>
                                                {table.columns.map((col) => (
                                                    <td key={col.columnName}>
                                                        {row[col.columnName] === null ? <em style={{ opacity: 0.4 }}>NULL</em> : String(row[col.columnName])}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ResultsPanel Sub-component
const ResultsPanel = ({ result, error, loading }) => (
    <section className="results-panel" aria-label="Query results">
        <div className="results-panel__header">
            <div className="results-title">
                <span aria-hidden="true">📊</span> Results
            </div>
            {result && (
                <span className="results-panel__meta">
                    {result.rowCount} row{result.rowCount !== 1 ? 's' : ''}
                </span>
            )}
        </div>

        <div className="results-panel__body">
            {loading ? (
                <div className="results-panel__placeholder">
                    <div className="spinner" aria-hidden="true"></div>
                    <span>Executing query...</span>
                </div>
            ) : error ? (
                <div className="results-panel__error" role="alert">
                    <span className="results-panel__error-icon">❌</span>
                    <div className="results-panel__error-content">
                        <strong>Query Error</strong>
                        <p>{error}</p>
                    </div>
                </div>
            ) : result ? (
                <div className="results-panel__table-wrap">
                    <table>
                        <thead>
                            <tr>
                                {result.columns.map((col) => (
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {result.rows.length === 0 ? (
                                <tr><td colSpan={result.columns.length}>No rows returned</td></tr>
                            ) : (
                                result.rows.map((row, i) => (
                                    <tr key={i}>
                                        {result.columns.map((col) => (
                                            <td key={col}>{row[col] === null ? <em style={{ opacity: 0.4 }}>NULL</em> : String(row[col])}</td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="results-panel__placeholder">
                    <span className="results-panel__placeholder-icon" aria-hidden="true">⚡</span>
                    <span>Write a SQL query and click Execute to see results here</span>
                </div>
            )}
        </div>
    </section>
);

// HintPanel Sub-component
const HintPanel = ({ assignment, sql }) => {
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchHint = async () => {
        if (loading) return;
        try {
            setLoading(true);
            setError('');
            const res = await getHint({
                question: assignment.question,
                userSql: sql,
                sampleTables: assignment.sampleTables,
            });
            setHint(res.data.hint);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get hint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="hint-panel" aria-label="AI Hint">
            <div className="hint-panel__header">
                <div className="hint-title">
                    <span aria-hidden="true">💡</span> AI Hint
                </div>
                <button
                    className="hint-panel__btn"
                    onClick={fetchHint}
                    disabled={loading}
                    id="get-hint-btn"
                >
                    {loading ? (
                        <><span className="execute-btn__spinner" aria-hidden="true"></span> Thinking...</>
                    ) : (
                        <>💡 Get Hint</>
                    )}
                </button>
            </div>

            <div className="hint-panel__body">
                {error && (
                    <div className="alert alert--error" style={{ marginTop: '16px' }} role="alert">
                        ⚠️ {error}
                    </div>
                )}

                {hint && !loading && (
                    <div className="hint-panel__result">
                        <div className="hint-panel__result-header">
                            <span aria-hidden="true">🔮</span> AI Hint
                        </div>
                        <p>{hint}</p>
                    </div>
                )}

                <p className="hint-panel__disclaimer">
                    Hints guide your thinking — not the full solution!
                </p>
            </div>
        </section>
    );
};

// Main AttemptPage Component
const AttemptPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();

    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [sql, setSql] = useState('-- Write your SQL query here\nSELECT * FROM ');
    const [queryResult, setQueryResult] = useState(null);
    const [queryError, setQueryError] = useState('');
    const [executing, setExecuting] = useState(false);

    const editorRef = useRef(null);

    useEffect(() => {
        fetchAssignment();
    }, [id]);

    const fetchAssignment = async () => {
        try {
            setLoading(true);
            const res = await getAssignment(id);
            setAssignment(res.data.data);

            // Load saved progress if logged in
            if (isLoggedIn) {
                try {
                    const progRes = await getProgress(id);
                    if (progRes.data.data?.sqlQuery) {
                        setSql(progRes.data.data.sqlQuery);
                    }
                } catch { /* ignore */ }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Assignment not found');
        } finally {
            setLoading(false);
        }
    };

    const handleExecute = async () => {
        if (!sql.trim() || executing) return;
        try {
            setExecuting(true);
            setQueryError('');
            setQueryResult(null);
            const res = await executeQuery(id, sql);
            setQueryResult(res.data.data);

            // Save progress if logged in
            if (isLoggedIn) {
                saveProgress({ assignmentId: id, sqlQuery: sql }).catch(() => { });
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Query execution failed';
            setQueryError(msg);
        } finally {
            setExecuting(false);
        }
    };

    const handleEditorMount = (editor, monacoInstance) => {
        editorRef.current = editor;
        // Ctrl+Enter to execute
        editor.addCommand(
            // eslint-disable-next-line no-bitwise
            monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
            handleExecute
        );
    };

    if (loading) {
        return (
            <div className="page-loader" aria-busy="true">
                <div className="spinner spinner--lg" aria-hidden="true"></div>
                Loading assignment...
            </div>
        );
    }

    if (error) {
        return (
            <div className="empty-state" role="alert">
                <div className="empty-state__icon">⚠️</div>
                <div className="empty-state__title">Assignment not found</div>
                <p className="empty-state__desc">{error}</p>
                <button className="btn btn--primary" onClick={() => navigate('/assignments')} style={{ marginTop: '16px' }}>
                    Back to Assignments
                </button>
            </div>
        );
    }

    return (
        <div className="attempt-page">
            {/* Back Bar */}
            <div className="attempt-page__back-bar">
                <button className="back-btn" onClick={() => navigate('/assignments')} aria-label="Go back to assignments">
                    Back
                </button>
                <h2>{assignment.title}</h2>
                <span className={`badge badge--${assignment.difficulty.toLowerCase()}`}>
                    {assignment.difficulty}
                </span>
            </div>

            {/* Main Layout */}
            <div className="attempt-page__layout">
                {/* Left Panel: Question + Sample Data */}
                <aside className="attempt-page__left" aria-label="Assignment details">
                    <div className="question-panel">
                        <div className="question-panel__header">
                            <h3>📝 Question</h3>
                        </div>
                        <div className="question-panel__body">
                            <p className="question-panel__question">{assignment.question}</p>
                        </div>
                    </div>
                    <SampleDataViewer sampleTables={assignment.sampleTables} />
                </aside>

                {/* Right Panel: Editor + Results + Hint */}
                <div className="attempt-page__right">
                    {/* SQL Editor */}
                    <section className="editor-panel" aria-label="SQL Editor">
                        <div className="editor-panel__header">
                            <div className="editor-title">
                                <span aria-hidden="true">✏️</span> SQL Editor
                            </div>
                        </div>

                        <div className="editor-panel__editor-wrap">
                            <Editor
                                height="260px"
                                language="sql"
                                theme="vs-dark"
                                value={sql}
                                onChange={(val) => setSql(val || '')}
                                onMount={handleEditorMount}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    wordWrap: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    suggestOnTriggerCharacters: true,
                                    tabSize: 2,
                                    renderLineHighlight: 'all',
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                    fontLigatures: true,
                                    padding: { top: 12, bottom: 12 },
                                }}
                                aria-label="SQL query editor"
                            />
                        </div>

                        <div className="editor-panel__footer">
                            <div className="editor-panel__actions">
                                <button
                                    id="execute-query-btn"
                                    className="execute-btn"
                                    onClick={handleExecute}
                                    disabled={executing || !sql.trim()}
                                    aria-busy={executing}
                                >
                                    {executing ? (
                                        <><span className="execute-btn__spinner" aria-hidden="true"></span> Executing...</>
                                    ) : (
                                        <><span aria-hidden="true">▶</span> Execute Query</>
                                    )}
                                </button>

                                <button
                                    className="btn btn--ghost btn--sm"
                                    onClick={() => { setSql('-- Write your SQL query here\nSELECT * FROM '); setQueryResult(null); setQueryError(''); }}
                                    title="Clear editor"
                                >
                                    🗑 Clear
                                </button>
                            </div>
                            <span className="editor-panel__shortcut">Ctrl+Enter to run</span>
                        </div>
                    </section>

                    {/* Results Panel */}
                    <ResultsPanel result={queryResult} error={queryError} loading={executing} />

                    {/* Hint Panel */}
                    <HintPanel assignment={assignment} sql={sql} />
                </div>
            </div>
        </div>
    );
};

export default AttemptPage;