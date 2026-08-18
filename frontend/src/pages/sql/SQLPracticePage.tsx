import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { assessmentApi, SQLProblem } from '../../api/assessment';
import { Database, Play, CheckCircle2, AlertTriangle, Table } from 'lucide-react';

export const SQLPracticePage: React.FC = () => {
  const [problems, setProblems] = useState<SQLProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<SQLProblem | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const data = await assessmentApi.getSQLProblems();
      setProblems(data);
      if (data.length > 0) {
        selectProblem(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectProblem = (p: SQLProblem) => {
    setSelectedProblem(p);
    setQuery('SELECT u.username, u.email, sp.cgpa\nFROM accounts_user u\nJOIN accounts_studentprofile sp ON u.id = sp.user_id\nWHERE sp.cgpa > 8.5\nORDER BY sp.cgpa DESC;\n');
    setResult(null);
    setError(null);
  };

  const handleExecute = async () => {
    if (!selectedProblem) return;
    setExecuting(true);
    setError(null);
    setResult(null);
    try {
      const res = await assessmentApi.executeSQLQuery(selectedProblem.id, query);
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to execute query.');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-white">SQL Practice & Sandbox</h1>
        <p className="text-xs text-slate-400">PostgreSQL relational query environment, DDL schema viewer & validation engine.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: SQL Problem Archive */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="SQL Questions & Tasks">
            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs">Loading SQL problems...</div>
            ) : (
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {problems.map((p) => {
                  const isSelected = selectedProblem?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => selectProblem(p)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/40 text-white font-semibold'
                          : 'border-slate-800 bg-slate-950/50 hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Query Editor & Schema Viewer */}
        <div className="lg:col-span-8 space-y-4">
          {selectedProblem && (
            <>
              <Card title={selectedProblem.title}>
                <p className="text-xs text-slate-300 mb-3">{selectedProblem.description}</p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <h4 className="text-[11px] font-semibold text-slate-400 mb-1">Database Schema & Tables (DDL):</h4>
                  <pre className="text-[10px] font-mono text-cyan-300 overflow-x-auto">
                    <code>{selectedProblem.database_schema}</code>
                  </pre>
                </div>
              </Card>

              {/* SQL Editor */}
              <Card>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-cyan-400" /> query.sql
                  </span>
                  <Button variant="primary" size="sm" isLoading={executing} onClick={handleExecute} leftIcon={<Play className="w-3.5 h-3.5" />}>
                    Run SQL Query
                  </Button>
                </div>

                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950 text-cyan-300 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  spellCheck={false}
                />
              </Card>

              {/* Error Output */}
              {error && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Results Table Output */}
              {result && (
                <Card title="Query Results & Validation">
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="green" size="md">
                      <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> Query Execution Success
                    </Badge>
                    <span className="text-xs text-slate-400">Time: {result.execution_time_ms?.toFixed(1)}ms</span>
                  </div>

                  {result.columns && result.columns.length > 0 ? (
                    <div className="overflow-x-auto border border-slate-800 rounded-lg">
                      <table className="w-full text-left text-xs text-slate-200">
                        <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                          <tr>
                            {result.columns.map((col: string, idx: number) => (
                              <th key={idx} className="p-2.5">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 bg-slate-900/40 font-mono">
                          {result.rows.map((row: any[], rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-slate-800/50">
                              {row.map((cell: any, cIdx: number) => (
                                <td key={cIdx} className="p-2.5">{String(cell)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Query executed successfully (0 rows returned).</p>
                  )}
                </Card>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
};
