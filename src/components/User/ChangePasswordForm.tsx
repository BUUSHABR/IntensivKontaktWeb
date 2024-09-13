import { FButton, FInput } from 'styles/form';
import { useAuthContext } from 'hoc';
import { Form, Formik, FormikErrors } from 'formik';
import { useNavigate } from 'react-router-dom';

interface ChangePasswordFormValues {
  password: string;
  password_repeat: string;
  old_password: string;
}

const ChangePasswordForm = () => {
  const { updateUser } = useAuthContext();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        password: '',
        password_repeat: '',
        old_password: '',
      }}
      validate={(values: ChangePasswordFormValues) => {
        let errors: FormikErrors<ChangePasswordFormValues> = {};

        if (!values.old_password) {
          errors.old_password = 'Geben Sie Ihr altes Passwort ein';
        }

        if (!values.password) {
          errors.password = 'Geben Sie Ihr neues Passwort ein';
        }

        if (!values.password_repeat) {
          errors.password_repeat = 'Wiederholen Sie Ihr neues Passwort';
        }

        if (
          values.password &&
          values.password_repeat &&
          values.password !== values.password_repeat
        ) {
          errors.password_repeat = 'Die Passwörter stimmen nicht überein';
        }

        return errors;
      }}
      onSubmit={async (values, { setErrors }) => {
        //TODO: Handle After Update
        updateUser({ password: values.password, old_password: values.old_password }).then(
          () => navigate('/'),
          () => setErrors({ old_password: 'Leider ist ein Fehler aufgetreten' }),
        );
      }}
    >
      {(formikProps) => (
        <Form onSubmit={formikProps.handleSubmit}>
          <FInput
            id="old_password"
            type="password"
            name="old_password"
            placeholder="Altes Passwort*"
            error={!!(formikProps.touched.old_password && formikProps.errors.old_password)}
            errorMessage={formikProps.errors.old_password}
          />
          <FInput
            id="password"
            type="password"
            name="password"
            placeholder="Neues Passwort*"
            error={!!(formikProps.touched.password && formikProps.errors.password)}
            errorMessage={formikProps.errors.password}
          />
          <FInput
            id="password_repeat"
            type="password"
            name="password_repeat"
            placeholder="Neues Passwort wiederholen*"
            error={!!(formikProps.touched.password_repeat && formikProps.errors.password_repeat)}
            errorMessage={formikProps.errors.password_repeat}
          />
          <div className="mt-4">
            <FButton type="submit" disabled={formikProps.isSubmitting}>
              Speichern
            </FButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;
