import React, { useRef, useState } from 'react';
import { ReactComponent as CloseCircleIcon } from '../../../assets/icons/close-circle.svg';
import { ReactComponent as ArrowSmall } from '../../../assets/icons/chevron.bottom.gray.svg';
import { FButton } from '../../../styles/form';
import http from '../../util/http';
import { useRelativesPendingInvites } from './useRelativesPendingInvites';
import CurrentPatientConsumer from '../CurrentPatient';
import ToastConsumer from '../../../hoc/toastProvider';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInput from 'react-phone-input-2';

const AddInvitationForm = () => {
  const { toast } = ToastConsumer();
  const container = useRef(null);
  const [open, setOpen] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const { currentPatientId } = CurrentPatientConsumer();
  const { refetch: refetchRealtivesInvites } = useRelativesPendingInvites();

  const options = [
    { value: 'Ehepartner:in', label: 'Ehepartner:in' },
    { value: 'Partner:in', label: 'Partner:in' },
    { value: 'Elternteil', label: 'Elternteil' },
    { value: 'Sohn / Tochter', label: 'Sohn / Tochter' },
    { value: 'Schwester / Bruder', label: 'Schwester / Bruder' },
    { value: 'Freund:in', label: 'Freund:in' },
    { value: 'andere:r Verwandte:r', label: 'andere:r Verwandte:r' },
    { value: 'Bekannte:r', label: 'Bekannte:r' },
  ];

  const addInvitations = (data: any) => {
    setDisabledButton(true);
    if (currentPatientId != null){
      http
        .post(`/relatives/relative_to_relative_invite/${currentPatientId}/`, data)
        .then((res) => {
          refetchRealtivesInvites();
          formik.resetForm();
          toast.success('Die Einladung wird verschickt');
        })
        .catch((e) => {
          if (e && Array.isArray(e)) {
            toast.error(e.join('\n'));
          } else {
            toast.error(e);
          }
        })
        .finally(() => {
          setDisabledButton(false);
        });
    }
    else {
      toast.error("Wählen Sie den aktuellen Patienten aus, bevor Sie Einladungen senden.")
    }
  };

  const SignupSchema = Yup.object().shape({
    firstName: Yup.string().required('Geben Sie bitte Ihren Vornamen ein'),
    lastName: Yup.string().required('Geben Sie bitte Ihren Nachnamen ein'),
    contact: Yup.string().required('Geben Sie bitte Ihren E-Mail-Adresse oder Handynummer '),
    selected: Yup.string().required('Geben Sie bitte Ihren Selected ein'),
    dataConfirm: Yup.boolean()
      .required('The terms and conditions must be accepted.')
      .oneOf([true], 'The terms and conditions must be accepted.'),
    agbConfirm: Yup.boolean()
      .required('The terms and conditions must be accepted.')
      .oneOf([true], 'The terms and conditions must be accepted.'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      contact: '',
      selected: '',
      dataConfirm: false,
      agbConfirm: false,
    },
    validationSchema: SignupSchema,
    onSubmit: (values, { resetForm }) => {
      if (values.contact.indexOf('@') === -1 && isValidPhoneNumber(values.contact)) {
        const dataForm = {
          first_name: values.firstName,
          last_name: values.lastName,
          email: '',
          phone: values.contact,
          relation: values.selected,
        };
        addInvitations(dataForm);
      } else if (values.contact && /\S+@\S+\.\S+/.test(values.contact.toLowerCase())) {
        const dataForm = {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.contact,
          phone: '',
          relation: values.selected,
        };
        addInvitations(dataForm);
      } else {
        formik.setFieldError('contact', 'Falsche E-Mail-Adresse oder Telefonnummer');
      }
    },
  });

  return (
    <div className="w-[100%] pt-[10px] px-[16px] pb-[12px] bg-[#FFF] mt-[21px] rounded-[10px] shadow-resultCard">
      <form onSubmit={formik.handleSubmit}>
        <div className="flex justify-between items-center pl-[10px] pr-[10px]">
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formik.values.firstName}
            placeholder={'Vorname'}
            className={`w-[60%] ${formik.touched.firstName && formik.errors.firstName && 'placeholder:text-[#FF3B30]'
              } bg-[#ffffff] text-[#000000]
                       focus:outline-none
                       disabled:bg-[#ffffff] disabled:text-[#6F7782]`}
            onChange={formik.handleChange}
          />
          <CloseCircleIcon
            className="cursor-pointer"
            onClick={() => formik.setFieldValue('firstName', '')}
          />
        </div>
        {formik.touched.firstName && formik.errors.firstName && (
          <span className="text-[8px] pt-[2px] ml-[10px] text-[#FF3B30] text-center ">
            {formik.errors.firstName}
          </span>
        )}
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex justify-between items-center pl-[10px] pr-[10px]">
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formik.values.lastName}
            placeholder={'Nachname'}
            className={`w-[60%] ${formik.errors.lastName && formik.touched.lastName && 'placeholder:text-[#FF3B30]'
              } bg-[#ffffff] text-[#000000]
                       focus:outline-none
                       disabled:bg-[#ffffff] disabled:text-[#6F7782]`}
            onChange={formik.handleChange}
          />
          <CloseCircleIcon
            className="cursor-pointer"
            onClick={() => formik.setFieldValue('lastName', '')}
          />
        </div>
        {formik.errors.lastName && formik.touched.lastName && (
          <span className="text-[8px] pt-[2px] ml-[10px] text-[#FF3B30] text-center ">
            {formik.errors.lastName}
          </span>
        )}
        <hr className="mt-[11px] mb-[11px] mr-[-15px] border-int-light-blue" />
        <div className="flex justify-between items-center pl-[10px] pr-[10px]">
          {formik.values.contact.charAt(0) === '+' || formik.values.contact.startsWith('00') ?
            <PhoneInput
              inputProps={{
                name: 'contact',
                autoFocus: true,
                onKeyUp:({ target: { value } }: any) => {
                  if (value && (value.startsWith('00'))) {
                    formik.setFieldValue("contact", value.replace(/^.{2}/g, '+49'));
                  }
                  if (value && (value.startsWith('+00'))) {
                    formik.setFieldValue("contact", value.replace(/^\+.{2}/g, '+49'));
                  }
                },
              }}
              country={'de'}
              inputStyle={{
                textAlign: 'left',
                fontSize: '16px',
                fontFamily: 'BeVietnamRegular',
                color: '#000000',
                width: '250px',
                paddingRight: '6px',
                border: "none",
              }}
              dropdownStyle={{ width: '250px' }}
              buttonStyle={{
                borderLeft: "none",
                borderTop:  "none",
                borderBottom:  "none",
                background: "#fff"
              }}
              value={formik.values.contact}
              onChange={(contact) => formik.setFieldValue('contact', contact ? "+" + contact : "")}
              onBlur={() => formik.validateOnBlur}
            /> : 
            <input
              type="text"
              id="contact"
              name="contact"
              value={formik.values.contact}
              placeholder={'E-Mail-Adresse oder Handynummer'}
              className={`w-[60%] ${formik.touched.contact && formik.errors.contact && 'placeholder:text-[#FF3B30]'
                } ${formik.touched.contact && formik.errors.contact ? 'text-[#FF3B30]' : 'text-[#000000]'
                } bg-[#ffffff] focus:outline-none disabled:bg-[#ffffff] disabled:text-[#6F7782]`}
              onChange={formik.handleChange}
            />
          }
          <CloseCircleIcon
            className="cursor-pointer"
            onClick={() => formik.setFieldValue('contact', '')}
          />
        </div>
        {formik.touched.contact && formik.errors.contact && (
          <span className="text-[8px] pt-[2px] ml-[10px] text-[#FF3B30] text-center ">
            {formik.errors.contact}
          </span>
        )}
        <hr className="mt-[11px] mr-[-15px] border-int-light-blue" />
        <div className="relative" ref={container}>
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="block cursor-pointer h-full bg-white appearance-none w-full text-int-grey-40 py-[11px] pl-[10px] pr-[40px] min-w-[160px]"
          >
            {formik.values.selected === '' ? (
              <span
                className={`${formik.touched.selected && formik.errors.selected && 'text-[#FF3B30]'
                  }`}
              >
                Beziehung
              </span>
            ) : (
              <span className="text-[#000000]">{formik.values.selected}</span>
            )}
          </div>
          {open && (
            <ul className="absolute shadow-card top-full left-0 w-full bg-white border border-t-0 border-int-mid-blue text-int-grey-40 rounded z-50 max-h-[350px] overflow-auto">
              {options.map(({ value, label }, index) => (
                <div key={index}>
                  <li
                    className="hover:bg-int-light-blue py-2 px-[13px] cursor-pointer flex items-center text-[#000000]"
                    onClick={() => {
                      formik.setFieldValue('selected', value);
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
          <div className="pointer-events-none absolute inset-y-0 right-[13px] flex items-center text-int-grey-60">
            <ArrowSmall />
          </div>
        </div>
        {formik.touched.selected && formik.errors.selected && (
          <span className="text-[8px] pt-[2px] ml-[10px] text-[#FF3B30] text-center ">
            {formik.errors.selected}
          </span>
        )}

        <hr className="mr-[-15px] border-int-light-blue" />
        <div className="flex flex-col justify-center mt-[10px]">
          <label className="checkbox-field my-[10px]">
            <input
              type="checkbox"
              id="dataConfirm"
              name="dataConfirm"
              checked={formik.values.dataConfirm}
              onChange={formik.handleChange}
            />
            <span className="checkmark"></span>
            <span
              className={`${formik.touched.dataConfirm && formik.errors.dataConfirm && 'text-[#FF3B30]'
                }`}
            >
              Ich darf die angegebenen Daten weitergeben
            </span>
          </label>
          <label className="checkbox-field my-[10px]">
            <input
              type="checkbox"
              id="agbConfirm"
              name="agbConfirm"
              checked={formik.values.agbConfirm}
              onChange={formik.handleChange}
            />
            <span className="checkmark"></span>
            <span
              className={`${formik.touched.agbConfirm && formik.errors.agbConfirm && 'text-[#FF3B30]'
                }`}
            >
              <span>Ich habe die </span>
              <a className="text-[#6D9CB7] cursor-pointer" href="https://www.intensivkontakt.de/agb" target="_blank">AGB</a>
              <span> von IntensivKontakt gelesen und bin damit einverstanden.</span>
            </span>
          </label>
          <div className="flex justify-center pt-[24px] pb-[44px]">
            <div className="max-w-[300px] w-[100%]">
              <FButton
                dark={true}
                type="button"
                onClick={() => formik.handleSubmit()}
                disabled={disabledButton}
              >
                ANGEHÖRIGE:N EINLADEN
              </FButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddInvitationForm;
