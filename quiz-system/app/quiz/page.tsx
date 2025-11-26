'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Question {
  id: number;
  content: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export default function QuizPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const retryMode = searchParams.get('retry') === 'true';
  const sessionId = searchParams.get('sessionId');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);

      if (retryMode && sessionId) {
        const response = await fetch(`/api/wrong-answers?sessionId=${sessionId}`);
        const data = await response.json();
        const normalizedQuestions: Question[] = (data.wrongAnswers || [])
          .map((item: any) => {
            const questionId = typeof item.id === 'number' ? item.id : Number(item.question_id);
            if (!Number.isFinite(questionId)) {
              return null;
            }

            return {
              id: questionId,
              content: item.content,
              option_a: item.option_a,
              option_b: item.option_b,
              option_c: item.option_c,
              option_d: item.option_d,
            } as Question;
          })
          .filter((item): item is Question => item !== null);
        setQuestions(normalizedQuestions);
      } else {
        const response = await fetch('/api/questions');
        const data = await response.json();
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  }, [retryMode, sessionId]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadQuestions();
    }
  }, [status, loadQuestions]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">
                  <span className="text-cyan-500">QU</span>
                  <span className="text-yellow-500">IZ</span>
                </div>
              </div>
              <button onClick={() => router.push('/')} className="text-gray-600 hover:text-gray-900">
                ← Về trang chủ
              </button>
            </div>
          </div>
        </nav>
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Chưa có câu hỏi
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng liên hệ quản trị viên để thêm câu hỏi
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (option: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: option,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      if (!confirm(`Bạn còn ${unanswered.length} câu chưa trả lời. Bạn có muốn nộp bài không?`)) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const answerArray = questions.map(q => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] || '',
      }));

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerArray }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem(`quiz_results_${data.sessionId}`, JSON.stringify(data));
        router.push(`/results?sessionId=${data.sessionId}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Có lỗi xảy ra khi nộp bài');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <span className="text-cyan-500">QU</span>
                <span className="text-yellow-500">IZ</span>
              </div>
              <span className="text-gray-400 text-sm ml-2">
                {retryMode ? 'Làm lại câu sai' : 'Bài trắc nghiệm'}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{session.user?.name}</span>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                ← Thoát
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {retryMode ? '🔄 Làm lại câu sai' : '📝 Bài Trắc Nghiệm'}
              </h1>
              <p className="text-gray-600 mt-1">
                Câu {currentIndex + 1} / {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Đã trả lời</div>
              <div className="text-2xl font-bold text-cyan-500">
                {answeredCount}/{questions.length}
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-3 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full mb-4 font-semibold">
              <span className="mr-2">❓</span>
              Câu {currentIndex + 1}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
              {currentQuestion.content}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map((option) => {
              const optionKey = `option_${option.toLowerCase()}` as keyof Question;
              const optionText = currentQuestion[optionKey] as string;
              const isSelected = answers[currentQuestion.id] === option;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50 shadow-md scale-[1.02]'
                      : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                      isSelected
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {option}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-800">{optionText}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 
                disabled:text-gray-400 disabled:cursor-not-allowed
                text-gray-700 font-semibold rounded-full transition"
            >
              ← Câu trước
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                  text-white font-semibold rounded-full shadow-lg transition"
              >
                {submitting ? 'Đang nộp...' : '✓ Nộp bài'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 
                  text-white font-semibold rounded-full transition"
              >
                Câu sau →
              </button>
            )}
          </div>

          {/* Question Grid */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Chuyển đến câu:</p>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`aspect-square rounded-lg font-semibold text-sm transition ${
                    idx === currentIndex
                      ? 'bg-cyan-600 text-white'
                      : answers[q.id]
                      ? 'bg-green-100 text-green-800 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
