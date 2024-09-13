import { object, string } from 'yup';
import { useAuthContext } from '../../hoc';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { FButton, FInput } from '../../styles/form';
import React, { useState } from 'react';
import { ReactComponent as HideFieldIcon } from '../../assets/icons/HideFieldIcon.svg';
import { ReactComponent as ShowFieldIcon } from '../../assets/icons/ShowFieldIcon.svg';

const LoginForm = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  type LoginFormValues = {
    email: string;
    password: string;
  };

  const validationSchema = object({
    email: string()
      .required('Bitte geben Sie Ihre E-Mail-Adresse ein')
      .email('Ungültige E-Mail-Adresse'),
    password: string()
      .required('Bitte geben Sie Ihr Passwort ein')
      .min(8, 'Mindestlänge 8 Zeichen'),
  });

  return (
    <Formik<LoginFormValues>
      onSubmit={(values, { setErrors, setSubmitting }) => {
        auth.login(values.email, values.password).then(
          (user) => {
            navigate('/news');
          },
          (err) => {
            if (err.detail === 'User with given credentials is inactive') {
              navigate(`/login-unconfirmed-email/${values.email}`);
              setSubmitting(false);
            } else {
              setErrors({ email: 'Falsche Logindaten' });
              setSubmitting(false);
            }
          },
        );
      }}
      validationSchema={validationSchema}
      initialValues={{ email: '', password: '' }}
    >
      {({ touched, errors, isSubmitting, handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <FInput
              id="email"
              type="email"
              name="email"
              placeholder="E-Mail-Adresse"
              error={!!(touched.email && errors.email)}
              errorMessage={errors.email}
              className="mb-4"
              isLoginInput={true}
            />
            <div className="relative">
              <div
                className="absolute right-[10px] top-[15px] z-10 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <HideFieldIcon /> : <ShowFieldIcon />}
              </div>
              <FInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Passwort"
                error={!!(touched.password && errors.password)}
                errorMessage={errors.password}
                className="mb-4"
                isLoginInput={true}
              />
            </div>
            <div className="mt-[20px] mb-[17px]">
              <FButton dark={true} type="submit" disabled={isSubmitting}>
                Anmelden
              </FButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
