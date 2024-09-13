import { FButton, FCheckbox, FInput } from 'styles/form';
import { Form, Formik, FormikErrors } from 'formik';
import { string } from 'yup';
import http from 'components/util/http';
import { useAuthContext } from 'hoc';
import { useLocation, useNavigate } from 'react-router-dom';

interface FormValues {
  email: string;
  password: string;
  checkbox: boolean;
  inviteCode: string;
}
interface MyFormProps {
  initialEmail?: string;
  inviteCode: string;
}

const RegisterForm = ({ initialEmail, inviteCode }: MyFormProps) => {
  const auth = useAuthContext();
  const location: any = useLocation();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: initialEmail || '',
        password: '',
        checkbox: false,
        inviteCode: inviteCode,
      }}
      validate={(values: FormValues) => {
        let errors: FormikErrors<FormValues> = {};

        if (!values.email) {
          errors.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein';
        } else if (values.email && !string().email(values.email)) {
          errors.email = 'Ungültige E-Mail-Adresse';
        }

        if (!values.password) {
          errors.password = 'Bitte geben Sie Ihr Passwort ein';
        }

        if (!values.checkbox) {
          errors.checkbox = 'Bitte stimmen Sie der Datenschutzerklärung zu';
        }
        return errors;
      }}
      onSubmit={async (values, { setErrors }) => {
        try {
          await http.post(`/auth/users/`, {
            email: values.email,
            invite_code: values.inviteCode,
            password: values.password,
          });

          const user = await auth.login(values.email, values.password);

          if (user.email && user.first_name && user.last_name && user.phone) {
            navigate(location?.state?.from?.pathname || '/', { state: 'register' });
          } else {
            navigate('/user-update');
          }
        } catch (error) {
          setErrors({ email: 'Falsche Registrierungsdaten' });
        }
      }}
    >
      {(formikProps) => (
        <Form>
          <FInput
            placeholder="E-Mail-Adresse"
            id="email"
            type="email"
            name="email"
            error={!!(formikProps.touched && formikProps.errors.email)}
            errorMessage={formikProps.errors.email}
          />
          <FInput
            placeholder="Passwort erstelllen"
            id="password"
            type="password"
            name="password"
            error={!!(formikProps.touched && formikProps.errors.password)}
            errorMessage={formikProps.errors.password}
            className="mb-3"
          />
          <FCheckbox
            placeholder="Passwort erstelllen"
            id="checkbox"
            name="checkbox"
            error={!!(formikProps.touched && formikProps.errors.checkbox)}
            errorMessage={formikProps.errors.checkbox}
          >
            <p className="text-int-grey-60 text-button">
              Ich stimme der IntensivKontakt <b>Datenschutzerklärung</b> zu.
            </p>
          </FCheckbox>
          <FButton type="submit" disabled={formikProps.isSubmitting}>
            <div className="text-button font-bold tracking-wider">Jetzt Registrieren</div>
          </FButton>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
