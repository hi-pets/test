import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const navigate = useNavigate();

  // 회원가입 입력값 상태
  const [form, setForm] = useState({
    userid: '',
    name: '',
    password: '',
    passwordConfirm: '',
    email: '',
    phone: '',
    address: '',
  });

  // 입력값 변경 핸들러
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 주소 찾기 (임시 alert - 실제로는 API 연동 또는 팝업 등)
  const onAddressSearch = () => {
    alert('주소 찾기 기능 구현 필요');
  };

  // 회원가입 버튼 클릭 시
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 확인 체크
    if (form.password !== form.passwordConfirm) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      // 회원가입 API 호출
      await axios.post('http://localhost:3001/auth/register', {
        userid: form.userid,
        name: form.name,
        password: form.password,
        email: form.email,
        phone: form.phone,
        address: form.address,
      });

      alert('회원가입 성공! 로그인 화면으로 이동합니다.');
      navigate('/login');
    } catch (err: any) {
      alert('회원가입 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-container">
      <form className="form-container" onSubmit={handleRegister}>
        <h2 className="form-title">회원가입</h2>

        <input
          className="input-field"
          name="userid"
          type="text"
          placeholder="아이디"
          value={form.userid}
          onChange={onChange}
          required
        />

        <input
          className="input-field"
          name="name"
          type="text"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
          required
        />

        <input
          className="input-field"
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={onChange}
          required
        />

        <input
          className="input-field"
          name="passwordConfirm"
          type="password"
          placeholder="비밀번호 확인"
          value={form.passwordConfirm}
          onChange={onChange}
          required
        />

        <input
          className="input-field"
          name="email"
          type="email"
          placeholder="이메일"
          value={form.email}
          onChange={onChange}
          required
        />

        <input
          className="input-field"
          name="phone"
          type="tel"
          placeholder="연락처"
          value={form.phone}
          onChange={onChange}
        />

        <div className="address-wrapper">
          <input
            className="input-field"
            name="address"
            type="text"
            placeholder="주소"
            value={form.address}
            onChange={onChange}
          />
          <button
            type="button"
            className="address-search-btn"
            onClick={onAddressSearch}
          >
            주소 찾기
          </button>
        </div>

        <button className="btn btn-primary" type="submit" style={{ marginTop: '1rem' }}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Register;
