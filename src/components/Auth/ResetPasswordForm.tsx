import { Form, Formik, FormikErrors } from 'formik';
import { FButton } from '../../styles/form';
import { ReactComponent as HideFieldIcon } from '../../assets/icons/HideFieldIcon.svg';
import { ReactComponent as ShowFieldIcon } from '../../assets/icons/ShowFieldIcon.svg';
import { ReactComponent as ConfirmedIcon } from '../../assets/icons/confirmed-small.svg';
import { ReactComponent as InfoIcon } from '../../assets/icons/small-info.svg';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { passwordRegex } from '../util/constants';
import http from '../util/http';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordForm = () => {
  type ResetPasswordValues = {
    password: string;
    passwordRepeat: string;
    generalError: string;
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  return (
    <Formik<ResetPasswordValues>
      onSubmit={(values, { setErrors, setSubmitting }) => {
        setSubmitting(true);

        if (!params.has('uid') || !params.has('token')) {
          setSubmitting(false);
          return;
        }

        http
          .post('/auth/users/reset-password-confirm/', {
            uid: params.get('uid'),
            token: params.get('token'),
            password: values.password,
          })
          .then(() => {
            navigate(`/login`);
          })
          .catch((e) => {
            setSubmitting(false);
            if (e.token) {
              setErrors({ generalError: 'Der Link ist leider nicht mehr gültig' });
            } else {
              setErrors({ generalError: 'Ein Fehler ist aufgetreten' });
            }
          });
      }}
      validate={(values) => {
        let errors: FormikErrors<ResetPasswordValues> = {};

        if (values.password.length < 8) {
          errors.generalError = 'Zu kurz.+Ihr Passwort muss mindestens 8 Zeichen lang sein';
        } else if (!values.password.match(passwordRegex)) {
          errors.generalError =
            'Schwaches Passwort+Verwenden sie bitte eine Kombination aus Zahlen und Buchstaben';
        } else if (!values.passwordRepeat) {
          errors.generalError = 'Dies ist ein Pflichfeld';
        } else if (values.password !== values.passwordRepeat && values.passwordRepeat) {
          errors.generalError = 'Die Passwörter stimmen nicht überein';
        }

        return errors;
      }}
      initialValues={{ password: '', passwordRepeat: '', generalError: '' }}
    >
      {({ touched, errors, isSubmitting, values, handleSubmit, handleBlur, handleChange }) => {
        const isPasswordError = !!(
          touched.password &&
          errors.generalError &&
          !errors.generalError.includes('Pflichfeld') &&
          !(errors.generalError?.includes('überein') && !touched.passwordRepeat)
        );

        const isPasswordRepeatError = !!(
          (errors.generalError &&
            touched.password &&
            !errors.generalError?.includes('überein') &&
            !errors.generalError?.includes('Pflichfeld')) ||
          (touched.passwordRepeat &&
            (errors.generalError?.includes('überein') ||
              errors.generalError?.includes('Pflichfeld')))
        );

        const showRulesInfo = !isPasswordError && !isPasswordRepeatError;

        const errorHeader = errors.generalError?.split('+')[0];
        const errorText = errors.generalError?.split('+')[1];

        return (
          <Form onSubmit={handleSubmit}>
            <div>
              <ResetPasswordInput
                name="password"
                placeholder="Neues Passwort"
                value={values.password}
                handleBlur={handleBlur}
                handleChange={handleChange}
                isError={isPasswordError}
                setShowField={setShowPassword}
                showField={showPassword}
              />

              <ResetPasswordInput
                name="passwordRepeat"
                placeholder="Passwort bestätigen"
                value={values.passwordRepeat}
                handleBlur={handleBlur}
                handleChange={handleChange}
                isError={isPasswordRepeatError}
                setShowField={setShowPasswordRepeat}
                showField={showPasswordRepeat}
              />

              <div className="text-small h-[58px] mt-[10px] text-[#25272B]">
                {showRulesInfo && (
                  <>
                    <div className="flex items-center">
                      {touched.password &&
                      values.passwordRepeat === values.password &&
                      values.password &&
                      values.passwordRepeat &&
                      !errors.generalError ? (
                        <ConfirmedIcon />
                      ) : (
                        <InfoIcon fill="#56A0BB" />
                      )}
                      <div className="ml-[7px]">Mindestens 8 Zeichen</div>
                    </div>
                    <div className="flex items-center mt-[10px]">
                      {touched.password &&
                      values.passwordRepeat === values.password &&
                      values.password &&
                      values.passwordRepeat &&
                      !errors.generalError ? (
                        <ConfirmedIcon />
                      ) : (
                        <InfoIcon fill="#56A0BB" />
                      )}
                      <div className="ml-[7px]">Zahlen und Buchstaben</div>
                    </div>
                  </>
                )}

                {!showRulesInfo && (
                  <div>
                    <div className="flex items-center text-[#FF3B30]">
                      {(errorHeader || errors.generalError) && <InfoIcon fill="#FF3B30" />}
                      <div className="ml-[6px]">{errorHeader || errors.generalError}</div>
                    </div>
                    <div className="text-justify max-w-[300px]">{errorText}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-[48px] mb-[17px]">
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

export default ResetPasswordForm;

type ResetPasswordInputPropsType = {
  showField: boolean;
  setShowField: Dispatch<SetStateAction<boolean>>;
  isError: boolean;
  name: string;
  placeholder: string;
  value: string;
  handleBlur: any;
  handleChange: any;
};

export const ResetPasswordInput = ({
  showField,
  setShowField,
  isError,
  name,
  placeholder,
  value,
  handleBlur,
  handleChange,
}: ResetPasswordInputPropsType) => {
  return (
    <div className="relative mt-[6px]">
      <input
        id={name}
        type={showField ? 'text' : 'password'}
        className={`border ${
          isError ? 'border-[#FF3B30]' : 'border-int-mid-blue'
        }  inline-block text-int-grey-60 p-[10px] w-full outline-none rounded-[8px]`}
        name={name}
        onBlur={handleBlur}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />

      <div
        className="absolute right-[10px] top-[15px] z-10 cursor-pointer"
        onClick={() => setShowField((prev) => !prev)}
      >
        {showField ? <HideFieldIcon /> : <ShowFieldIcon />}
      </div>
    </div>
  );
};
