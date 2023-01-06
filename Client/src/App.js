/** @format */

import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

function App() {
  const [user, setuser] = useState({});
  return (
    <div>
      {user && (
        <div>
          {" "}
          <img src={user.picture}></img>
          <h3>{user.name}</h3>
        </div>
      )}

      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse.credential);
          var decode = jwt_decode(credentialResponse.credential);
          console.log(decode);
          setuser(decode);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      {user.name ? <Dashboard></Dashboard> : <h1>Please Login First </h1>}
    </div>
  );
}

export default App;
