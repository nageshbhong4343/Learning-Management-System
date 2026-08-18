import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { assessmentApi, AssessmentTest, Question } from '../../api/assessment';
import { FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Brain, Calculator, MessageSquare, PieChart } from 'lucide-react';

export const AptitudePage: React.FC = () => {
  const [tests, setTests] = useState<AssessmentTest[]>([]);
  const [activeTest, setActiveTest] = useState<AssessmentTest | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const data = await assessmentApi.getTests();
      setTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [String(questionId)]: optionId,
    }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setSubmitting(true);
    try {
      const res = await assessmentApi.submitTestAttempt(activeTest.id, selectedAnswers, 120);
      setResult(res);
    } catch (err) {
      alert('Failed to submit test attempt.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-white">Aptitude & MCQ Practice Engine</h1>
        <p className="text-xs text-slate-400">Quantitative Aptitude, Logical Reasoning, Verbal Ability & Technical MCQs.</p>
      </div>

      {/* 4 Aptitude Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-amber-500 cursor-pointer hover:bg-slate-850">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">Quantitative</h4>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Time & Work, Probabilities, Ratios</p>
        </Card>
        <Card className="border-l-4 border-l-blue-500 cursor-pointer hover:bg-slate-850">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-semibold text-white">Logical Reasoning</h4>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Coding-Decoding, Puzzles, Series</p>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 cursor-pointer hover:bg-slate-850">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Verbal Ability</h4>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Grammar, Reading Comprehension</p>
        </Card>
        <Card className="border-l-4 border-l-purple-500 cursor-pointer hover:bg-slate-850">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">Data Interpretation</h4>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Bar Graphs, Pie Charts, Tables</p>
        </Card>
      </div>

      {!activeTest ? (
        <Card title="Available Practice & Assessment Tests">
          {loading ? (
            <div className="py-8 text-center text-slate-400 text-xs">Loading assessments...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tests.map((test) => (
                <div key={test.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{test.title}</h3>
                      <Badge variant="amber" size="sm">{test.test_type}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{test.description || 'Practice test with timed questions.'}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span>⏱ {test.duration_minutes} Minutes</span>
                      <span>•</span>
                      <span>Threshold: {test.passing_percentage}%</span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => { setActiveTest(test); setResult(null); setSelectedAnswers({}); }}>
                    Start Test
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">{activeTest.title}</h2>
              <p className="text-xs text-slate-400">Duration: {activeTest.duration_minutes} Mins • Passing Threshold: {activeTest.passing_percentage}%</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveTest(null)}>Exit Test</Button>
          </div>

          {result ? (
            /* Result Overview Card */
            <div className="space-y-6 text-center py-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center font-bold text-2xl border-4 ${
                result.is_passed ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-rose-950 border-rose-500 text-rose-400'
              }`}>
                {result.percentage.toFixed(0)}%
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {result.is_passed ? '🎉 Congratulations! Test Passed' : '⚠️ Keep Practicing! Threshold Not Reached'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Score: {result.score} / {result.total_possible} Correct</p>
              </div>
              <Button variant="primary" onClick={() => { setActiveTest(null); setResult(null); }}>
                Back to Tests
              </Button>
            </div>
          ) : (
            /* Questions Viewer */
            <div className="space-y-6">
              {activeTest.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-400">Question #{idx + 1}</span>
                    <Badge variant="slate" size="sm">{q.difficulty}</Badge>
                  </div>
                  <p className="text-sm font-semibold text-white">{q.text}</p>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedAnswers[String(q.id)] === opt.id;
                      return (
                        <label
                          key={opt.id}
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                            isSelected
                              ? 'border-blue-500 bg-blue-950/40 text-blue-200 font-semibold'
                              : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-xs">{opt.option_text}</span>
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            checked={isSelected}
                            onChange={() => {}}
                            className="accent-blue-500"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={submitting}
                  onClick={handleSubmitTest}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Submit Assessment
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

    </div>
  );
};
