import { ReturnHeader } from 'components/Layout/ReturnHeader';
import ChangePasswordForm from 'components/User/ChangePasswordForm';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function ChangePassword() {
  return (
    <>
      <Helmet>
        <title>IntensivKontakt – Passwort ändern</title>
      </Helmet>
      <ReturnHeader />
      <section className="px-6">
        <h1 className="mb-6">
          <b>Passwort</b> ändern.
        </h1>
        <ChangePasswordForm />
        <div className="flex justify-center items-center mt-4">
          <Link to="/forgot-password" className="text-int-grey-40 uppercase text-button">
            Passwort Vergessen
          </Link>
        </div>
      </section>
    </>
  );
}
