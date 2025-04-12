import "./App.css";
import EnhancementSimulator from "./components/EnhancementSimulator";
import ExpectationAnalysis from "./components/ExpectationAnalysis";
import LogViewer from "./components/logViewer";
import React, { useState } from "react";
import GlobalStyle from "./styles/GlobalStyles";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 420px;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const SidePanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  /* gap: 1rem; */
`;

function App() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);

  const handleNewLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  return (
    <>
      <GlobalStyle />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        limit={3}
        pauseOnHover
        theme="dark"
      />
      <Layout>
        <EnhancementSimulator onLog={handleNewLog} onStatUpdate={setStats} />
        <SidePanel>
          <LogViewer logs={logs} />
          <ExpectationAnalysis stats={stats} />
        </SidePanel>
      </Layout>
    </>
  );
}

export default App;
