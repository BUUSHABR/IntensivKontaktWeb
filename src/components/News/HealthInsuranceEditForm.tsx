import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import http from '../util/http';
import CurrentPatientConsumer from '../Mehr/CurrentPatient';
import ToastConsumer from '../../hoc/toastProvider';
import useRelativePatientProfile from './useRelativePatientProfile';

const HealthInsuranceEditForm = () => {
  const { toast } = ToastConsumer();
  const { currentPatientId } = CurrentPatientConsumer();
  const { data: relativePatientProfileData, refetch: refetchRelativePatientProfileData } =
    useRelativePatientProfile(currentPatientId!);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [startHealthInsurance, setStartHealthInsurance] = useState<string>('');

  const initialHealthInsuranceDataForm = () => {
    formik.values.insurance = relativePatientProfileData?.health_insurance || '';
    setStartHealthInsurance(relativePatientProfileData?.health_insurance || '');
  };

  useEffect(() => {
    initialHealthInsuranceDataForm();
  }, [relativePatientProfileData]);

  const cancelEditHealthInsuranceForm = () => {
    initialHealthInsuranceDataForm();
    setIsEdit(false);
    formik.setFieldError('insurance', '');
  };

  const sendApiHealthInsuranceData = () => {
    const formData = {
      health_insurance: formik.values.insurance,
    };

    if (formik.values.insurance !== startHealthInsurance) {
      http
        .patch(`/contacts/patients/${currentPatientId}/edit_health_insurance/`, formData)
        .then((res) => {
          setIsEdit(false);
          refetchRelativePatientProfileData();
          toast.success('Speichern erfolgreich');
        })
        .catch(() => {
          toast.error('Fehler speichern');
          setIsEdit(false);
          initialHealthInsuranceDataForm();
        });
    } else {
      setIsEdit(false);
    }
  };

  const SignupSchema = Yup.object().shape({
    insurance: Yup.string().required('Geben Sie bitte Ihren Krankenkasse ein'),
  });

  const formik = useFormik({
    initialValues: {
      insurance: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      sendApiHealthInsuranceData();
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {isEdit ? (
          <div className="mt-[17px] mb-[17px] flex justify-between">
            <span
              className="text-[16px] text-int-dark-blue cursor-pointer"
              onClick={() => cancelEditHealthInsuranceForm()}
            >
              Verwerfen
            </span>
            <span
              className="text-[16px] text-int-dark-blue cursor-pointer font-bold"
              onClick={() => {
                formik.handleSubmit();
              }}
            >
              Fertig
            </span>
          </div>
        ) : (
          <div className="mt-[17px] mb-[17px] text-right">
            <span
              className="text-[16px] text-int-dark-blue cursor-pointer"
              onClick={() => setIsEdit(true)}
            >
              Bearbeiten
            </span>
          </div>
        )}

        <div className="w-[100%] pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] shadow-resultCard">
          <div className="flex justify-between items-center flex-wrap gap-5">
            <span className="text-int-black">Krankenkasse</span>
            {isEdit ? (
              <div className="flex flex-col">
                <input
                  id="insurance"
                  name="insurance"
                  type="text"
                  value={formik.values.insurance}
                  className={`text-right w-[190px] bg-[#ffffff] text-[#000000] border border-[#CACACA] ${
                    formik.errors.insurance && 'border-[#FF3B30] text-[#FF3B30]'
                  } rounded-[4px] h-[33px] pr-[6px] focus:outline-none`}
                  onChange={formik.handleChange}
                  onBlur={() => formik.validateOnBlur}
                />
                <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                  {formik.touched.insurance && formik.errors.insurance}
                </span>
              </div>
            ) : (
              <span className="text-[#6F7782]">{relativePatientProfileData?.health_insurance}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default HealthInsuranceEditForm;
