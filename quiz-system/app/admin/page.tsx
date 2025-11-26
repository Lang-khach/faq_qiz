'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/admin';

interface Question {
  id: number;
  content: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Question management
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    if (status === 'authenticated' && activeTab === 'manage') {
      loadQuestions();
    }
  }, [status, activeTab]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/questions');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!session || !isAdmin(session.user?.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600 mb-6">
            Chỉ quản trị viên mới có thể truy cập trang này
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn file');
      return;
    }

    setUploading(true);
    setMessage('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFile(null);
        const input = document.getElementById('file-input') as HTMLInputElement;
        if (input) input.value = '';
        // Reload questions if on manage tab
        if (activeTab === 'manage') {
          loadQuestions();
        }
      } else {
        setError(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi khi upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;

    try {
      const response = await fetch(`/api/admin/questions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Đã xóa câu hỏi');
        loadQuestions();
      } else {
        setError('Lỗi khi xóa câu hỏi');
      }
    } catch (err) {
      setError('Lỗi khi xóa câu hỏi');
    }
  };

  const handleSaveQuestion = async (question: Omit<Question, 'id'> & { id?: number }) => {
    try {
      const method = question.id ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/questions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      });

      if (response.ok) {
        setMessage(question.id ? 'Đã cập nhật câu hỏi' : 'Đã thêm câu hỏi');
        setEditingQuestion(null);
        setShowAddForm(false);
        loadQuestions();
      } else {
        const data = await response.json();
        setError(data.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Lỗi khi lưu câu hỏi');
    }
  };

  // Filter and paginate questions
  const filteredQuestions = questions.filter(q =>
    q.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

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
              <span className="text-gray-400 text-sm ml-2">Admin Panel</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">👤 {session.user?.name}</span>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                ← Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'upload'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📤 Upload File
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'manage'
                ? 'bg-cyan-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📝 Quản Lý Câu Hỏi
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ {message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">❌ {error}</p>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Upload Câu Hỏi
            </h1>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Hướng dẫn Upload:</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p className="font-semibold">🔹 File Excel (.xlsx, .xls):</p>
                <ul className="ml-4 space-y-1">
                  <li>• <strong>Nội dung</strong> hoặc <strong>Câu hỏi</strong> hoặc <strong>Question</strong></li>
                  <li>• <strong>Đáp án A/B/C/D</strong> hoặc <strong>A/B/C/D</strong> hoặc <strong>Options</strong></li>
                  <li>• <strong>Đáp án đúng</strong> hoặc <strong>Correct</strong>: A, B, C hoặc D</li>
                </ul>
                <p className="font-semibold mt-3">🔹 File Word (.docx, .doc):</p>
                <ul className="ml-4 space-y-1">
                  <li>• Định dạng bảng: STT | Nội dung | Phương án trả lời | Đáp án</li>
                  <li>• Phương án trả lời: A. ..., B. ..., C. ..., D. ...</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn file Excel (.xlsx, .xls) hoặc Word (.docx, .doc)
                </label>
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls,.docx,.doc"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-50 file:text-cyan-700
                    hover:file:bg-cyan-100
                    cursor-pointer"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    ✓ Đã chọn: {file.name}
                  </p>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="w-full py-4 px-6 bg-cyan-600 hover:bg-cyan-700 
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                  text-white font-semibold rounded-lg shadow-lg
                  transition duration-200 transform hover:scale-105"
              >
                {uploading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang upload...
                  </span>
                ) : (
                  '📤 Upload và Cập Nhật Câu Hỏi'
                )}
              </button>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Lưu ý:</strong> Upload file mới sẽ xóa toàn bộ câu hỏi cũ và thay thế bằng câu hỏi mới.
              </p>
            </div>
          </div>
        )}

        {/* Manage Questions Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Quản Lý Câu Hỏi</h1>
                  <p className="text-gray-600 mt-1">Tổng số: {questions.length} câu</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddForm(true);
                    setEditingQuestion(null);
                  }}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                  ➕ Thêm Câu Hỏi
                </button>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="🔍 Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Question List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedQuestions.map((q, index) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={(currentPage - 1) * questionsPerPage + index}
                      onEdit={() => {
                        setEditingQuestion(q);
                        setShowAddForm(true);
                      }}
                      onDelete={() => handleDeleteQuestion(q.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                    >
                      ←
                    </button>
                    <span className="px-4 py-2">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <QuestionForm
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onCancel={() => {
              setShowAddForm(false);
              setEditingQuestion(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Question Card Component
function QuestionCard({ 
  question, 
  index, 
  onEdit, 
  onDelete 
}: { 
  question: Question; 
  index: number; 
  onEdit: () => void; 
  onDelete: () => void; 
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-bold">
              #{index + 1}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
              Đáp án: {question.correct_answer}
            </span>
          </div>
          <p className="text-gray-900 font-medium mb-2">
            {question.content.substring(0, 150)}
            {question.content.length > 150 && '...'}
          </p>
          
          {expanded && (
            <div className="mt-4 space-y-2 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-semibold">A:</span> {question.option_a}
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-semibold">B:</span> {question.option_b}
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-semibold">C:</span> {question.option_c}
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-semibold">D:</span> {question.option_d}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
          >
            {expanded ? '▲' : '▼'}
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

// Question Form Component
function QuestionForm({ 
  question, 
  onSave, 
  onCancel 
}: { 
  question: Question | null; 
  onSave: (q: any) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    id: question?.id,
    content: question?.content || '',
    option_a: question?.option_a || '',
    option_b: question?.option_b || '',
    option_c: question?.option_c || '',
    option_d: question?.option_d || '',
    correct_answer: question?.correct_answer || 'A',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {question ? 'Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung câu hỏi *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {(['A', 'B', 'C', 'D'] as const).map((letter) => (
              <div key={letter}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đáp án {letter} *
                </label>
                <textarea
                  value={formData[`option_${letter.toLowerCase()}` as keyof typeof formData] as string}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    [`option_${letter.toLowerCase()}`]: e.target.value 
                  })}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đáp án đúng *
            </label>
            <select
              value={formData.correct_answer}
              onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition"
            >
              💾 Lưu
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
            >
              ❌ Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
