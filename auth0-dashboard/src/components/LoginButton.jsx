import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENTID;
  console.log(domain);
  console.log(clientId);
  return <Button variant="contained" onClick={() => loginWithRedirect()}>Log In</Button>;
};

export default LoginButton;