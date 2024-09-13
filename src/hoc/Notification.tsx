import { useAuthContext } from 'hoc/index';
import { useNavigate } from 'react-router-dom';
import CurrentPatientConsumer from '../components/Mehr/CurrentPatient';
import { useEffect, useState } from 'react';
import http from '../components/util/http';
import { IRelativeSeeActionStatus } from '../models/Patient';
import Preloader from '../components/Preloader';

export function NotificationChecker({ children }: React.PropsWithChildren<{}>) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentPatientId } = CurrentPatientConsumer();
  let { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      http.get('/relatives/relatives_profile/me/').then((res) => {
        setCurrentPatientId(res?.active_patient);
      });

      http
        .get(`/relatives/relative_patients/`)
        .then((res) => {
          const relativesCount = res.count;
          http
            .get(`/relatives/relative_patients/get_unaccepted_relative_requests/`)
            .then((res) => {
            const requestsCount = res.count;
            if (relativesCount <= 1 && requestsCount === 0) {
              http
                .get(`/contacts/add_relative_responses/get_unseen_responses/`)
                .then((res: IRelativeSeeActionStatus) => {
                  if (res.results.length > 0) {
                    const successConfirm = res.results.filter((item) => {
                      return item.supervisor_confirmed;
                    });
                    if (successConfirm.length > 0) {
                      navigate('/onboarding-confirmed');
                    } else if (successConfirm.length === 0 && relativesCount === 0) {
                      navigate('/onboarding-failed');
                    }
                  }
                })
                .finally(() => {
                  setIsLoading(false);
                });
                
            }
          })
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <Preloader />;
  }

  return <>{children}</>;
}
