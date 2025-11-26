'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Result {
  questionId: number;
  content: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export default function ResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [results, setResults] = useState<Result[]>([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWrongOnly, setShowWrongOnly] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && sessionId) {
      loadResults();
    }
  }, [status, sessionId]);

  const loadResults = async () => {
    try {
      const cachedResults = localStorage.getItem(`quiz_results_${sessionId}`);
      if (cachedResults) {
        const parsed = JSON.parse(cachedResults);
        setResults(parsed.results || []);
        setScore(parsed.score || 0);
        setTotal(parsed.total || 0);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const wrongAnswers = results.filter(r => !r.isCorrect);
  const displayResults = showWrongOnly ? wrongAnswers : results;

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (percentage >= 80) return 'bg-green-50';
    if (percentage >= 50) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getScoreEmoji = () => {
    if (percentage >= 80) return '🎉';
    if (percentage >= 50) return '👍';
    return '💪';
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
              <span className="text-gray-400 text-sm ml-2">Kết quả</span>
            </div>
            
            <button onClick={() => router.push('/')} className="text-gray-600 hover:text-gray-900">
              ← Về trang chủ
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">{getScoreEmoji()}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Kết Quả Bài Làm
            </h1>
            <div className={`text-7xl font-bold ${getScoreColor()} mb-4`}>
              {percentage}%
            </div>
            <p className="text-xl text-gray-600">
              Đúng <span className="font-bold text-green-600">{score}</span> / {total} câu
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-6 text-center border-2 border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">{score}</div>
              <div className="text-sm text-green-800 font-semibold">Câu đúng</div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center border-2 border-red-200">
              <div className="text-4xl font-bold text-red-600 mb-2">{wrongAnswers.length}</div>
              <div className="text-sm text-red-800 font-semibold">Câu sai</div>
            </div>
            <div className={`${getScoreBgColor()} rounded-xl p-6 text-center border-2 ${
              percentage >= 80 ? 'border-green-200' : percentage >= 50 ? 'border-yellow-200' : 'border-red-200'
            }`}>
              <div className={`text-4xl font-bold ${getScoreColor()} mb-2`}>{percentage}%</div>
              <div className={`text-sm font-semibold ${getScoreColor()}`}>Điểm số</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/quiz')}
              className="flex-1 px-6 py-4 bg-cyan-600 hover:bg-cyan-700 
                text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105"
            >
              🔄 Làm lại toàn bộ
            </button>
            
            {wrongAnswers.length > 0 && (
              <button
                onClick={() => router.push(`/quiz?retry=true&sessionId=${sessionId}`)}
                className="flex-1 px-6 py-4 bg-orange-600 hover:bg-orange-700 
                  text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105"
              >
                ⚡ Làm lại câu sai ({wrongAnswers.length})
              </button>
            )}
            
            <button
              onClick={() => router.push('/')}
              className="px-6 py-4 bg-gray-200 hover:bg-gray-300 
                text-gray-700 font-semibold rounded-xl transition"
            >
              🏠 Về trang chủ
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Chi tiết câu trả lời
            </h2>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showWrongOnly}
                  onChange={(e) => setShowWrongOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </div>
              <span className="ml-3 text-sm text-gray-700 font-medium">Chỉ hiển thị câu sai</span>
            </label>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          {displayResults.map((result, index) => (
            <div
              key={result.questionId}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                result.isCorrect ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl ${
                    result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {result.isCorrect ? '✓' : '✗'}
                  </div>
                  <span className="text-sm text-gray-600 font-semibold">Câu {index + 1}</span>
                </div>
                {result.isCorrect ? (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                    ✓ Đúng
                  </span>
                ) : (
                  <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                    ✗ Sai
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {result.content}
              </h3>

              <div className="space-y-3">
                {(['A', 'B', 'C', 'D'] as const).map((option) => {
                  const isCorrect = option === result.correctAnswer;
                  const isSelected = option === result.selectedAnswer;
                  
                  let bgColor = 'bg-gray-50';
                  let borderColor = 'border-gray-200';
                  let textColor = 'text-gray-800';
                  
                  if (isCorrect) {
                    bgColor = 'bg-green-50';
                    borderColor = 'border-green-500';
                    textColor = 'text-green-900';
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'bg-red-50';
                    borderColor = 'border-red-500';
                    textColor = 'text-red-900';
                  }

                  return (
                    <div
                      key={option}
                      className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor}`}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${
                          isCorrect ? 'bg-green-500 text-white' :
                          isSelected ? 'bg-red-500 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {option}
                        </div>
                        <div className="flex-1">
                          <p className={`${textColor} font-medium`}>
                            {result.options[option]}
                          </p>
                          {isCorrect && (
                            <p className="text-sm text-green-600 mt-1 font-semibold">✓ Đáp án đúng</p>
                          )}
                          {isSelected && !isCorrect && (
                            <p className="text-sm text-red-600 mt-1 font-semibold">✗ Bạn đã chọn</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {displayResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-xl text-gray-600">Bạn đã trả lời đúng tất cả câu hỏi!</p>
          </div>
        )}
      </div>
    </div>
  );
}
