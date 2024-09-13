import React, { Dispatch, SetStateAction, useState } from 'react';
import RegisterCard from '../components/Auth/RegisterCard';
import { FButton, FInput } from '../styles/form';
import { Form, Formik } from 'formik';
import { object, string } from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '../assets/icons/chevron.left.svg';
import http from '../components/util/http';

import { ReactComponent as ShowFieldIcon } from '../assets/icons/ShowFieldIcon.svg';
import { ReactComponent as HideFieldIcon } from '../assets/icons/HideFieldIcon.svg';
import useRegisterPrefillingData, {
  RegisterPrefillingDataResponse,
} from '../components/Auth/useRegisterPrefillingData';
import Preloader from '../components/Preloader';
import { passwordRegex } from '../components/util/constants';

const RegisterPage = () => {
  const search = useLocation().search;
  const invite_code = new URLSearchParams(search).get('invite_code');

  const { data: prefillingInfo, isLoading } = useRegisterPrefillingData(invite_code || null);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login');
  };

  const navigateBack = () => {
    if (showMore) {
      setShowMore(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <RegisterCard
        header={
          <div>
            Wilkommen bei
            <br /> IntensivKontakt
          </div>
        }
      >
        {isLoading ? (
          <div className="h-[400px]">
            <Preloader />
          </div>
        ) : (
          <>
            <div onClick={navigateBack} className="absolute top-[30px] left-[30px] cursor-pointer">
              <LeftArrow />
            </div>
            <div className="px-[40px]">
              <InnerForm
                prefillingInfo={prefillingInfo}
                showMore={showMore}
                setShowMore={setShowMore}
              />
            </div>
            <div onClick={navigateToLogin} className="cursor-pointer">
              Schon Mitglied bei IntensivKontakt? Anmelden
            </div>
            <div className="mt-[20px] p-[10px] text-button mb-[25px]">
              Indem Sie fortfahren, stimmen Sie den
              <a className="font-BeVietnamBold text-[#000]" href="https://www.intensivkontakt.de/agb/">
                {' '}
                Allgemeinen Geschäftsbedingungen{' '}
              </a>
              von IntensivKontakt zu und bestätigen, dass Sie unsere
              <a className="font-BeVietnamBold text-[#000]" href="https://www.intensivkontakt.de/datenschutz/"> Datenschutzrichtlinien </a>{' '}
              gelesen haben.
            </div>
          </>
        )}
      </RegisterCard>
    </div>
  );
};

export default RegisterPage;

type RegistrationFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const validationSchema = object({
  first_name: string()
    .required('Bitte geben Sie Ihren Vornamen ein')
    .min(2, 'Einen korrekten Vornamen eingeben'),
  last_name: string()
    .required('Bitte geben Sie Ihren Nachnamen ein')
    .min(2, 'Einen korrekten Nachnamen eingeben'),
  email: string()
    .required('Bitte geben Sie Ihre E-Mail-Adresse ein')
    .email('Ungültige E-Mail-Adresse'),
  password: string()
    .required('Bitte geben Sie Ihr Passwort ein')
    .matches(
      passwordRegex,
      'Das Passwort muss mindestens 8 Zeichen enthalten, darunter 1 Zahl und 1 Buchstabe',
    ),
  generalError: string(),
});

type InnerFormPropsType = {
  prefillingInfo?: RegisterPrefillingDataResponse;
  setShowMore: Dispatch<SetStateAction<boolean>>;
  showMore: boolean;
};

const InnerForm = ({ prefillingInfo, setShowMore, showMore }: InnerFormPropsType) => {
  const search = useLocation().search;
  const invite_code = new URLSearchParams(search).get('invite_code');
  const navigate = useNavigate();

  const navigateToSuccessRegistrationPage = () => {
    navigate('/register-success');
  };

  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  return (
    <Formik<RegistrationFormValues>
      onSubmit={async (values, { setErrors }) => {
        if (values.password !== values.passwordConfirmation) {
          setErrors({ passwordConfirmation: 'Passwort stimmt nicht überein' });
        } else {
          try {
            await http.post(`/auth/users/`, {
              email: values.email,
              password: values.password,
              first_name: values.first_name,
              last_name: values.last_name,
              invite_code: invite_code || null,
            });
            navigateToSuccessRegistrationPage();
          } catch (error: any) {
            setGeneralError('Falsche Registrierungsdaten');
            if (error?.email.includes('user with this email address already exists.')) {
              setGeneralError('Benutzer mit dieser E-Mail-Adresse existiert bereits');
            }
          }
        }
      }}
      validationSchema={validationSchema}
      initialValues={{
        email: prefillingInfo?.email || '',
        password: '',
        passwordConfirmation: '',
        first_name: prefillingInfo?.first_name || '',
        last_name: prefillingInfo?.last_name || '',
      }}
    >
      {({ touched, errors, isSubmitting, handleSubmit, values, setErrors, setFieldError }) => {
        const onMoreClick = () => {
          http
            .post('/auth/users/validate_email/', {
              email: values.email,
            })
            .then((res) => {
              if (res === 'Given email is not in use') {
                if (
                  values.email &&
                  !errors.email &&
                  values.first_name &&
                  !errors.first_name &&
                  values.last_name &&
                  !errors.last_name
                ) {
                  setShowMore(true);
                  setErrors({ password: '' });
                }
              }
            })
            .catch((error) => {
              if (error === 'Given email is already used.') {
                setFieldError('email', 'Benutzer mit dieser E-Mail-Adresse existiert bereits');
              }
            });
        };

        return (
          <Form onSubmit={handleSubmit}>
            {!showMore && (
              <>
                <FInput
                  id="first_name"
                  type="text"
                  name="first_name"
                  placeholder="Vorname"
                  error={!!(touched.first_name && errors.first_name)}
                  errorMessage={errors.first_name}
                  className="mb-4"
                />
                <FInput
                  id="last_name"
                  type="Vorname"
                  name="last_name"
                  placeholder="Nachname"
                  error={!!(touched.last_name && errors.last_name)}
                  errorMessage={errors.last_name}
                  className="mb-4"
                />
                <FInput
                  id="email"
                  type="email"
                  name="email"
                  placeholder="E-Mail-Adresse"
                  error={!!(touched.email && errors.email)}
                  errorMessage={errors.email}
                  className="mb-4"
                  onBlur={() => {
                    http
                      .post('/auth/users/validate_email/', {
                        email: values.email,
                      })
                      .catch((error) => {
                        if (error === 'Given email is already used.') {
                          setFieldError(
                            'email',
                            'Benutzer mit dieser E-Mail-Adresse existiert bereits',
                          );
                        }
                      });
                  }}
                />

                <div className="mt-[20px] mb-[17px]">
                  <FButton dark={true} onClick={onMoreClick}>
                    weiter
                  </FButton>
                </div>
              </>
            )}
            {showMore && (
              <div>
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
                  />
                </div>
                <div className="relative">
                  <div
                    className="absolute right-[10px] top-[15px] z-10 cursor-pointer"
                    onClick={() => setShowRepeatPassword((prev) => !prev)}
                  >
                    {showRepeatPassword ? <HideFieldIcon /> : <ShowFieldIcon />}
                  </div>
                  <FInput
                    id="passwordConfirmation"
                    type={showRepeatPassword ? 'text' : 'password'}
                    name="passwordConfirmation"
                    placeholder="Passwort wiederholen"
                    error={!!(touched.passwordConfirmation && errors.passwordConfirmation)}
                    errorMessage={errors.passwordConfirmation}
                    className="mb-4"
                  />
                </div>
                <div className="text-red-600 text-body-small">{generalError && generalError}</div>
                <div className="mt-[20px] mb-[17px]">
                  <FButton dark={true} type="submit" disabled={isSubmitting}>
                    Registrieren
                  </FButton>
                </div>
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
