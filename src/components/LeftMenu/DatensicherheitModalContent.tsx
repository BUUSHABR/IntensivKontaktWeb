import React from 'react';

const DatensicherheitModalContent = () => {
  return (
    <div>
      <div className="font-bold text-int-black mb-[10px]">Datenschutz</div>
      <div className="text-int-grey-60 mb-[10px]">
        Datensicherheit hat oberste Priorität bei der IntensivKontakt GmbH & Co. KG. Daher speichern wir nur die nötigsten Daten, 
        diese sind aber verschlüsselt und werden zu keinem Zeitpunkt an Dritte weitergegeben. Lesen Sie mehr in unseren 
        <a className="font-bold text-black" href="https://www.intensivkontakt.de/support/"> FAQ</a>s oder kontaktieren Sie uns unter 
        <a className="font-bold text-black" href="mailto: support@intensivkontakt.de"> support@intensivkontakt.de</a> .
      </div>
      <div className="mb-[30px]">
        <a
          className="text-[#6D9CB7] mb-[30px] cursor-pointer"
          href="https://www.intensivkontakt.de/datenschutz"
          target="_blank"
          rel="noreferrer"
        >
          Zur Datenschutzerklärung
        </a>
      </div>

      <div className="font-bold text-int-black mb-[10px]">Impressum</div>
      <div className="font-bold text-int-black mb-[10px]">Angaben gemäß § 5 TMG</div>
      <div className="text-int-grey-60 mb-[10px]">
        IntenisvKontakt GmbH & Co. KG
        <br />
        Knesebeckstr. 69-61
        <br />
        10719 Berlin
      </div>
      <div className="text-int-grey-60 mb-[10px]">
        Handelsregister: HRA 128571
        <br />
        Registergericht: Amtgericht Hamburg
        <br />
        UstID: DE352569622
      </div>
      <div className="text-int-grey-60 mb-[10px]">
        Vertreten durch:
        <br />
        Nikolas Groth Verwaltungsgesellschaft mbH
        <br />
        Diese vertreten durch den Geschäftsführer:
        <br />
        Nikolas Groth
      </div>
      <div>
        <a
          className="text-[#6D9CB7]"
          href="https://www.intensivkontakt.de/impressum"
          target="_blank"
          rel="noreferrer"
        >
          Zum Impressum
        </a>
      </div>
    </div>
  );
};

export default DatensicherheitModalContent;
