// EnhancementSimulator.jsx (장기백 확률 누적 로직 + 장기백 볼 확률 표시)
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ChanceInput from "./ChanceInput";
import { toast } from "react-toastify";

const Wrapper = styled.div`
  width: 100%;
  max-width: 420px;
  background-color: #2b2d31;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);
  border: 1px solid #313338;
  color: #e3e5e8;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.2rem;
  font-weight: 700;
  color: #ffffff;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background-color: #5865f2;
  color: #fff;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(88, 101, 242, 0.4);
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: #4752c4;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const Result = styled.div`
  margin-top: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #b5bac1;
  min-height: 150px;

  strong {
    font-weight: 600;
    color: #fff;
  }
`;

const ExpectationWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ExpectationText = styled.p`
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
`;

const BarContainer = styled.div`
  height: 8px;
  width: 100%;
  background-color: #1e1f22;
  border-radius: 4px;
  overflow: hidden;
`;

const FillBar = styled.div`
  height: 100%;
  background-color: ${({ $percent, $inverse }) => {
    if ($inverse) {
      if ($percent <= 20) return "#4ade80"; // 낮을수록 좋음 (초록)
      if ($percent <= 50) return "#facc15";
      if ($percent <= 80) return "#f97316";
      return "#ef4444";
    } else {
      if ($percent >= 80) return "#4ade80";
      if ($percent >= 50) return "#facc15";
      if ($percent >= 20) return "#f97316";
      return "#ef4444";
    }
  }};
  width: ${({ $percent }) => $percent}%;
  transition: width 0.3s ease;
`;
function EnhancementSimulator({ onLog }) {
  const [chance, setChance] = useState(2);
  const [tries, setTries] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [consecutiveFails, setConsecutiveFails] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [jangGibaekCount, setJangGibaekCount] = useState(0);
  const [sessionTries, setSessionTries] = useState(0);
  const [jangGibaekGauge, setJangGibaekGauge] = useState(0);
  const [notifiedThreshold, setNotifiedThreshold] = useState(false);

  const getExpectedSuccessRate = () => {
    const p = chance / 100;
    const failAll = Math.pow(1 - p, sessionTries);
    return ((1 - failAll) * 100).toFixed(2);
  };

  const getJangGibaekChance = () => {
    const p = chance / 100;
    if (p === 0 || jangGibaekGauge >= 100) return 0;
    const failureRate = 1 - p;
    const neededGauge = 100 - jangGibaekGauge;
    const estimatedTries = Math.ceil(neededGauge / (chance * 0.465));
    const prob = Math.pow(failureRate, estimatedTries);
    return (prob * 100).toFixed(2);
  };

  const resetJangGibaek = () => {
    setSessionTries(0);
    setJangGibaekGauge(0);
  };

  const handleChanceChange = (value) => {
    setChance(value);
    resetJangGibaek();
  };

  const runEnhancement = (overrideTryNumber = null, skipLog = false) => {
    const baseChance = chance;
    const rand = Math.random() * 100;
    const isSuccess = rand < baseChance;
    const nextTry = overrideTryNumber !== null ? overrideTryNumber : tries + 1;

    if (jangGibaekGauge >= 100) {
      setSuccesses((prev) => prev + 1);
      setConsecutiveFails(0);
      setLastResult("🟢 성공! 🎉");
      if (!skipLog)
        onLog?.(`[${nextTry}회차] 🟢 장기백 강화 성공! 모든 수치 초기화.`);
      if (!skipLog) onLog?.("🪦 제물이 사라졌습니다. 다시 바쳐주세요.");
      resetJangGibaek();
      return;
    }

    setSessionTries((prev) => prev + 1);

    if (isSuccess) {
      setSuccesses((prev) => prev + 1);
      setConsecutiveFails(0);
      setLastResult("🟢 성공! 🎉");
      if (!skipLog) onLog?.(`[${nextTry}회차] 🟢 성공! (${baseChance}%)`);
      toast.success(`[${nextTry}회차] 🟢 성공! (${baseChance}%)`);
      if (!skipLog) onLog?.("🪦 제물이 사라졌습니다. 다시 바쳐주세요.");
      resetJangGibaek();
    } else {
      setConsecutiveFails((prev) => prev + 1);
      setLastResult("🔴 실패… 💥");
      if (!skipLog) onLog?.(`[${nextTry}회차] 🔴 실패 (확률: ${baseChance}%)`);

      const addedGauge = baseChance * 0.465;
      setJangGibaekGauge((prev) => {
        const newGauge = Math.min(100, prev + addedGauge);
        if (newGauge >= 100 && !skipLog) {
          onLog?.("💀 장기백 100% 도달! 반드시 다음 강화에 성공합니다.");
        }
        return newGauge;
      });

      if (baseChance >= 70 && !skipLog) {
        setJangGibaekCount((prev) => prev + 1);
        onLog?.("⚠️ 장기백 발생! 기대 확률이 높았지만 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    const expected = parseFloat(getExpectedSuccessRate());
    if (expected >= 80 && !notifiedThreshold) {
      toast("💥 기댓값 80% 돌파 - 지금 지르면 뜬다", { type: "info" });
      setNotifiedThreshold(true);
    }
    if (expected < 80 && notifiedThreshold) {
      setNotifiedThreshold(false); // 다시 떨어지면 리셋해서 다음에 또 보여줌
    }
  }, [chance, sessionTries]);

  const handleTry = () => {
    setTries((prev) => prev + 1);
    runEnhancement();
  };

  const handleTryTen = async () => {
    onLog?.("✨ 10연차 강화 시도 시작!");
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setTries((prev) => prev + 1);
      runEnhancement(tries + i + 1);
    }
  };

  const handleReset = () => {
    setTries(0);
    setSuccesses(0);
    setConsecutiveFails(0);
    setLastResult(null);
    setJangGibaekCount(0);
    resetJangGibaek();
    onLog?.("🔥 전체 초기화되었습니다.");
  };

  const expected = parseFloat(getExpectedSuccessRate());
  const jangGibaekChance = getJangGibaekChance();

  return (
    <Wrapper>
      <Title>강화 제물 시뮬레이터</Title>
      <ChanceInput
        chance={chance}
        onChange={handleChanceChange}
        tries={sessionTries}
      />
      <ExpectationWrapper>
        <ExpectationText>
          현재 제물 기준 기댓값: <strong>{expected}%</strong>
        </ExpectationText>
        <BarContainer>
          <FillBar $percent={expected} />
        </BarContainer>
        <ExpectationText style={{ marginTop: "0.5rem" }}>
          장기백 게이지: <strong>{jangGibaekGauge.toFixed(2)}%</strong>
        </ExpectationText>
        <BarContainer>
          <FillBar $percent={jangGibaekGauge} />
        </BarContainer>
        <ExpectationText style={{ marginTop: "0.5rem" }}>
          장기백을 볼 확률: <strong>{jangGibaekChance}%</strong>
        </ExpectationText>
        <BarContainer>
          <FillBar $percent={jangGibaekChance} $inverse />
        </BarContainer>
      </ExpectationWrapper>
      <ButtonGroup>
        <Button onClick={handleTry}>강화 시도</Button>
        <Button onClick={handleTryTen}>10연차 시도</Button>
        <Button onClick={handleReset}>초기화</Button>
      </ButtonGroup>
      <Result>
        <strong>결과:</strong> {lastResult || "아직 시도된 강화가 없습니다."}{" "}
        <br />
        <strong>전체 시도 횟수:</strong> {tries} <br />
        <strong>성공 횟수:</strong> {successes} <br />
        <strong>전체 성공률:</strong>{" "}
        {tries > 0 ? ((successes / tries) * 100).toFixed(1) : 0}% <br />
        <strong>현재 연속 실패:</strong> {consecutiveFails}회 <br />
        <strong>장기백 발생:</strong> {jangGibaekCount}회
      </Result>
    </Wrapper>
  );
}

export default EnhancementSimulator;
