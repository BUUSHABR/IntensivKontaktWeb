import AccordionChild from './AccordionChild';

import example from 'assets/img/example.jpg';

const DATA = [
  {
    title: 'Wie funktioniert Intensivkontakt?',
    media: true,
    points: [
      {
        title: 'Medien hochladen und OldDiashow erstellen lassen',
        description:
          'Wähle direkt von deinem Handy oder PC Fotos, Videos und Sprachnachrichten aus und lade sie hoch. IntensivKontakt erstellt automatisch eine gesammelte OldDiashow für deine Angehörigen.',
      },
      {
        title: 'Vor Ort abspielen lassen',
        description:
          'Das Pflegepersonal vor Ort wird informiert, wenn deine Medien hochgeladen sind und spielt die OldDiashow deinen Angehörigen ab. Du wirst benachrichtigt, wenn sie es sehen.',
      },
      {
        title: 'Reaktionen deiner Angehörigen erhalten',
        description:
          'Du erhältst nach dem Abspielen der OldDiashow sofort eine Benachrichtigung. Darin steht auch, wie es die Pflegekräfte vor Ort den Zustand deiner Angehörigen einschätzen. ',
      },
    ],
  },
  {
    title: 'Wer trägt die Kosten?',
    description:
      'Für Patient:innen und Angehörige entstehen zu keinem Zeitpunkt Kosten. Das System wird von der behandelnden Klinik kostenlos zu Verfügung gestellt. IntensivKontakt wurde aus den Erfahrungen der Corona Pandemie gegründet und zielt auf schnelle und niederschwellige Hilfe für Angehörige und Patient:innen ab.',
  },
  {
    title: 'Was passiert mit deinen Bildern, Videos und Sprachnachrichten?',
    description:
      'Nach der Entlassung deiner Angehörigen werden alle sensiblen Dateien wie Bilder, Videos und Sprachnachrichten von uns automatisch gelöscht. Solltest du das System noch einmal benötigen, kannst du deinen Account mit einer neuen Einladung wieder verwenden.',
  },
  {
    title: 'Warum ist IntensivKontakt wichtig?',
    description:
      'Mehrere Studien konnten diverse positive Auswirkungen digitaler Kommunikation auf die Genesung von Patient:innen schon belegen; darunter eine verkürzte Beatmungszeit, weniger Verwirrungszustände und eine verringerte psychische Belastung für Patient:innen und Angehörige. Du kannst durch aktive Teilhabe an der Versorgung dazu beitragen, dass es deinen Angehörigen langfristig besser geht.',
  },
  {
    title: 'Was sagen Pflegekräfte dazu?',
    description:
      '„Wir sehen jetzt nach einigen Wochen bereits, dass sich eine Kommunikation zwischen Patienten und Angehörigen positiv auf die Genesung auswirken kann“ so Cornelia Keiner, Pflegeleitung mehrerer Intensivstationen in Nordrhein-Westfalen.',
  },
  {
    title: 'Woher haben wir deine Kontaktdaten und warum brauche ich einen Account?',
    description:
      'Die behandelnde Klinik leitet deine Kontaktdaten auf verschlüsseltem Wege an uns weiter und gibt uns somit die Möglichkeit, dich zu informieren und immer auf dem neusten Stand zu halten. Wir erhalten lediglich deinen Name, E-Mail-Adresse oder Telefonnummer von dir. Dein Account stellt sicher, dass deine Bilder, Videos und Sprachnachriten nur bei deinen Angehörigen ankommen.',
  },
];

export default function index() {
  const styleBullet = `
    relative p-6 pt-2 pl-6 after:absolute after:content[""] 
    after:w-4 after:h-4 after:rounded-full after:bg-int-mid-blue after:left-0 after:top-3
    before:absolute before:content[""] before:w-[1px] before:bg-int-mid-blue before:left-2 before:top-3 before:-bottom-7 last:before:content-none
    `;

  return (
    <div>
      {DATA.map((entry, index) => (
        <AccordionChild title={entry.title} key={index} active={index === 0}>
          <div>
            {entry.media && <img src={example} alt="" className="mb-4" />}
            {entry.points ? (
              <>
                {entry.points.map(({ title, description }, index) => (
                  <div className={styleBullet} key={index}>
                    <h3 className="text-int-grey-60 mb-2">
                      {index + 1 > 9 ? index + 1 : '0' + (index + 1)} - {title}
                    </h3>
                    <p className="text-int-grey-60">{description}</p>
                  </div>
                ))}
              </>
            ) : (
              <p
                className="text-int-grey-60 mb-2"
                dangerouslySetInnerHTML={{ __html: entry.description }}
              ></p>
            )}
          </div>
        </AccordionChild>
      ))}
    </div>
  );
}
