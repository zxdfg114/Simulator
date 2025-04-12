import "./App.css";
import EnhancementSimulator from "./components/EnhancementSimulator";
import LogViewer from "./components/logViewer";
import React, { useState } from "react";
import GlobalStyle from "./styles/GlobalStyles";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = styled.div`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 2rem;
  gap: 2rem;
  min-height: 500px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
  }
`;

const Panel = styled.div`
  width: 360px;
  min-height: 460px;
  background-color: #1e1e1e;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    min-height: auto;
    padding: 1rem;
  }
`;

function App() {
  const [logs, setLogs] = useState([]);

  const handleNewLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  return (
    <>
      <GlobalStyle />
      <ToastContainer
        position="top-left"
        autoClose={2500}
        limit={3}
        pauseOnHover
        theme="dark"
      />
      <Layout>
        <EnhancementSimulator onLog={handleNewLog} />
        <LogViewer logs={logs} />
      </Layout>
    </>
  );
}

export default App;
