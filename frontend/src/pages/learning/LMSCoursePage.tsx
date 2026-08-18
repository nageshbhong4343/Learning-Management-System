import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { learningApi, Course, Subject, Topic, Lesson, LearningMaterial } from '../../api/learning';
import { BookOpen, CheckCircle2, Circle, PlayCircle, FileText, Code, ExternalLink, ChevronRight } from 'lucide-react';

export const LMSCoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await learningApi.getCourses();
      setCourses(data);
      if (data.length > 0 && data[0].subjects.length > 0 && data[0].subjects[0].topics.length > 0 && data[0].subjects[0].topics[0].lessons.length > 0) {
        setSelectedLesson(data[0].subjects[0].topics[0].lessons[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (lesson: Lesson) => {
    try {
      const res = await learningApi.toggleLessonComplete(lesson.id);
      setSelectedLesson({
        ...lesson,
        is_completed: res.is_completed,
      });
      fetchCourses();
    } catch (err) {
      alert('Failed to update progress.');
    }
  };

  const activeCourse = courses[0];

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-white">Learning Management System</h1>
        <p className="text-xs text-slate-400">Structured Curriculum: Course → Subject → Topic → Lesson → Materials & Assignments.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading LMS curriculum...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar: Curriculum Tree Navigation */}
          <div className="lg:col-span-4 space-y-4">
            <Card title="Curriculum Topics & Lessons">
              <div className="space-y-4 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
                {activeCourse?.subjects.map((subject) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{subject.name}</span>
                    </div>

                    {subject.topics.map((topic) => (
                      <div key={topic.id} className="ml-3 pl-3 border-l border-slate-800 space-y-1.5">
                        <h4 className="text-xs font-semibold text-slate-200">{topic.title}</h4>

                        {topic.lessons.map((lesson) => {
                          const isSelected = selectedLesson?.id === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition ${
                                isSelected
                                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                                  : 'bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {lesson.is_completed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                )}
                                <span className="truncate">{lesson.title}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 ml-1">{lesson.duration_minutes}m</span>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Main Panel: Lesson Content Viewer */}
          <div className="lg:col-span-8">
            {selectedLesson ? (
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedLesson.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">{selectedLesson.summary}</p>
                  </div>

                  <Button
                    variant={selectedLesson.is_completed ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleComplete(selectedLesson)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    {selectedLesson.is_completed ? 'Completed' : 'Mark Completed'}
                  </Button>
                </div>

                {/* Lesson Materials List */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lesson Materials & Resources</h3>

                  {selectedLesson.materials?.length === 0 ? (
                    <p className="text-xs text-slate-500">No material attachments for this lesson yet.</p>
                  ) : (
                    selectedLesson.materials?.map((mat) => (
                      <div key={mat.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {mat.material_type === 'TEXT' && <FileText className="w-4 h-4 text-blue-400" />}
                            {mat.material_type === 'VIDEO' && <PlayCircle className="w-4 h-4 text-rose-400" />}
                            {mat.material_type === 'CODE' && <Code className="w-4 h-4 text-emerald-400" />}
                            <h4 className="text-sm font-semibold text-white">{mat.title}</h4>
                          </div>
                          <Badge variant="slate" size="sm">{mat.material_type}</Badge>
                        </div>

                        {mat.content_text && (
                          <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                            {mat.content_text}
                          </div>
                        )}

                        {mat.code_snippet && (
                          <pre className="text-xs font-mono bg-slate-900 text-emerald-300 p-3 rounded-lg border border-slate-800 overflow-x-auto">
                            <code>{mat.code_snippet}</code>
                          </pre>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-12 text-slate-400 text-sm">Select a lesson from the left curriculum tree to view materials.</div>
              </Card>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
