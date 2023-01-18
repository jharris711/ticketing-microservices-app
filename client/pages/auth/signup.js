import React, { useState } from 'react';

function Signup() {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(`${email}: ${password}`);
  };

  return (
    <div className='p-2'>
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className='form-group m-1'>
          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            className='form-control'
          />
        </div>
        <div className='form-group m-1'>
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            className='form-control'
          />
        </div>
        <button className='btn btn-primary m-1'>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
