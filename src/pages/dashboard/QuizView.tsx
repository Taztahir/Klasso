import { useState, useEffect } from 'react';
import {
    Brain,
    Timer,
    ArrowRight,
    Trophy,
    RefreshCw,
    CheckCircle2,
    XCircle,
    ChevronRight,
    BarChart3,
    History as HistoryIcon,
    Loader2,
    Sparkles,
    Share2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { quizService, studySessionService, QuizAttempt } from '../../services/quizService';
import { aiService } from '../../services/aiService';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    userAnswer?: number;
}

export const QuizView = () => {
    const { showToast } = useToast();
    const [step, setStep] = useState<'topic' | 'setup' | 'quiz' | 'result' | 'review'>('topic');
    const [topic, setTopic] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPaused] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [result, setResult] = useState<QuizAttempt | null>(null);

    // Quiz Config
    const [questionCount, setQuestionCount] = useState(10);
    const [timePerQuestion, setTimePerQuestion] = useState(30);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [sessionStartTime, setSessionStartTime] = useState<number>(0);
    const [history, setHistory] = useState<{ totalQuizzes: number, avgScore: number }>({ totalQuizzes: 0, avgScore: 0 });

    useEffect(() => {
        const unsub = quizService.subscribeToStats((stats) => {
            setHistory(stats);
        });
        return () => unsub.unsubscribe();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'quiz' && timeLeft > 0 && !isPaused) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && step === 'quiz') {
            handleAnswer(-1); // Automatically handle as wrong if time runs out
        }
        return () => clearInterval(timer);
    }, [step, timeLeft, isPaused]);

    const handleGenerateQuestions = () => {
        if (!topic.trim()) {
            showToast('Enter Topic', 'Please enter a topic to generate a quiz.', 'error');
            return;
        }
        setStep('setup');
    };

    const startQuiz = async () => {
        setIsGenerating(true);
        try {
            showToast('AI thinking...', `Generating your ${topic} quiz now.`, 'info');
            const generated = await aiService.generateQuiz(topic, questionCount);

            if (!generated || generated.length === 0) {
                throw new Error("No questions generated");
            }

            setQuestions(generated);
            setStep('quiz');
            setTimeLeft(timePerQuestion);
            setScore(0);
            setCurrentQuestion(0);
            setSessionStartTime(Date.now());
            showToast('Quiz Ready', `Good luck with ${topic}!`, 'success');
        } catch (error) {
            console.error("Quiz generation failed:", error);
            showToast('Generation Failed', 'Einstein is taking a nap. Please try again.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAnswer = (index: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestion].userAnswer = index;
        setQuestions(updatedQuestions);

        if (index === questions[currentQuestion].correctAnswer) {
            setScore(prev => prev + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setTimeLeft(timePerQuestion);
        } else {
            finishQuiz(updatedQuestions);
        }
    };

    const finishQuiz = async (finalQuestions: Question[]) => {
        const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);
        const wrongAnswers = finalQuestions
            .filter(q => q.userAnswer !== q.correctAnswer)
            .map(q => ({
                id: q.id,
                text: q.text,
                userAnswer: q.userAnswer,
                correctAnswer: q.correctAnswer,
                options: q.options
            }));

        try {
            const savedQuiz = await quizService.saveQuizAttempt({
                topic,
                score,
                total_questions: finalQuestions.length,
                time_spent: timeSpent,
                wrong_answers: wrongAnswers
            });
            setResult(savedQuiz);
            await studySessionService.logStudyTime(timeSpent);
            setStep('result');
        } catch (err) {
            showToast('Sync Error', 'Could not save result, but you finished!', 'info');
            setStep('result');
        }
    };

    const handleShare = async () => {
        if (!result?.id) {
            showToast('Sharing Unavailable', 'This session was not saved to the vault.', 'error');
            return;
        }

        setIsSharing(true);
        const shareUrl = `${window.location.origin}/dashboard/quiz/share/${result.id}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            showToast('Link Copied', 'Share this link with your friends!', 'success');
        } catch (err) {
            showToast('Error', 'Failed to copy link.', 'error');
        } finally {
            setTimeout(() => setIsSharing(false), 2000);
        }
    };

    const resetQuiz = () => {
        setStep('topic');
        setTopic('');
    };

    if (step === 'topic') {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-1.5">
                    <div className="w-14 h-14 bg-[var(--brand-purple)]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Brain className="w-6 h-6 text-[var(--brand-purple)]" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tight italic">Quiz Center</h1>
                    <p className="text-[var(--text-muted)] font-medium text-xs">Test your knowledge on any subject instantly.</p>
                </div>

                <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1.5 block">What do you want to be quizzed on?</label>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Molecular Biology, WWII History..."
                            className="w-full bg-white border border-gray-200 rounded-xl p-3.5 font-bold focus:outline-none focus:ring-2 focus:ring-brandPurple/20 transition-all text-base shadow-sm backdrop-blur-md"
                        />
                        <button
                            onClick={handleGenerateQuestions}
                            className="w-full bg-[var(--brand-purple)] text-white py-3.5 rounded-xl font-black text-base shadow-md hover:shadow-none transition-all flex items-center justify-center gap-2 group"
                        >
                            Generate Quiz
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-[var(--border)] p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                            <BarChart3 className="w-3.5 h-3.5 text-[var(--brand-purple)]" />
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Total Quizzes</h4>
                        </div>
                        <p className="text-2xl font-black tracking-tight">{history.totalQuizzes}</p>
                    </div>
                    <div className="bg-white border border-[var(--border)] p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                            <Trophy className="w-3.5 h-3.5 text-[var(--brand-yellow)]" />
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Avg Score</h4>
                        </div>
                        <p className="text-2xl font-black tracking-tight">{history.avgScore}%</p>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'setup') {
        return (
            <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
                <div className="bg-white border border-[var(--border)] p-6 rounded-2xl shadow-sm space-y-6 text-center">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-1.5">Configure Quiz</h2>
                        <p className="text-[var(--text-muted)] font-bold uppercase text-[9px] tracking-widest">Topic: {topic}</p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-wider block text-left">How many questions?</label>
                            <div className="flex flex-wrap justify-center gap-2">
                                {[10, 20, 30, 40, 50].map(count => (
                                    <button
                                        key={count}
                                        onClick={() => setQuestionCount(count)}
                                        className={`px-4 py-2 rounded-xl font-black border border-[var(--border)] transition-all ${questionCount === count ? 'bg-[var(--brand-purple)] text-white shadow-md scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {count}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[11px] font-black uppercase tracking-wider block text-left">Time per question?</label>
                            <div className="flex flex-wrap justify-center gap-1.5">
                                {[15, 30, 45, 60].map(seconds => (
                                    <button
                                        key={seconds}
                                        onClick={() => setTimePerQuestion(seconds)}
                                        className={`px-3.5 py-1.5 rounded-lg font-black border border-[var(--border)] transition-all text-xs ${timePerQuestion === seconds ? 'bg-[var(--brand-yellow)] text-black shadow-md scale-105' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        {seconds}s
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={startQuiz}
                            disabled={isGenerating}
                            className="w-full bg-[var(--brand-black)] text-white py-6 rounded-2xl font-black text-xl shadow-lg border border-transparent transition-all mt-4 flex items-center justify-center gap-4 disabled:opacity-50 group"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    GENERATING...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6 text-[var(--brand-yellow)] group-hover:animate-pulse" />
                                    START QUIZ
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'quiz') {
        const question = questions[currentQuestion];
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between bg-white border border-[var(--border)] p-3 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[var(--brand-yellow)] rounded-lg flex items-center justify-center border border-white shadow-sm">
                            <span className="font-black tracking-tight text-sm">{currentQuestion + 1}</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-extrabold uppercase tracking-widest text-[var(--text-muted)]">Question</p>
                            <p className="font-black text-xs uppercase italic">{currentQuestion + 1} of {questions.length}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] shadow-sm ${timeLeft < 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[var(--brand-black)]'}`}>
                        <Timer className="w-3.5 h-3.5" />
                        <span className="font-black tabular-nums text-xs">{timeLeft}s</span>
                    </div>
                </div>

                <div className="bg-white border border-[var(--border)] p-6 rounded-2xl shadow-sm space-y-6">
                    <h2 className="text-xl font-black leading-tight italic">{question.text}</h2>

                    <div className="grid grid-cols-1 gap-3">
                        {question.options.map((option, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                className="w-full p-3.5 text-left bg-white border border-[var(--border)] shadow-sm rounded-xl font-bold hover:bg-[var(--brand-purple)] hover:text-white hover:border-transparent hover:shadow-md transition-all text-base"
                            >
                                <span className="inline-block w-6 font-black opacity-30 text-sm">{['A', 'B', 'C', 'D'][i]}.</span>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full bg-[var(--brand-black)]/10 h-3 rounded-full overflow-hidden border border-[var(--border)] shadow-inner">
                    <div
                        className="h-full bg-[var(--brand-purple)] transition-all duration-500"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>
        );
    }

    if (step === 'result') {
        return (
            <div className="max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="bg-white border border-[var(--border)] p-8 rounded-2xl shadow-sm space-y-5">
                    <div className="w-16 h-16 bg-[var(--brand-yellow)] border-2 border-white rounded-xl flex items-center justify-center mx-auto rotate-3 shadow-lg mb-6 transform hover:rotate-6 transition-transform">
                        <Trophy className="w-8 h-8 text-black" />
                    </div>

                    <h1 className="text-3xl font-black uppercase tracking-tight">Session Over</h1>
                    <div className="space-y-0.5">
                        <p className="text-5xl font-black text-[var(--brand-purple)] italic">{Math.round((score / questions.length) * 100)}%</p>
                        <p className="font-bold text-[var(--text-muted)] uppercase tracking-widest text-[11px]">You scored {score} out of {questions.length}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-6">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setStep('review')}
                                className="bg-[var(--brand-yellow)] text-black py-3.5 rounded-lg font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                Review Mistake
                                <HistoryIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleShare}
                                className="bg-white text-[var(--brand-black)] py-3.5 rounded-lg font-black text-sm border border-[var(--border)] shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                {isSharing ? 'COPIED!' : 'Share Score'}
                                <Share2 className={`w-4 h-4 ${isSharing ? 'text-[var(--brand-purple)] animate-pulse' : ''}`} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={startQuiz}
                                className="bg-[var(--brand-black)] text-white py-3.5 rounded-lg font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
                            >
                                Try Again
                                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                            <button
                                onClick={resetQuiz}
                                className="bg-white text-[var(--brand-black)] py-3.5 rounded-lg font-black text-sm border border-[var(--border)] shadow-sm hover:shadow-none transition-all"
                            >
                                New Topic
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'review') {
        const wrongAnswers = questions.filter(q => q.userAnswer !== q.correctAnswer);

        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setStep('result')}
                        className="flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:text-[var(--brand-purple)] transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Results
                    </button>
                    <h2 className="text-xl font-black tracking-tight uppercase">Mistake Review</h2>
                </div>

                <div className="space-y-4">
                    {wrongAnswers.length === 0 ? (
                        <div className="bg-white border border-[var(--border)] p-12 rounded-3xl shadow-sm text-center">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-black tracking-tight">Perfect Score!</h3>
                            <p className="text-[var(--text-muted)] font-bold uppercase text-[10px] tracking-widest mt-2">Nothing to review here.</p>
                        </div>
                    ) : (
                        wrongAnswers.map((q, i) => (
                            <div key={i} className="bg-white border border-[var(--border)] p-6 rounded-2xl shadow-sm space-y-4">
                                <h3 className="text-lg font-black leading-tight italic">{q.text}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <XCircle size={10} /> Your Answer
                                        </p>
                                        <p className="font-bold text-sm text-red-700">{q.userAnswer === -1 ? 'Time Out' : q.options[q.userAnswer!]}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <CheckCircle2 size={10} /> Correct Answer
                                        </p>
                                        <p className="font-bold text-sm text-green-700">{q.options[q.correctAnswer]}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={resetQuiz}
                    className="w-full bg-[var(--brand-black)] text-white py-4 rounded-xl font-black text-lg shadow-md hover:shadow-none transition-all"
                >
                    NEW CHALLENGE
                </button>
            </div>
        );
    }

    return null;
};
