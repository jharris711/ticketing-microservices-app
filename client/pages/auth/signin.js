import React, { useState } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks';

function Signin() {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { doRequest, errors } = useRequest({
    url: `/api/users/signin`,
    method: `post`,
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push(`/`),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <div className='p-2'>
      <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className='form-group my-1'>
          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            /* type='email' */
            className='form-control'
          />
        </div>
        <div className='form-group my-1'>
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            className='form-control'
          />
        </div>
        {errors}
        <button className='btn btn-primary my-1'>Sign In</button>
      </form>
    </div>
  );
}

export default Signin;