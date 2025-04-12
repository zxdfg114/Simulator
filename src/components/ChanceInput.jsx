// ChanceInput.jsx (입력 안정화 및 확률 값 클램프)
import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #ccc;
`;

const Input = styled.input`
  width: 100px;
  padding: 0.5rem;
  font-size: 1.1rem;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #444;
  background: #1e1f22;
  color: #e3e5e8;
  outline: none;

  &:focus {
    border-color: #5865f2;
  }
`;

function ChanceInput({ chance, onChange, tries }) {
  const [inputValue, setInputValue] = useState(String(chance));
  const [touched, setTouched] = useState(false);

  // 외부에서 chance 바뀌면 input도 바꿔줘야 함
  useEffect(() => {
    if (!touched) {
      setInputValue(String(chance));
    }
  }, [chance, touched]);

  // 입력 시작하면 기존값 지우기
  const handleFocus = () => {
    setTouched(true);
    setInputValue(""); // 비워서 새로 입력하게 함
  };

  // 실시간 입력 받기
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // 입력 완료 후 유효성 검사 + 상태 반영
  const handleBlur = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(100, parsed));
      onChange(clamped);
    }
    setTouched(false);
  };

  return (
    <Container>
      <Label>성공 확률 (%)</Label>
      <Input
        type="number"
        value={inputValue}
        min={0}
        max={100}
        step={0.1}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div style={{ fontSize: "0.85rem", marginTop: "0.25rem", color: "#999" }}>
        현재 제물 횟수: {tries}회
      </div>
    </Container>
  );
}

export default ChanceInput;
