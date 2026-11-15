import { ForgotPasswordUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectUserError } from '@services/selectors';
import { requestPasswordReset } from '@services/slices/user';
import { useDispatch, useSelector } from '@services/store';

export const ForgotPassword = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const error = useSelector(selectUserError);

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(requestPasswordReset({ email }))
      .unwrap()
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        void navigate('/reset-password', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
