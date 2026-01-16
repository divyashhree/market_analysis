'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import {
  BookOpen,
  Trophy,
  Target,
  Clock,
  ChevronRight,
  Play,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Lightbulb,
  History,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  icon: string;
  chaptersCount: number;
  hasQuiz: boolean;
}

interface CaseStudy {
  id: string;
  title: string;
  icon: string;
  date: string;
  summary: string;
}

interface QuizQuestion {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  options: string[];
}

export default function LearnPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [activeTab, setActiveTab] = useState<'tutorials' | 'cases' | 'quiz'>('tutorials');
  const [quiz, setQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [tutorialsData, casesData] = await Promise.all([
        api.getTutorials(),
        api.getCaseStudies(),
      ]);
      setTutorials(tutorialsData);
      setCaseStudies(casesData);
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  const loadTutorial = async (id: string) => {
    try {
      const data = await api.getTutorial(id);
      setSelectedTutorial(data);
      setCurrentChapter(0);
    } catch (error) {
      console.error('Failed to load tutorial:', error);
    }
  };

  const loadCaseStudy = async (id: string) => {
    try {
      const data = await api.getCaseStudy(id);
      setSelectedCaseStudy(data);
    } catch (error) {
      console.error('Failed to load case study:', error);
    }
  };

  const startQuiz = async () => {
    setLoading(true);
    try {
      const data = await api.generateQuiz({ count: 5 });
      setQuiz(data);
      setQuizAnswers({});
      setQuizResult(null);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!quiz) return;
    
    const answers = quiz.questions.map((q: QuizQuestion) => ({
      questionId: q.id,
      answer: quizAnswers[q.id] ?? -1,
    }));
    
    try {
      const result = await api.submitQuiz(quiz.id, answers);
      setQuizResult(result);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'badge-success';
      case 'intermediate': return 'badge-warning';
      case 'advanced': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            Interactive Learning
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Learning Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Master market analysis through interactive tutorials, real case studies,
            and test your knowledge with quizzes
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-lg">
            {[
              { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
              { id: 'cases', label: 'Case Studies', icon: History },
              { id: 'quiz', label: 'Quiz Mode', icon: Target },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorials Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'tutorials' && (
            <motion.div
              key="tutorials"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {!selectedTutorial ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutorials.map((tutorial, index) => (
                    <motion.div
                      key={tutorial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => loadTutorial(tutorial.id)}
                      className="feature-card cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center text-3xl">
                          {tutorial.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{tutorial.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={getDifficultyColor(tutorial.difficulty)}>
                              {tutorial.difficulty}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {tutorial.duration}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span>{tutorial.chaptersCount} chapters</span>
                            {tutorial.hasQuiz && (
                              <span className="flex items-center gap-1 text-emerald-500">
                                <Target className="w-3 h-3" />
                                Quiz included
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Start learning</span>
                        <ChevronRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-4xl mx-auto"
                >
                  {/* Tutorial Header */}
                  <div className="glass-card p-6 mb-6">
                    <button
                      onClick={() => setSelectedTutorial(null)}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 flex items-center gap-1"
                    >
                      ← Back to tutorials
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{selectedTutorial.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedTutorial.title}</h2>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={getDifficultyColor(selectedTutorial.difficulty)}>
                            {selectedTutorial.difficulty}
                          </span>
                          <span className="text-sm text-gray-500">
                            Chapter {currentChapter + 1} of {selectedTutorial.chapters.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentChapter + 1) / selectedTutorial.chapters.length) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chapter Content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentChapter}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-card p-8"
                    >
                      <h3 className="text-xl font-bold mb-6">
                        {selectedTutorial.chapters[currentChapter].title}
                      </h3>
                      <div className="prose dark:prose-invert max-w-none">
                        {selectedTutorial.chapters[currentChapter].content.split('\n').map((line: string, i: number) => (
                          <p key={i} className="mb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
                        <button
                          onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                          disabled={currentChapter === 0}
                          className="btn-secondary disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {currentChapter < selectedTutorial.chapters.length - 1 ? (
                          <button
                            onClick={() => setCurrentChapter(currentChapter + 1)}
                            className="btn-primary"
                          >
                            Next Chapter
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedTutorial(null)}
                            className="btn-primary bg-gradient-to-r from-emerald-500 to-teal-500"
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Complete Tutorial
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Case Studies Tab */}
          {activeTab === 'cases' && (
            <motion.div
              key="cases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {!selectedCaseStudy ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {caseStudies.map((study, index) => (
                    <motion.div
                      key={study.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => loadCaseStudy(study.id)}
                      className="feature-card cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center text-4xl">
                          {study.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{study.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{study.date}</p>
                          <p className="text-gray-600 dark:text-gray-400">{study.summary}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-sm text-amber-600 dark:text-amber-400">View detailed analysis</span>
                        <ChevronRight className="w-5 h-5 text-amber-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="glass-card p-8">
                    <button
                      onClick={() => setSelectedCaseStudy(null)}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 flex items-center gap-1"
                    >
                      ← Back to case studies
                    </button>
                    
                    <div className="flex items-center gap-4 mb-8">
                      <div className="text-5xl">{selectedCaseStudy.icon}</div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedCaseStudy.title}</h2>
                        <p className="text-gray-500">{selectedCaseStudy.date}</p>
                      </div>
                    </div>

                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                      {selectedCaseStudy.summary}
                    </p>

                    {/* Impact Grid */}
                    <h3 className="text-lg font-bold mb-4">Market Impact</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                      <div className="stat-card">
                        <div className="text-sm text-gray-500 mb-1">Immediate</div>
                        <div className={`text-2xl font-bold ${selectedCaseStudy.impact.nifty.immediate >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {selectedCaseStudy.impact.nifty.immediate >= 0 ? '+' : ''}{selectedCaseStudy.impact.nifty.immediate}%
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="text-sm text-gray-500 mb-1">1 Month</div>
                        <div className={`text-2xl font-bold ${selectedCaseStudy.impact.nifty['1month'] >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {selectedCaseStudy.impact.nifty['1month'] >= 0 ? '+' : ''}{selectedCaseStudy.impact.nifty['1month']}%
                        </div>
                      </div>
                      {selectedCaseStudy.impact.nifty['3month'] && (
                        <div className="stat-card">
                          <div className="text-sm text-gray-500 mb-1">3 Months</div>
                          <div className={`text-2xl font-bold ${selectedCaseStudy.impact.nifty['3month'] >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {selectedCaseStudy.impact.nifty['3month'] >= 0 ? '+' : ''}{selectedCaseStudy.impact.nifty['3month']}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sector Impact */}
                    <h3 className="text-lg font-bold mb-4">Sector-wise Impact</h3>
                    <div className="space-y-3 mb-8">
                      {Object.entries(selectedCaseStudy.impact.sectors).map(([sector, data]: [string, any]) => (
                        <div key={sector} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="w-32 font-medium">{sector}</div>
                          <div className={`w-20 font-bold ${data.impact >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {data.impact >= 0 ? '+' : ''}{data.impact}%
                          </div>
                          <div className="flex-1 text-sm text-gray-500 dark:text-gray-400">
                            {data.reason}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Key Lessons */}
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Key Lessons
                    </h3>
                    <div className="space-y-3">
                      {selectedCaseStudy.lessons.map((lesson: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl">
                          <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              {!quiz && !quizResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                    <Target className="w-12 h-12 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Test Your Knowledge</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Take a quick 5-question quiz to test your understanding of market
                    concepts, correlations, and Indian economy
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startQuiz}
                    disabled={loading}
                    className="btn-primary bg-gradient-to-r from-purple-500 to-pink-500 text-lg"
                  >
                    {loading ? (
                      <span className="animate-spin mr-2">⏳</span>
                    ) : (
                      <Play className="w-5 h-5 mr-2" />
                    )}
                    Start Quiz
                  </motion.button>
                </motion.div>
              )}

              {quiz && !quizResult && (
                <div className="space-y-6">
                  {quiz.questions.map((question: QuizQuestion, qIndex: number) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qIndex * 0.1 }}
                      className="glass-card p-6"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400">
                          {qIndex + 1}
                        </span>
                        <span className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
                      <div className="grid gap-3">
                        {question.options.map((option, oIndex) => (
                          <button
                            key={oIndex}
                            onClick={() => setQuizAnswers({ ...quizAnswers, [question.id]: oIndex })}
                            className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                              quizAnswers[question.id] === oIndex
                                ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                                : 'bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border-2 border-transparent'
                            }`}
                          >
                            <span className="font-medium">{option}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitQuiz}
                    className="btn-primary w-full text-lg"
                  >
                    Submit Answers
                  </motion.button>
                </div>
              )}

              {quizResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 text-center"
                >
                  <div className="mb-6">
                    {quizResult.badge && (
                      <div className="text-4xl mb-4">{quizResult.badge.split(' ')[0]}</div>
                    )}
                    <h2 className="text-3xl font-bold mb-2">
                      {quizResult.score} / {quizResult.total} Correct
                    </h2>
                    <p className="text-gray-500">Grade: {quizResult.grade}</p>
                  </div>

                  <div className="w-32 h-32 mx-auto mb-8 relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        className="text-gray-200 dark:text-slate-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                      <motion.circle
                        className="text-purple-500"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                        initial={{ strokeDasharray: '0 352' }}
                        animate={{ strokeDasharray: `${(parseFloat(quizResult.percentage) / 100) * 352} 352` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{quizResult.percentage}%</span>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setQuiz(null);
                        setQuizResult(null);
                      }}
                      className="btn-secondary"
                    >
                      View Results
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startQuiz}
                      className="btn-primary"
                    >
                      Try Again
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
