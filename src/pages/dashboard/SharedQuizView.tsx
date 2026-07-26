import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ArrowRight, Brain, Trophy, Clock, Target } from 'lucide-react';
import { quizService, QuizAttempt } from '../../services/quizService';
import { useToast } from '../../context/ToastContext';

export const SharedQuizView = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const [quiz, setQuiz] = useState<QuizAttempt | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId) return;
            try {
                const data = await quizService.getQuizById(quizId);
                setQuiz(data);
            } catch (err) {
                showToast('Not Found', 'This quiz archive could not be accessed.', 'error');
                navigate('/dashboard/quiz');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const handleAttempt = () => {
        if (quiz) {
            // Navigate to quiz view with the topic pre-filled in state or search params
            navigate('/dashboard/quiz', { state: { topic: quiz.topic } });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brandPurple border-t-transparent"></div>
            </div>
        );
    }

    if (!quiz) return null;

    const scorePercentage = Math.round((quiz.score / quiz.total_questions) * 100);

    return (
        <div className="max-w-3xl mx-auto py-8 px-6">
            <div className="bg-white border border-gray-100/80 shadow-sm backdrop-blur-sm bg-white/50 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="bg-brandPurple p-8 text-white relative h-48 flex flex-col justify-end">
                    <div className="absolute top-6 left-6 w-12 h-12 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Shared Quiz Results</p>
                        <h1 className="text-2xl font-black tracking-tight tracking-tighter italic">{quiz.topic}</h1>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-cream border border-gray-100/80 shadow-sm backdrop-blur-sm bg-white/50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                            <Trophy className="w-5 h-5 text-brandYellow mb-1.5" />
                            <p className="text-[9px] font-black uppercase text-brandBlack/40 mb-0.5">Score</p>
                            <p className="text-xl font-black tracking-tight">{scorePercentage}%</p>
                        </div>
                        <div className="bg-cream border border-gray-100/80 shadow-sm backdrop-blur-sm bg-white/50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                            <Target className="w-5 h-5 text-brandPurple mb-1.5" />
                            <p className="text-[9px] font-black uppercase text-brandBlack/40 mb-0.5">Correct</p>
                            <p className="text-xl font-black tracking-tight">{quiz.score}/{quiz.total_questions}</p>
                        </div>
                        <div className="bg-cream border border-gray-100/80 shadow-sm backdrop-blur-sm bg-white/50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                            <Clock className="w-5 h-5 text-blue-500 mb-1.5" />
                            <p className="text-[9px] font-black uppercase text-brandBlack/40 mb-0.5">Time</p>
                            <p className="text-xl font-black tracking-tight">{Math.floor(quiz.time_spent / 60)}m {quiz.time_spent % 60}s</p>
                        </div>
                        <div className="bg-cream border border-gray-100/80 shadow-sm backdrop-blur-sm bg-white/50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                            <Brain className="w-5 h-5 text-pink-500 mb-1.5" />
                            <p className="text-[9px] font-black uppercase text-brandBlack/40 mb-0.5">Type</p>
                            <p className="text-xl font-black tracking-tight underline decoration-brandBlack/10">AI GEN</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="text-center space-y-1">
                            <h2 className="text-xl font-black tracking-tight">Feeling sharp?</h2>
                            <p className="text-xs font-bold text-brandBlack/60">Try this quiz yourself and see if you can beat the score!</p>
                        </div>

                        <button
                            onClick={handleAttempt}
                            className="w-full bg-brandBlack text-white py-4 rounded-xl font-black text-lg shadow-premium hover:scale-[1.01] transition-all flex items-center justify-center gap-3 group"
                        >
                            ATTEMPT THIS QUIZ
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-brandBlack/30">
                Shared via Klasso School Engine
            </p>
        </div>
    );
};
