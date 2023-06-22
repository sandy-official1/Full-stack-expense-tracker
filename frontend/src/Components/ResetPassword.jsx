import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = ({ match }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`/password/resetpassword/${match.params.token}`, {
        password: password
      });

      // Password reset successful
      setSuccess(true);
    } catch (error) {
      // Handle error response
      setError('Failed to reset password');
    }
  };

  if (success) {
    return <div>Password reset successfully. Please log in with your new password.</div>;
  }

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
        </div>
        <div>
          <button type="submit">Reset Password</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
