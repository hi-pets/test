import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OAuthRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) {
      alert('로그인 실패: code 또는 state가 없습니다.');
      navigate('/login');
      return;
    }

    // state 값으로 소셜 로그인 제공자 구분
    const provider = state === 'KAKAO_STATE' ? 'kakao' : 'naver';

    // 백엔드 OAuth 로그인 API 호출
    axios
      .post(
        'http://localhost:3001/auth/oauth',
        { code, provider },
        { withCredentials: true }
      )
      .then((res) => {
        localStorage.setItem('token', res.data.access_token);
        navigate('/');
      })
      .catch(() => {
        alert('소셜 로그인 실패');
        navigate('/login');
      });
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
};

export default OAuthRedirect;
