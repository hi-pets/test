import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 소셜 로그인 URL (실제 값은 .env나 상수로 분리 권장)
const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=YOUR_NAVER_CLIENT_ID&redirect_uri=YOUR_FRONTEND_REDIRECT_URI/oauth-redirect&state=NAVER_STATE`;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_FRONTEND_REDIRECT_URI/oauth-redirect&response_type=code&state=KAKAO_STATE`;

const Login: React.FC = () => {
  const navigate = useNavigate();

  // 아이디, 비밀번호 상태 관리
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 버튼 클릭 시 호출
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 백엔드 로그인 API 호출
      const res = await axios.post(
        'http://localhost:3001/auth/login',
        { userid, password },
        { withCredentials: true }
      );

      // 로그인 성공 시 토큰 저장
      localStorage.setItem('token', res.data.access_token);

      // 홈 화면으로 이동
      navigate('/');
    } catch {
      alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  // 회원가입 화면으로 이동
  const goRegister = () => {
    navigate('/register');
  };

  return (
    <div className="page-container">
      <form className="form-container" onSubmit={handleLogin}>
        <h2 className="form-title">로그인</h2>

        <input
          className="input-field"
          type="text"
          placeholder="아이디"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
          required
        />

        <input
          className="input-field"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-primary" type="submit">
          로그인
        </button>

        {/* 회원가입 화면 이동 버튼 */}
        <button
          className="btn btn-primary"
          type="button"
          onClick={goRegister}
          style={{ marginTop: '0.5rem' }}
        >
          회원가입
        </button>

        <div className="small-text" style={{ marginTop: '1rem' }}>
          또는 소셜 로그인을 이용하세요.
        </div>

        {/* 네이버 로그인 버튼 */}
        <button
          className="btn btn-naver"
          type="button"
          onClick={() => (window.location.href = NAVER_AUTH_URL)}
          style={{ marginTop: '0.75rem' }}
        >
          네이버 로그인
        </button>

        {/* 카카오 로그인 버튼 */}
        <button
          className="btn btn-kakao"
          type="button"
          onClick={() => (window.location.href = KAKAO_AUTH_URL)}
          style={{ marginTop: '0.5rem' }}
        >
          카카오 로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
