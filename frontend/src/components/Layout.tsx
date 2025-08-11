// frontend/src/components/Layout.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

// 헤더 컴포넌트
const Header: React.FC = () => (
  <header style={{ background: '#333', color: '#fff', padding: '1rem' }}>
    <h1>My App Header</h1>
  </header>
);

// 사이드바 컴포넌트
const Sidebar: React.FC = () => (
  <aside style={{ width: '200px', background: '#eee', padding: '1rem' }}>
    <nav>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>Home</li>
        <li>Profile</li>
        <li>Settings</li>
      </ul>
    </nav>
  </aside>
);

// 푸터 컴포넌트 (항상 보임)
const Footer: React.FC = () => (
  <footer style={{ background: '#222', color: '#ccc', padding: '1rem', marginTop: 'auto', textAlign: 'center' }}>
    <small>© 2025 My Company. All rights reserved.</small>
  </footer>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // 로그인, 회원가입 경로일 때 헤더/사이드바 숨김 처리
  const hideHeaderSidebar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 헤더 */}
      {!hideHeaderSidebar && <Header />}

      {/* 본문 영역: 사이드바 + 컨텐츠 */}
      <div style={{ display: 'flex', flex: 1 }}>
        {!hideHeaderSidebar && <Sidebar />}

        {/* 메인 컨텐츠 영역 */}
        <main
          style={{
            flex: 1,
            padding: '1rem',
            maxWidth: hideHeaderSidebar ? '400px' : 'auto',
            margin: hideHeaderSidebar ? 'auto' : undefined,
          }}
        >
          {children}
        </main>
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default Layout;
