import React from 'react';
import ReactDOM from 'react-dom';
// import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.render(
  <React.StrictMode>
   <GoogleOAuthProvider clientId="170403947147-qns2pnu8nrar8mi41prnt4l27k9igde4.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
