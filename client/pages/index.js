import { buildClient } from '../api';

const LandingPage = ({ currentUser }) => {
  console.log(`currentUser:`, currentUser);

  return currentUser ? <h1>Signed in</h1> : <h1>You are not signed in</h1>;
};

// Fetch current user before render, on the server-side
LandingPage.getInitialProps = async (context) => {
  console.log('LANDING PAGE!');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
