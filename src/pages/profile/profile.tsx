import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { selectUser, selectUserError } from '@services/selectors';
import { updateUser } from '@services/slices/user';
import { useDispatch, useSelector } from '@services/store';

import type { TRegisterData } from '@api';

type TProfileForm = {
  name: string;
  email: string;
  password: string;
};

const emptyForm: TProfileForm = {
  name: '',
  email: '',
  password: '',
};

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUserError);
  const [initialFormValue, setInitialFormValue] = useState<TProfileForm>(emptyForm);
  const [formValue, setFormValue] = useState<TProfileForm>(emptyForm);

  useEffect(() => {
    const userFormValue = {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    };
    setInitialFormValue(userFormValue);
    setFormValue(userFormValue);
  }, [user]);

  const isFormChanged =
    formValue.name !== initialFormValue.name ||
    formValue.email !== initialFormValue.email ||
    formValue.password !== initialFormValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const data: Partial<TRegisterData> = {};
    if (formValue.name !== initialFormValue.name) data.name = formValue.name;
    if (formValue.email !== initialFormValue.email) data.email = formValue.email;
    if (formValue.password) data.password = formValue.password;

    void dispatch(updateUser(data))
      .unwrap()
      .then((updatedUser) => {
        const savedFormValue = {
          name: updatedUser.name,
          email: updatedUser.email,
          password: '',
        };
        setInitialFormValue(savedFormValue);
        setFormValue(savedFormValue);
      })
      .catch(() => undefined);
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue(initialFormValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError ?? undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
