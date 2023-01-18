import React from 'react';

function Signup() {
  return (
    <div className='p-2'>
      <form action=''>
        <h1>Sign Up</h1>
        <div className='form-group m-1'>
          <label>Email Address</label>
          <input type='email' className='form-control' />
        </div>
        <div className='form-group m-1'>
          <label>Password</label>
          <input type='password' className='form-control' />
        </div>
        <button className='btn btn-primary m-1'>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
