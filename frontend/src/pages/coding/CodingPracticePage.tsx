import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { assessmentApi, CodingProblem } from '../../api/assessment';
import { Code, Play, CheckCircle2, AlertTriangle, Terminal, Cpu } from 'lucide-react';

export const CodingPracticePage: React.FC = () => {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const data = await assessmentApi.getCodingProblems();
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

  const selectProblem = (p: CodingProblem) => {
    setSelectedProblem(p);
    setCode(p.starter_code?.python || '# Write your solution below\nimport sys\n\ndef main():\n    print("Hello LMS")\n\nif __name__ == "__main__":\n    main()\n');
    setOutput(null);
  };

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    setRunning(true);
    try {
      const res = await assessmentApi.runCode(selectedProblem.id, code, language);
      setOutput(res);
    } catch (err: any) {
      setOutput({ error: err?.response?.data?.error || 'Execution failed.' });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!selectedProblem) return;
    setRunning(true);
    try {
      const res = await assessmentApi.submitCode(selectedProblem.id, code, language);
      setOutput(res);
    } catch (err: any) {
      setOutput({ error: err?.response?.data?.error || 'Submission failed.' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sandboxed Coding Practice</h1>
          <p className="text-xs text-slate-400">Multi-language isolated execution sandbox with testcase verification.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white text-xs rounded-lg px-3 py-2"
          >
            <option value="python">Python 3.12</option>
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="cpp">C++ 20</option>
            <option value="java">Java 21</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Problems List */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="Problem Archive">
            {loading ? (
              <div className="py-8 text-center text-slate-400 text-xs">Loading coding problems...</div>
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
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant={p.difficulty === 'EASY' ? 'green' : p.difficulty === 'MEDIUM' ? 'amber' : 'red'} size="sm">
                          {p.difficulty}
                        </Badge>
                        <span className="text-[10px] text-slate-400">{p.topic}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Code Editor & Execution Results */}
        <div className="lg:col-span-8 space-y-4">
          {selectedProblem && (
            <>
              <Card title={selectedProblem.title} subtitle={`Topic: ${selectedProblem.topic}`}>
                <p className="text-xs text-slate-300 mb-3">{selectedProblem.description}</p>
                <div className="text-[11px] text-slate-400 space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono">
                  <div>Input Format: {selectedProblem.input_format || 'Standard input'}</div>
                  <div>Output Format: {selectedProblem.output_format || 'Standard output'}</div>
                </div>
              </Card>

              {/* Code Editor Box */}
              <Card>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
                  <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-blue-400" /> solution.py
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" isLoading={running} onClick={handleRunCode} leftIcon={<Play className="w-3.5 h-3.5" />}>
                      Run Test Cases
                    </Button>
                    <Button variant="primary" size="sm" isLoading={running} onClick={handleSubmitCode} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                      Submit Solution
                    </Button>
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  spellCheck={false}
                />
              </Card>

              {/* Output Panel */}
              {output && (
                <Card title="Sandboxed Execution Runner Results">
                  {output.status ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={output.status === 'ACCEPTED' ? 'green' : 'red'} size="md">
                          STATUS: {output.status}
                        </Badge>
                        <span className="text-xs text-slate-400">Cases Passed: {output.passed_cases} / {output.total_cases} • {output.execution_time_ms?.toFixed(1)}ms</span>
                      </div>
                      {output.error_output && (
                        <pre className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono rounded-lg">
                          {output.error_output}
                        </pre>
                      )}
                    </div>
                  ) : output.results ? (
                    <div className="space-y-2">
                      {output.results.map((res: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
                          <div className="flex justify-between items-center mb-1">
                            <span>Test Case #{idx + 1}</span>
                            <Badge variant={res.passed ? 'green' : 'red'} size="sm">
                              {res.passed ? 'PASSED' : 'FAILED'}
                            </Badge>
                          </div>
                          <div>Expected: {res.expected}</div>
                          <div>Actual: {res.actual}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Card>
              )}
            </>
          )}
        </div>

      </div>

    </div>
  );
};
