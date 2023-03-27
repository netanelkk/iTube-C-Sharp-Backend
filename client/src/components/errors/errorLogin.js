import React from 'react'

// Error when accessing pages for registered users as guest
function errorLogin() {
  return (
    <div className="content-middle">
        <i className="bi bi-exclamation-circle"></i>
        <div id="login-error-text"></div>
    </div>
  );
}

export default errorLogin;
