import React, { useState, useEffect } from 'react';
import AssignmentItem from './AssignmentItem';
import EditAssignment from './EditAssignment';
import CurrentPatientConsumer from '../CurrentPatient';
import useAssignmentRelativeRequests from './useAssignmentRelativeRequests';
import Preloader from '../../Preloader';
import { useSuperRelative } from '../useSuperRelative';
import http from '../../util/http';

const AssignmentContent = () => {
  const { currentPatientId } = CurrentPatientConsumer();

  const { data: superRel } = useSuperRelative(currentPatientId!);

  const {
    data: dataAssignmentRelativeRequests,
    isFetching: isFetchingAssignmentRelativeRequests,
    isSuccess: isSuccessAssignmentRelativeRequests,
  } = useAssignmentRelativeRequests(currentPatientId!, superRel!);

  const [idSelectedAssignment, setIdSelectedAssignment] = useState<string | null>(null);

  const [patientFullName, setPatientFullName] = useState<string | null>(null);

  useEffect(() => {
    if (currentPatientId) {
      http.get(`/relatives/relative_patients/${currentPatientId}/`).then((res: any) => {
        setPatientFullName(res.first_name + " " + res.last_name);
      });
    }
  }, [currentPatientId]);

  return (
    <div className="px-[23px]">
      {idSelectedAssignment === null ? (
        <div>
          <div className="mt-[27px] mb-[17px] text-[16px] text-black font-bold text-center">
            Angehörige freischalten
          </div>
          <p className="text-center">
            Als nächste:r Angehörige:r können Sie weitere Angehörige für den Patienten/die Patientin {patientFullName} freischalten. 
            Angehörige, die auf eine Freischaltung warten, werden Ihnen hier angezeigt.
          </p>
          <div>
            <div className="h-[40px]">
              {isFetchingAssignmentRelativeRequests && (
                <div className="flex items-center justify-center">
                  <Preloader small={true} />
                </div>
              )}
            </div>
            {isSuccessAssignmentRelativeRequests &&
              dataAssignmentRelativeRequests!.results?.length < 1 && (
                <div className="text-center">
                  Aktuell warten keine Angehörigen darauf, von Ihnen freigeschaltet zu werden. 
                </div>
              )}
            {isSuccessAssignmentRelativeRequests &&
              dataAssignmentRelativeRequests?.results.map((item) => (
                <AssignmentItem
                  key={item.id}
                  firstName={item.user.first_name}
                  lastName={item.user.last_name}
                  onClick={() => setIdSelectedAssignment(item.id)}
                />
              ))}
          </div>
        </div>
      ) : (
        <EditAssignment
          idSelectedAssignment={idSelectedAssignment}
          setIdSelectedAssignment={setIdSelectedAssignment}
        />
      )}
    </div>
  );
};

export default AssignmentContent;
