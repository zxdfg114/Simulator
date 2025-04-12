// styles/GlobalStyle.jsx
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Noto Sans KR', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #1e1e2f, #2b2d42, #1a1a2e);
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    color: #fff;
  }
`;

export default GlobalStyle;
