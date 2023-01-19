import React, { useEffect } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks';

const Signout = () => {
  const { doRequest } = useRequest({
    url: `/api/users/signout`,
    method: `post`,
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default Signout;
