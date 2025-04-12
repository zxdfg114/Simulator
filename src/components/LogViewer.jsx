// components/LogViewer.jsx (시도 회차 강조 + 성공/실패 강조 + 기댓값 바 추가)
import React from "react";
import styled, { keyframes } from "styled-components";

const LogWrapper = styled.div`
  flex: 1;
  width: 100%;
  min-width: 400px;
  background: #2b2d31;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  border: 1px solid #313338;
  color: #e3e5e8;
  overflow-y: auto;
  max-height: 400px;
  min-height: 400px;
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LogItem = styled.div`
  animation: ${fadeInUp} 0.2s ease;
  font-size: 0.95rem;
  line-height: 1.6;
  padding: 0.25rem 0;
  color: #e3e5e8;

  .success {
    color: #43b581;
    font-weight: bold;
  }

  .fail {
    color: #f04747;
    font-weight: bold;
  }

  strong {
    color: #ffffff;
    font-weight: bold;
  }
`;

const BarContainer = styled.div`
  margin-top: 0.25rem;
  height: 6px;
  width: 100%;
  background-color: #1e1f22;
  border-radius: 4px;
  overflow: hidden;
`;

const FillBar = styled.div`
  height: 100%;
  background-color: ${({ percent }) => {
    if (percent >= 80) return "#4ade80"; // 초록
    if (percent >= 50) return "#facc15"; // 노랑
    if (percent >= 20) return "#f97316"; // 주황
    return "#ef4444"; // 빨강
  }};
  width: ${({ percent }) => percent}%;
  transition: width 0.3s ease;
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #ffffff;
`;

function LogViewer({ logs }) {
  return (
    <LogWrapper>
      <Title>📜 제물 헌납 내역:</Title>
      {logs.length === 0 ? (
        <div>아직 바친 제물이 없습니다...</div>
      ) : (
        [...logs].reverse().map((log, idx) => {
          const match = log.match(/기댓값: (\d+(\.\d+)?)%/);
          const expectation = match ? parseFloat(match[1]) : null;

          const highlightedLog = log
            .replace(/(\d+회차)/g, "<strong>$1</strong>")
            .replace(/(성공)/g, '<span class="success">$1</span>')
            .replace(/(실패)/g, '<span class="fail">$1</span>');

          return (
            <div key={idx}>
              <LogItem dangerouslySetInnerHTML={{ __html: highlightedLog }} />
              {expectation !== null && (
                <BarContainer>
                  <FillBar percent={expectation} />
                </BarContainer>
              )}
            </div>
          );
        })
      )}
    </LogWrapper>
  );
}

export default LogViewer;
