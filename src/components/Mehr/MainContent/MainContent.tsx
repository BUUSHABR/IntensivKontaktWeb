import React, { useEffect, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import http from '../../util/http';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ToastConsumer from '../../../hoc/toastProvider';
import PinCodeModalContent from './PinCodeModalContent';
import { Modal } from '../../Layout/Modal';
import ChangeMailModalContent from './ChangeMailModalContent';
import useAuthUsersMe from './useAuthUsersMe';
import { ReactComponent as ArrowSmall } from '../../../assets/icons/chevron.bottom.gray.svg';
import { isValidPhoneNumber } from 'libphonenumber-js';
const MainContent = () => {
  const { data: dataAuthUsersMe, refetch: refetchAuthUsersMe } = useAuthUsersMe();
  const container = useRef(null);
  const [open, setOpen] = useState(false);

  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isChangeMailModalOpen, setIsChangeMailModalOpen] = useState<boolean>(false);

  const { toast } = ToastConsumer();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [startName, setStartName] = useState<string>('');
  const [startSurname, setStartSurname] = useState<string>('');
  const [startPhone, setStartPhone] = useState<string>('');
  const [startEmail, setStartEmail] = useState<string>('');
  const [startRelation, setStartRelation] = useState<string>('');

  const [isEmailChanged, setIsEmailChanged] = useState<boolean>(false);

  const options = [
    { value: 'Ehepartner', label: 'Ehepartner' },
    { value: 'Partner:in', label: 'Partner:in' },
    { value: 'Elternteil', label: 'Elternteil' },
    { value: 'Sohn / Tochter', label: 'Sohn / Tochter' },
    { value: 'Schwester / Bruder', label: 'Schwester / Bruder' },
    { value: 'Freund:in', label: 'Freund:in' },
    { value: 'andere:r Verwandte:r', label: 'andere:r Verwandte:r' },
    { value: 'Bekannte:r', label: 'Bekannte:r' },
  ];

  const initialDataForm = () => {
    formik.values.firstName = dataAuthUsersMe?.first_name!;
    formik.values.lastName = dataAuthUsersMe?.last_name!;
    formik.values.phone = dataAuthUsersMe?.phone!;
    formik.values.email = dataAuthUsersMe?.email!;
    formik.values.relation = dataAuthUsersMe?.relation!;
    setStartName(dataAuthUsersMe?.first_name!);
    setStartSurname(dataAuthUsersMe?.last_name!);
    setStartPhone(dataAuthUsersMe?.phone!);
    setStartEmail(dataAuthUsersMe?.email!);
    setStartRelation(dataAuthUsersMe?.relation!);
  };

  useEffect(() => {
    initialDataForm();
  }, [dataAuthUsersMe]);

  useEffect(() => {
    http.get('/auth/users/check_email_change_pin_code_presence/')
        .then((res) => {
          if (res !== 204) {
            setIsPinModalOpen(true);
          }
        })
  }, []);

  const onConfirmPhoneClose = () => {
    http.delete("/auth/users/delete_email_change_pin_code/", {})
        .then(() => setIsPinModalOpen(false))
  }

  const sendApiMainContactData = () => {
    let formData = {};

    if (formik.values.firstName !== startName) {
      formData = { ...formData, first_name: formik.values.firstName };
    }
    if (formik.values.lastName !== startSurname) {
      formData = { ...formData, last_name: formik.values.lastName };
    }
    if (formik.values.phone !== startPhone) {
      formData = { ...formData, phone: formik.values.phone };
    }
    if (formik.values.email !== startEmail) {
      formData = { ...formData, email: formik.values.email };
      setIsEmailChanged(true);
    }

    if (formik.values.relation !== startRelation) {
      formData = { ...formData, relation: formik.values.relation };
    }

    if (
      formik.values.firstName !== startName ||
      formik.values.lastName !== startSurname ||
      formik.values.phone !== startPhone ||
      formik.values.email !== startEmail ||
      formik.values.relation !== startRelation
    ) {
      http
        .patch('/auth/users/me/', formData)
        .then((res) => {
          setIsEdit(false);
          refetchAuthUsersMe();
          toast.success('Speichern erfolgreich');
          if (formik.values.phone !== startPhone) {
            setIsPinModalOpen(true);
          } else if (formik.values.phone === startPhone && formik.values.email !== startEmail) {
            setIsChangeMailModalOpen(true);
          }
          initialDataForm();
        })
        .catch((err) => {
          toast.error(err);
          initialDataForm();
        });
    } else {
      setIsEdit(false);
    }
  };

  const cancelEditForm = () => {
    initialDataForm();
    setIsEdit(false);
    formik.setFieldError('firstName', '');
    formik.setFieldError('lastName', '');
    formik.setFieldError('phone', '');
    formik.setFieldError('email', '');
    formik.setFieldError('relation', '');
  };

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().required('Geben Sie bitte Ihren Vornamen ein'),
    lastName: Yup.string().required('Geben Sie bitte Ihren Nachnamen ein'),
    phone: Yup
      .string()
      .default(null)
      .test("is-phone", "Bitte geben Sie eine gültige Handynummer ein", value => !value || isValidPhoneNumber(value || ''))
      .nullable(),
    relation: Yup.string().required('Geben Sie bitte Ihren Beziehung ein'),
    email: Yup.string()
      .email('Ungültiges Email-Format')
      .required('Geben Sie bitte Ihren Email ein'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      relation: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      sendApiMainContactData();
    },
  });

  return (
    <div className="px-[23px] personal-data-container">
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-[27px] mb-[17px] text-[16px] text-black font-bold text-center">
          Kontaktdaten
        </div>
        {isEdit ? (
          <div className="mt-[27px] mb-[17px] flex justify-between">
            <span
              className="text-[16px] text-int-dark-blue cursor-pointer"
              onClick={() => cancelEditForm()}
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
          <div className="mt-[27px] mb-[17px] text-right">
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
            <span className="text-int-black">Vorname</span>
            {isEdit ? (
              <div className="flex flex-col">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formik.values.firstName}
                  className={`text-right w-[250px] bg-[#ffffff] text-black ${
                    formik.errors.firstName && 'border-[#FF3B30] text-[#FF3B30]'
                  } rounded-[4px] h-[33px] pr-[6px] focus:outline-none`}
                  onChange={formik.handleChange}
                  onBlur={() => formik.validateOnBlur}
                />
                <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                  {formik.touched.firstName && formik.errors.firstName}
                </span>
              </div>
            ) : (
              <span className="text-[#6F7782]">{dataAuthUsersMe?.first_name}</span>
            )}
          </div>

          <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
          <div className="flex justify-between items-center mt-[10px] flex-wrap gap-5">
            <span className="text-int-black">Nachname</span>
            {isEdit ? (
              <div className="flex flex-col">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formik.values.lastName}
                  className={`text-right w-[250px] bg-[#ffffff] text-black ${
                    formik.errors.lastName && 'border-[#FF3B30] text-[#FF3B30]'
                  } rounded-[4px] h-[33px] pr-[6px] focus:outline-none`}
                  onChange={formik.handleChange}
                  onBlur={() => formik.validateOnBlur}
                />
                <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                  {formik.touched.lastName && formik.errors.lastName}
                </span>
              </div>
            ) : (
              <span className="text-[#6F7782]">{dataAuthUsersMe?.last_name}</span>
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
                      onKeyUp:({ target: { value } }: any) => {
                        if (value && (value.startsWith('00'))) {
                          formik.setFieldValue("phone", value.replace(/^.{2}/g, '+49'));
                        }
                        if (value && (value.startsWith('+00'))) {
                          formik.setFieldValue("phone", value.replace(/^\+.{2}/g, '+49'));
                        }
                      },
                    }}
                    country={'de'}
                    inputStyle={{
                      textAlign: 'right',
                      fontSize: '16px',
                      fontFamily: 'BeVietnamRegular',
                      color: '#000000',
                      width: '250px',
                      paddingRight: '6px',
                      borderColor: formik.errors.phone && '#FF3B30',
                    }}
                    dropdownStyle={{ width: '250px' }}
                    buttonStyle={{
                      borderLeftColor: formik.errors.phone && '#FF3B30',
                      borderTopColor: formik.errors.phone && '#FF3B30',
                      borderBottomColor: formik.errors.phone && '#FF3B30',
                    }}
                    value={formik.values.phone}
                    onChange={(phone) => formik.setFieldValue('phone', "+" + phone)}
                    onBlur={() => formik.validateOnBlur}
                  />
                  <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                    {formik.touched.phone && formik.errors.phone}
                  </span>
                </div>
              ) : (
                <span className="text-[#6F7782]">{dataAuthUsersMe?.phone}</span>
              )}
            </div>
          </div>
          <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
          <div className="flex justify-between items-center mt-[10px] flex-wrap gap-5">
            <span className="text-int-black">E-Mail</span>

            {isEdit ? (
              <div className="flex flex-col">
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formik.values.email}
                  className={`text-right w-[250px] bg-[#ffffff] text-black ${
                    formik.errors.email && 'border-[#FF3B30] text-[#FF3B30]'
                  } rounded-[4px] h-[33px] pr-[6px] focus:outline-none`}
                  onChange={formik.handleChange}
                  onBlur={() => formik.validateOnBlur}
                />
                <span className="text-[8px] pt-[2px] text-[#FF3B30] text-center">
                  {formik.touched.email && formik.errors.email}
                </span>
              </div>
            ) : (
              <span className="text-[#6F7782]">{dataAuthUsersMe?.email}</span>
            )}
          </div>
          <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
          <div
            ref={container}
            className="relative flex justify-between items-center mt-[10px] flex-wrap gap-5"
            onClick={() => setOpen(!open)}
          >
            <span className="text-int-black">Beziehung</span>

            {isEdit ? (
              <div className="flex flex-col">
                  {open && (
                      <ul className="absolute shadow-card top-full left-0 w-full bg-white border border-t-0 border-int-mid-blue text-int-grey-40 rounded z-50 max-h-[350px] overflow-auto">
                        {options.map(({ value, label }, index) => (
                          <div key={index}>
                            <li
                              className="hover:bg-int-light-blue py-2 px-[13px] cursor-pointer flex items-center text-black"
                              onClick={() => {
                                formik.setFieldValue('relation', value);
                                setOpen(false);
                              }}
                            >
                              {label}
                            </li>
                            <hr className="bg-int-mid-blue" />
                          </div>
                        ))}
                      </ul>
                    )}
                <div className="pointer-events-none absolute inset-y-0 right-[13px] flex items-center text-black">
                  <span className="mr-2">{formik.values.relation}</span>
                  <ArrowSmall />
                </div>
              </div>
            ) : (
              <span className="text-[#6F7782]">{dataAuthUsersMe?.relation}</span>
            )}
          </div>
        </div>
      </form>

      {isPinModalOpen && (
        <Modal closeModal={() => setIsPinModalOpen(false)} title={<b>Aktivierungs-Code</b>} width={490}>
          <PinCodeModalContent
            closePinCode={() => setIsPinModalOpen(false)}
            openModalEmail={() => setIsChangeMailModalOpen(true)}
            isEmailChanged={isEmailChanged}
          />
        </Modal>
      )}
      {isChangeMailModalOpen && (
        <Modal
          closeModal={() => setIsChangeMailModalOpen(false)}
          title={<b>E-Mail-Adresse ändern</b>}
        >
          <ChangeMailModalContent closeModal={onConfirmPhoneClose} />
        </Modal>
      )}
    </div>
  );
};

export default MainContent;
