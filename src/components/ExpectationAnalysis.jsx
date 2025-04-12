// components/ExpectationAnalysis.jsx
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 2rem;
  padding: 1.25rem;
  background: #2b2d31;
  border-radius: 12px;
  color: #e3e5e8;
  font-size: 0.95rem;
  line-height: 1.6;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: bold;
  color: #fff;
`;

const Highlight = styled.span`
  font-weight: bold;
  color: ${({ successRate }) =>
    successRate >= 50 ? "#4ade80" : successRate > 0 ? "#facc15" : "#f87171"};
`;

function ExpectationAnalysis({ stats }) {
  if (!stats || stats.length === 0) return null;

  const getGroupStats = (min, max) => {
    const group = stats.filter((x) => x.expected >= min && x.expected < max);
    const total = group.length;
    const success = group.filter((x) => x.success).length;
    const rate = total > 0 ? ((success / total) * 100).toFixed(1) : 0;
    return { total, success, rate };
  };

  const low = getGroupStats(0, 30);
  const mid = getGroupStats(30, 60);
  const high = getGroupStats(60, 90);
  const maxed = getGroupStats(90, 999);

  return (
    <Wrapper>
      <h3>📊 기대값별 성공 분석</h3>

      <Section>
        <Label>🟥 기대값 0~30%</Label>: 시도 {low.total}회 / 성공 {low.success}
        회 (<Highlight successRate={low.rate}>{low.rate}%</Highlight>)
      </Section>

      <Section>
        <Label>🟨 기대값 30~60%</Label>: 시도 {mid.total}회 / 성공 {mid.success}
        회 (<Highlight successRate={mid.rate}>{mid.rate}%</Highlight>)
      </Section>

      <Section>
        <Label>🟩 기대값 60~90%</Label>: 시도 {high.total}회 / 성공{" "}
        {high.success}회 (
        <Highlight successRate={high.rate}>{high.rate}%</Highlight>)
      </Section>

      <Section>
        <Label>💯 장기백 이상</Label>: 시도 {maxed.total}회 / 성공{" "}
        {maxed.success}회 (
        <Highlight successRate={maxed.rate}>{maxed.rate}%</Highlight>)
      </Section>
    </Wrapper>
  );
}

export default ExpectationAnalysis;
