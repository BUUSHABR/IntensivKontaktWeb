import { Form, Formik } from 'formik';
import { FButton, FInput as Input } from 'styles/form';
import { object, string } from 'yup';
import http from 'components/util/http';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RegisterCard from '../components/Auth/RegisterCard';
import { ReactComponent as LeftArrow } from '../assets/icons/chevron.left.svg';

interface InnerFormProps {
  onSuccess: (email: string) => void;
  initialEmail?: string;
}

type ForgotPasswordFormValues = {
  email: string;
};

const validationSchema = object({
  email: string()
    .required('Bitte geben Sie Ihre E-Mail-Adresse ein')
    .email('Ungültige E-Mail-Adresse'),
});

function InnerForm(props: InnerFormProps) {
  return (
    <Formik<ForgotPasswordFormValues>
      onSubmit={(formData, { setErrors, setSubmitting }) => {
        http
          .post(`/auth/users/validate_email/`, {
            email: formData.email,
          })
          .then((res) => {
            setErrors({ email: 'Konto mit dieser E-Mail-Adresse nicht gefunden' });
            setSubmitting(false);
          })
          .catch((err) => {
            if (err === 'Given email is already used.') {
              setSubmitting(false);
              http
                .post('/auth/users/reset-password/', { email: formData.email, origin: 'app' })
                .then(() => props.onSuccess(formData.email))
                .catch(() => {
                  setErrors({ email: 'Ein Fehler ist aufgetreten' });
                  setSubmitting(false);
                });
            } else {
              setErrors({ email: 'Ein Fehler ist aufgetreten' });
              setSubmitting(false);
            }
          });
      }}
      validationSchema={validationSchema}
      initialValues={{ email: props.initialEmail || '' }}
    >
      {({ touched, errors, isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="E-Mail-Adresse"
            error={!!(touched.email && errors.email)}
            errorMessage={errors.email}
            className="mb-4"
          />
          <div className="mt-[20px]">
            <FButton dark={true} type="submit" disabled={isSubmitting}>
              SENDEN
            </FButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const onSuccess = (email: string) => {
    setSuccess(true);
    setUserEmail(email);
  };

  if (success) {
    return (
      <div>
        <RegisterCard
          header={
            <div className="text-int-dark-blue text-h1 text-center">
              Eine E-Mail zum <br /> Zurücksetzen des Passworts <br /> wurde verschickt
            </div>
          }
        >
          <div
            onClick={() => setSuccess(false)}
            className="absolute top-[30px] left-[30px] cursor-pointer"
          >
            <LeftArrow />
          </div>
          <div className="my-[40px] px-[40px]">
            <div className="text-int-grey-60 text-chat-date text-center">
              Wir haben Ihnen soeben einen Link für die Zurücksetzung Ihres Passwortes gesendet.
              Bitte überprüfen Sie Ihre E-Mails für weitere Informationen
              {userEmail ? ': ' + userEmail : ''}
            </div>
          </div>
        </RegisterCard>
      </div>
    );
  }

  return (
    <div>
      <RegisterCard
        header={
          <div>
            <div className="text-int-dark-blue text-h1">Passwort vergessen?</div>
            <div className="text-int-grey-60 text-chat-date mt-[11px]">
              Geben Sie Ihre E-Mail-Adresse ein, um Ihr <br /> Passwort zurückzusetzen.
            </div>
          </div>
        }
      >
        <div
          onClick={() => navigate('/login')}
          className="absolute top-[30px] left-[30px] cursor-pointer"
        >
          <LeftArrow />
        </div>
        <div className="my-[40px] px-[40px] ">
          <InnerForm onSuccess={onSuccess} initialEmail={params.get('email')?.toString() || ''} />
        </div>
      </RegisterCard>
    </div>
  );
}
