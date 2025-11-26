'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Hệ thống trắc nghiệm này hoạt động như thế nào?',
      answer: 'Hệ thống cho phép bạn làm bài trắc nghiệm online với chấm điểm tự động. Mỗi user sẽ nhận được thứ tự câu hỏi khác nhau để đảm bảo công bằng.'
    },
    {
      question: 'Làm thế nào để bắt đầu làm bài?',
      answer: 'Đăng nhập bằng tài khoản Google, sau đó click vào "Bắt Đầu Làm Bài" để bắt đầu. Bạn có thể làm bài bất cứ lúc nào.'
    },
    {
      question: 'Tôi có thể xem lại các câu trả lời sai không?',
      answer: 'Có! Sau khi hoàn thành bài test, bạn có thể xem chi tiết từng câu trả lời và chọn "Làm lại câu sai" để ôn tập những câu bạn đã trả lời sai.'
    },
    {
      question: 'Kết quả được lưu ở đâu?',
      answer: 'Tất cả kết quả của bạn được lưu trữ an toàn trong database. Bạn có thể xem lại lịch sử làm bài và tiến độ học tập bất cứ lúc nào.'
    }
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500"></div>
      </div>
    );
  }

  if (session) {
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
                <span className="text-gray-400 text-sm ml-2">by IrraHub</span>
              </div>
              
              <div className="flex items-center gap-6">
                <button onClick={() => router.push('/quiz')} className="text-gray-600 hover:text-gray-900">
                  Làm Bài
                </button>
                <button onClick={() => router.push('/admin')} className="text-gray-600 hover:text-gray-900">
                  Quản Trị
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="w-10 h-10 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full flex items-center justify-center transition"
                  >
                    A
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="bg-white py-20">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-gray-300">Frequently Ask </span>
              <span className="text-gray-900">Question</span>
            </h1>
            <p className="text-cyan-500 mb-2">
              <span className="underline cursor-pointer" onClick={() => router.push('/quiz')}>
                Click Here
              </span> to buy now.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-5xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* FAQ List */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 ml-4">
                      <span className="text-white text-xl">+</span>
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-gray-600 text-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Any Question Card */}
            <div className="bg-cyan-50 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                <div className="text-[200px] text-cyan-500 transform rotate-12">?</div>
              </div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6">
                  <div className="w-32 h-32 bg-cyan-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-5xl">🤔</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Any Question?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  You can ask anything you want to know about Quiz System.
                </p>
                
                <div className="mb-4">
                  <label className="text-sm text-gray-700 mb-2 block">Let me know.</label>
                  <input
                    type="text"
                    placeholder="Enter Here"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                
                <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-full transition shadow-lg">
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Start Quiz Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/quiz')}
              className="px-12 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full shadow-xl transition transform hover:scale-105"
            >
              🎯 Bắt Đầu Làm Bài Ngay
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t py-6">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              © Quiz 2025. by IrraHub
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Làm Bài</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-cyan-500 hover:text-cyan-600 font-semibold">FAQ</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms & Condition</a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Login Page
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
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-cyan-500 hover:text-cyan-600 font-semibold">Help</a>
              <button
                onClick={() => signIn('google')}
                className="w-10 h-10 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full flex items-center justify-center transition"
              >
                A
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-gray-300">Frequently Ask </span>
            <span className="text-gray-900">Question</span>
          </h1>
          <p className="text-cyan-500 mb-8">
            <span className="underline cursor-pointer" onClick={() => signIn('google')}>
              Click Here
            </span> to buy now.
          </p>
        </div>
      </div>

      {/* Login Section */}
      <div className="max-w-md mx-auto px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Đăng Nhập để Bắt Đầu
            </h2>
            <p className="text-gray-600">
              Sử dụng tài khoản Google của bạn
            </p>
          </div>

          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 
              bg-white hover:bg-gray-50 border-2 border-gray-300 
              text-gray-700 font-semibold rounded-xl shadow-lg 
              transition transform hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Đăng nhập với Google
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              🔒 An toàn và bảo mật với Google OAuth
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            © Quiz 2025. by IrraHub
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Buy Now</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-cyan-500 hover:text-cyan-600 font-semibold">FAQ</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Terms & Condition</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
