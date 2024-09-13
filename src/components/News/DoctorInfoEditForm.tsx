import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import http from '../util/http';
import CurrentPatientConsumer from '../Mehr/CurrentPatient';
import useDoctorData from './useDoctorData';
import ToastConsumer from '../../hoc/toastProvider';
import { Modal } from '../Layout/Modal';

const DoctorInfoEditForm = () => {
  const { toast } = ToastConsumer();
  const { currentPatientId } = CurrentPatientConsumer();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpenModalFirst, setIsOpenModalFirst] = useState<boolean>(false);
  const [isOpenModalSecond, setIsOpenModalSecond] = useState<boolean>(false);

  const { data: doctorData, refetch: refetchDictorData } = useDoctorData(currentPatientId!);
  const [startName, setStartName] = useState<string>('');
  const [startPhone, setStartPhone] = useState<string>('');
  const [startStreet, setStartStreet] = useState<string>('');
  const [startCity, setStartCity] = useState<string>('');
  const [startZipCode, setStartZipCode] = useState<string>('');

  const initialDoctorDataForm = () => {
    formik.values.name = doctorData?.name! || '';
    if (doctorData?.phone !== null && doctorData?.phone.includes('+')) {
      formik.values.phone = doctorData?.phone.replace('+', '')!;
    } else {
      formik.values.phone = doctorData?.phone! || '';
    }
    formik.values.street = doctorData?.street! || '';
    formik.values.city = doctorData?.city! || '';
    formik.values.zip_code = doctorData?.zip_code! || '';
    setStartName(doctorData?.name! || '');
    if (doctorData?.phone !== null && doctorData?.phone.includes('+')) {
      setStartPhone(doctorData?.phone.replace('+', '')!);
    } else {
      setStartPhone(doctorData?.phone! || '');
    }
    setStartStreet(doctorData?.street! || '');
    setStartCity(doctorData?.city! || '');
    setStartZipCode(doctorData?.zip_code! || '');
  };

  useEffect(() => {
    initialDoctorDataForm();
  }, [doctorData]);

  const cancelEditDoctorForm = () => {
    initialDoctorDataForm();
    setIsEdit(false);
    formik.setFieldError('name', '');
    formik.setFieldError('phone', '');
    formik.setFieldError('street', '');
    formik.setFieldError('city', '');
    formik.setFieldError('zip_code', '');
  };

  const sendApiDoctorInfoData = () => {
    const formData = {
      name: formik.values.name,
      phone: '+' + formik.values.phone,
      street: formik.values.street,
      city: formik.values.city,
      zip_code: formik.values.zip_code,
    };

    if (
      formik.values.name !== startName ||
      formik.values.phone !== startPhone ||
      formik.values.street !== startStreet ||
      formik.values.city !== startCity ||
      formik.values.zip_code !== startZipCode
    ) {
      http
        .patch(`/contacts/doctor_data/${doctorData?.id}/`, formData)
        .then((res) => {
          setIsEdit(false);
          refetchDictorData();
          toast.success('Speichern erfolgreich');
        })
        .catch(() => {
          toast.error('Fehler speichern');
          setIsEdit(false);
          initialDoctorDataForm();
        });
    } else {
      setIsEdit(false);
    }
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Geben Sie bitte Ihren Vornamen ein'),
    phone: Yup.string().required('Geben Sie bitte Ihren Telefonnummer ein'),
    street: Yup.string().required('Geben Sie bitte Ihren Straße ein'),
    city: Yup.string().required('Geben Sie bitte Ihren Ort ein'),
    zip_code: Yup.string().required('Geben Sie bitte Ihren PLZ ein'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      street: '',
      city: '',
      zip_code: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      setIsOpenModalFirst(true);
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        {isEdit ? (
          <div className="mt-[17px] mb-[17px] flex justify-between">
            <span
              className="text-[16px] text-int-dark-blue cursor-pointer"
              onClick={() => cancelEditDoctorForm()}
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
            <span className="text-int-black">Arzt</span>
            {isEdit ? (
              <div className="flex flex-col">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  className={`text-right w-[190px] bg-[#ffffff] text-[#000000] border border-[#CACACA] ${
                    formik.errors.name && 'border-[#FF3B30] text-[#FF3B30]'
                  } rounded-[4px] h-[33px] pr-[6px] focus:outline-none`}
                  onChange={formik.handleChange}
                  onBlur={() => formik.validateOnBlur}
                />
                <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                  {formik.touched.name && formik.errors.name}
                </span>
              </div>
            ) : (
              <span className="text-[#6F7782]">{doctorData?.name}</span>
            )}
          </div>

          <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
          <div className="flex justify-between items-center mt-[10px] flex-wrap gap-5">
            <span className="text-int-black">Telefonnummer</span>
            <div className="flex flex-row justify-between">
              {isEdit ? (
                <div className="flex flex-col">
                  <PhoneInput
                    inputProps={{
                      name: 'phone',
                    }}
                    country={'us'}
                    inputStyle={{
                      textAlign: 'right',
                      fontSize: '16px',
                      fontFamily: 'BeVietnamRegular',
                      color: '#000000',
                      width: '190px',
                      paddingRight: '6px',
                      borderColor: formik.errors.phone && '#FF3B30',
                    }}
                    dropdownStyle={{ width: '190px' }}
                    buttonStyle={{
                      borderLeftColor: formik.errors.phone && '#FF3B30',
                      borderTopColor: formik.errors.phone && '#FF3B30',
                      borderBottomColor: formik.errors.phone && '#FF3B30',
                    }}
                    value={formik.values.phone}
                    onChange={(phone) => formik.setFieldValue('phone', phone)}
                    onBlur={() => formik.validateOnBlur}
                  />
                  <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                    {formik.touched.phone && formik.errors.phone}
                  </span>
                </div>
              ) : (
                <span className="text-[#6F7782]">{doctorData?.phone}</span>
              )}
            </div>
          </div>
          <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
          <div className="flex justify-between items-center mt-[10px] flex-wrap gap-5">
            <span className="text-int-black">Straße</span>

            {isEdit ? (
              <div className="flex flex-col">
                <input
                  id="street"
                  name="street"
                  type="text"
                  value={formik.values.street}
                  className={`text-right w-[190px] bg-[#ffffff] text-[#000000] border border-[#CACACA] ${
                    formik.errors.street && 'border-[#FF3B30] text-[#FF3B30]'
                  } rounded-[4px] h-[33px] pr-[6px] focus:outline-none`}
                  onChange={formik.handleChange}
                  onBlur={() => formik.validateOnBlur}
                />
                <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                  {formik.touched.street && formik.errors.street}
                </span>
              </div>
            ) : (
              <span className="text-[#6F7782]">{doctorData?.street}</span>
            )}
          </div>

          <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
          <div className="flex justify-between items-center mt-[10px] flex-wrap gap-5">
            <span className="text-int-black">Ort</span>

            {isEdit ? (
              <div className="flex flex-col">
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formik.values.city}
                  className={`text-right w-[190px] bg-[#ffffff] text-[#000000] border border-[#CACACA] ${
                    formik.errors.city && 'border-[#FF3B30] text-[#FF3B30]'
                  } rounded-[4px] h-[33px] pr-[6px] focus:outline-none`}
                  onChange={formik.handleChange}
                  onBlur={() => formik.validateOnBlur}
                />
                <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                  {formik.touched.city && formik.errors.city}
                </span>
              </div>
            ) : (
              <span className="text-[#6F7782]">{doctorData?.city}</span>
            )}
          </div>

          <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
          <div className="flex justify-between items-center mt-[10px] flex-wrap gap-5">
            <span className="text-int-black">PLZ</span>

            {isEdit ? (
              <div className="flex flex-col">
                <input
                  id="zip_code"
                  name="zip_code"
                  type="text"
                  value={formik.values.zip_code}
                  className={`text-right w-[190px] bg-[#ffffff] text-[#000000] border border-[#CACACA] ${
                    formik.errors.zip_code && 'border-[#FF3B30] text-[#FF3B30]'
                  } rounded-[4px] h-[33px] pr-[6px] focus:outline-none`}
                  onChange={formik.handleChange}
                  onBlur={() => formik.validateOnBlur}
                />
                <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                  {formik.touched.zip_code && formik.errors.zip_code}
                </span>
              </div>
            ) : (
              <span className="text-[#6F7782]">{doctorData?.zip_code}</span>
            )}
          </div>
        </div>
      </form>

      {isOpenModalFirst && (
        <Modal closeModal={() => setIsOpenModalFirst(false)}>
          <div className="text-center ">
            <div className="text-[18px] font-bold text-int-black">Sind Sie sich sicher?</div>
            <div className="text-[14px] text-int-black mt-[8px] mb-[16px]">
              Mit Klicken auf “Jetzt senden” werden die geänderten Daten zur Überprüfung an das
              Krankehaus geschickt. Das können Sie nicht rückgängig machen. Wollen Sie die Daten
              jetzt senden?
            </div>
          </div>
          <hr className="border-[rgba(0, 0, 0, 0.4)] mb-[20px] -mx-[23px]" />
          <div className="text-center text-[#007AFF] text-[16px] font-medium">
            <span className="cursor-pointer" onClick={() => setIsOpenModalFirst(false)}>
              Abbrechen
            </span>
            {' | '}
            <span
              className="cursor-pointer"
              onClick={() => {
                setIsOpenModalFirst(false);
                setIsOpenModalSecond(true);
              }}
            >
              Jetzt Senden
            </span>
          </div>
        </Modal>
      )}
      {isOpenModalSecond && (
        <Modal closeModal={() => setIsOpenModalSecond(false)}>
          <div className="text-center ">
            <div className="text-[18px] font-bold text-int-black">Ungespeicherte Änderungen</div>
            <div className="text-[14px] text-int-black mt-[8px] mb-[16px]">
              Ihre Änderungen sind noch nicht gespeichert. Wollen Sie Ihre Änderungen speichern und
              damit direkt an das Krankenhaus schicken?
            </div>
          </div>
          <hr className="border-[rgba(0, 0, 0, 0.4)] mb-[20px] -mx-[23px]" />
          <div className="text-center text-[16px] font-medium text-int-black">
            <span className="cursor-pointer" onClick={() => setIsOpenModalSecond(false)}>
              Verwerfen
            </span>
            {' | '}
            <span
              className="cursor-pointer"
              onClick={() => {
                setIsOpenModalSecond(false);
                sendApiDoctorInfoData();
              }}
            >
              Speichern
            </span>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorInfoEditForm;
