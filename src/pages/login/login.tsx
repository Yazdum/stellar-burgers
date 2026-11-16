import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectUserError } from '@services/selectors';
import { loginUser } from '@services/slices/user';
import { useDispatch, useSelector } from '@services/store';

import type { Location } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector(selectUserError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const from = (location.state as { from?: Location } | null)?.from;
    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => navigate(from?.pathname ?? '/', { replace: true }))
      .catch(() => undefined);
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
