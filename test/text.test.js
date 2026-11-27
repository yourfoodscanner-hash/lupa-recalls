'use strict';
/**
 * Reading pages and feeds, and the values taken out of a notice's text. Every example below is a
 * sentence from a real notice (HR, BA, SI, DE, AT — November 2026) or a case that must NOT be taken.
 */
const { verify } = require('./no-network');   // first: no test may touch the network
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('../lib/text');
const { hazardOf, sentenceNaming } = require('../lib/classify');

test('barcodes: only after a label, whole, with a valid check digit, never a shop\'s own number', () => {
  const cases = [
    ['S BUDGET JETRENA PAŠTETA 100g, bar koda 3856021204937, upotrijebiti do 04.07.2027', ['3856021204937']],
    ['ALNATURA BADEMI EKOPROIZVOD 200g, Lot broja L711129B, EAN: 4104420055421/ 4104420055438', ['4104420055421', '4104420055438']],
    ['EAN: 4104420055421 / 4104420055422', ['4104420055421']],                                 // the second has a wrong check digit
    ['Povlačenje se isključivo odnosi na proizvod brojeva šarže 2521 i 2532 te GTIN broja 4067796183429.', ['4067796183429']],
    ['Pizza šunka narezek; lot: 1630104; rok uporabe: 27.11.2026; EAN 3831115348162.', ['3831115348162']],
    ['Parfum Puella DOUBLE Y, 50 ml\nŠtevilka serije: 003\nČrtna koda: 8588009856313', ['8588009856313']],
    ['Inverkehrbringer laut Verpackung ist die Firma Talia. EAN: 0653998013240', ['0653998013240']],
    ['1. Toast Tuš American, Ean: 3831029358431\n2. Toast Tuš s semeni, Ean: 3831029358967', ['3831029358431', '3831029358967']],
    ['Barcode: 4061459455298', ['4061459455298']],
    // not taken
    ['Artikelnummer: 780770017610000000200, 823540017610000000200', []],                     // not a barcode label, too long
    ['LOT 3856021204937', []],                                                                 // a batch label, not a barcode label
    ['Proizvod 3856021204937 je povučen', []],                                                 // no label at all
    ['EAN: 3 856021 204937', []],                                                              // never assembled from pieces
    ['črtna koda: 2659557; serija: 26392239', []],                                             // 7 digits: no barcode
    ['EAN: 2609898025201', []],                                                                // a number shops give out themselves
    ['Pro L 2652541 / GGN 4059883043006', []],                                                 // GGN is not a barcode
  ];
  for (const [text, want] of cases) assert.deepEqual(T.labeledGtins(text), want, text);
});

test('batches: only after a label, short, with a digit — never prose and never a date alone', () => {
  const cases = [
    ['Panceta kockice VP, 0,55kg, LOT 918N33, najbolje upotrijebiti do 20.03.2027.', ['918N33']],
    ['opoziva proizvod J.D. Gross Tamna čokolada 70%, 125g s rokom trajanja 04.04.2028., lot L233249A2, zbog utvrđene', ['L233249A2']],
    ['Povlačenje se isključivo odnosi na proizvod brojeva šarže 2521 i 2532 te GTIN broja 4067796183429.', ['2521', '2532']],
    ['Naziv proizvoda: Njoki premium Težina: 500 g Oznaka lota: L:250312 Rok trajanja: 12.03.2026.', ['L:250312']],
    ['Prehransko dopolnilo: CUPIDON\nLot/serija: 0629\nRok uporabe: 06/2029', ['0629']],
    ['File vitkega soma\nLot: VN1058VI656 in VN1058VI660', ['VN1058VI656', 'VN1058VI660']],
    ['Mleta kava; lot: LC5 BD149T; rok uporabe: 29.5.2027; pakiranje: 250g.', ['LC5 BD149T']],
    ['Suhe marelice Garden Good 180g,\nLot: L 15 326012,\nUporabno najmanj do: 02.06.2027', ['L 15 326012']],
    ['Losnummer: 26128774', ['26128774']],
    ['Lot: LC233098, BBD 02/2026', ['LC233098']],
    ['Lotnummers: 07/12 – 08/12 – 09/12', ['07/12', '08/12', '09/12']],                         // a list split by dashes
    ['Lot: L12345 – best before 12.12.2026', ['L12345']],
    ['Lotnummers: 103150 / 104062 / 104731', ['103150', '104062', '104731']],
    ['Productiecode: 6218 (houdbaarheidsdatum 6-8-2027 en 7-8-2027)', ['6218']],
    ['Batch code: Use-by-date: 04/11/2026', []],                                                // a date where the batch would be
    // not taken
    ['Serija proizvoda je povučena s tržišta zbog utvrđene bakterije', []],                     // no value with a digit
    ['lot: 15.10.2026', []],                                                                    // a date, not a batch
    ['Mehrere Chargen sind betroffen, bitte prüfen Sie die Verpackung', []],
  ];
  for (const [text, want] of cases) assert.deepEqual(T.labeledLots(text), want, text);
});

test('dates: only after a best-before label, as written there', () => {
  const cases = [
    ['LOT 918N33, najbolje upotrijebiti do 20.03.2027., iz predostrožnosti', ['20.03.2027']],
    ['s rokom trajanja 04.04.2028., lot L233249A2', ['04.04.2028']],
    ['Lot: 5999862\nRok uporabe: 4. 7. 2028\nPakiranje: 4 tablete', ['4. 7. 2028']],
    ['Uporabno najmanj do: 28.10.2026 in 10.12.2026.', ['28.10.2026', '10.12.2026']],
    ['Rok uporabe: 06/2029', ['06/2029']],
    ['Mindesthaltbarkeitsdatum: 24.01.2027', ['24.01.2027']],
    ['Uporabno najmanj do: 02-02-2027, 24-02-2027,', ['02-02-2027', '24-02-2027']],
    // a range stays one range, not two dates
    ['Navedeni rok uporabnosti: od 05.11.2026 do 06.12.2026.', ['05.11.2026 – 06.12.2026']],
    ['Houdbaarheidsdata (Ten minste houdbaar tot): vanaf 07-12-26 tot 13-12-26', ['07-12-26 – 13-12-26']],
    ['Best-before dates: All best-before dates from 30/06/2027 to 25/08/2027 inclusive', ['30/06/2027 – 25/08/2027']],
    ['Ten minste houdbaar tot (THT): 28-11-2026 & 29-11-2026', ['28-11-2026', '29-11-2026']],
    ['Ten minste houdbaar tot (THT): van 15-11-2026 t/m 11-12-2026', ['15-11-2026 – 11-12-2026']],
    ['THT-data: 07-01-2027, 09-01-2027 en 06-02-2027', ['07-01-2027', '09-01-2027', '06-02-2027']],
    ['Lejárati idő: 2027.12.19.', ['2027.12.19']],
    ['Best before: from 01/02/2027 onwards', []],                                               // a start without its end
    // not taken
    ['Objavljeno 19.06.2026. na stranicama agencije', []],
    ['Rok uporabe: od danas', []],
  ];
  for (const [text, want] of cases) assert.deepEqual(T.labeledDates(text), want, text);
});

test('"because": the notice\'s own words, to the end of the clause', () => {
  assert.equal(T.becauseClause('… opoziva proizvod …, lot L233249A2, zbog utvrđene prisutnosti kikirikija koji nije označen na ambalaži.\nS obzirom …'), 'utvrđene prisutnosti kikirikija koji nije označen na ambalaži');
  assert.equal(T.becauseClause('… zbog utvrđene migracije primarnih aromatskih amina (PAA).'), 'utvrđene migracije primarnih aromatskih amina (PAA)');
  assert.equal(T.becauseClause('… zbog utvrđene bakterije iz roda Salmonella spp. u proizvodu.'), 'utvrđene bakterije iz roda Salmonella spp. u proizvodu');
  assert.equal(T.becauseClause('Previdnostni umik iz prodaje zaradi potencialne občasne prisotnosti plesni v posameznih pakiranjih.', ['zaradi']), 'potencialne občasne prisotnosti plesni v posameznih pakiranjih');
  assert.equal(T.becauseClause('… da, zbog potencijalnog prisustva stranog tijela metalnog porijekla, iz predostrožnosti, provodi …'), 'potencijalnog prisustva stranog tijela metalnog porijekla');
  assert.equal(T.becauseClause('… zbog prisutnosti alergena (mlijeko, soja) koji nisu navedeni.'), 'prisutnosti alergena (mlijeko, soja) koji nisu navedeni');
  assert.equal(T.becauseClause('Proizvod je povučen iz prodaje.'), null);
});

test('pages and feeds to text; days; ids', () => {
  assert.equal(T.htmlToText('<p>Maniokmehl &#8222;Kokonte&#8220;</p><script>x()</script><dl><dt>Grund:</dt><dd>Fremd&shy;k&ouml;rper</dd></dl>'), 'Maniokmehl „Kokonte“\nGrund:\nFremdkörper');
  assert.equal(T.decodeEntities('Schlie&amp;szlig;en'), 'Schlie&szlig;en');                          // one pass only
  const items = T.rssItems('<?xml version="1.0"?><rss version="2.0"><channel><item><title>Opoziv &#8211; Set</title><link>https://www.hapih.hr/x/</link><pubDate>Fri, 20 Nov 2026 23:21:45 +0000</pubDate><description><![CDATA[<p>Tekst</p>]]></description><category><![CDATA[Obavijesti za potrošače]]></category><guid isPermaLink="false">https://www.hapih.hr/?p=33036</guid></item></channel></rss>');
  assert.deepEqual(items, [{ title: 'Opoziv – Set', link: 'https://www.hapih.hr/x/', guid: 'https://www.hapih.hr/?p=33036', pubDate: 'Fri, 20 Nov 2026 23:21:45 +0000', description: '<p>Tekst</p>', content: '', categories: ['Obavijesti za potrošače'] }]);
  assert.throws(() => T.rssItems('<!doctype html><html>Prijava</html>'), /nije RSS/);
  assert.equal(T.dayIn('Fri, 20 Nov 2026 23:21:45 +0000', 'Europe/Zagreb'), '2026-11-21');           // the authority's own day
  assert.equal(T.dayIn('Thu, 26 Nov 2026 17:35:00 +0100', 'Europe/Berlin'), '2026-11-26');
  assert.equal(T.dayIn('nonsense', 'Europe/Berlin'), null);
  assert.equal(T.dayOfDotted('04. 02. 2020'), '2020-02-04');
  assert.equal(T.dayOfDotted('26.11.2026.'), '2026-11-26');
  for (const bad of ['31.02.2026', '2026-11-26', '', null]) assert.equal(T.dayOfDotted(bad), null, String(bad));
  assert.equal(T.idOf('de-lmw-', '261126_29_BY_Weißbier'), 'de-lmw-261126-29-by-weissbier');
  const long = T.idOf('at-ages-', 'lidl-nautica-regenbogen-forellenfilets-natur-125g-und-nautica-regenbogen-forellenfilets-pfeffer-125g');
  assert.equal(long.length, 80);
  assert.match(long, /^at-ages-lidl-nautica-[a-z0-9-]+-[0-9a-z]{7}$/);
  assert.equal(T.idOf('at-ages-', 'lidl-nautica-regenbogen-forellenfilets-natur-125g-und-nautica-regenbogen-forellenfilets-pfeffer-125g'), long);   // stable
  assert.notEqual(T.idOf('at-ages-', 'lidl-nautica-regenbogen-forellenfilets-natur-125g-und-nautica-regenbogen-forellenfilets-pfeffer-250g'), long);
  assert.equal(T.idOf('x-', '…'), null);
  assert.equal(T.cut('jedan dva tri četiri', 12), 'jedan dva…');
  assert.equal(T.alignedFold('Čokolada ŠAŽ').length, 'Čokolada ŠAŽ'.length);
});

test('labels of Denmark, Czechia and Greece: barcodes, batches and dates only where named', () => {
  const dk = "Heat'n Eat Okse kebab\nNettoindhold: 400 g\nBedst før 7/4-2028 og 12/4-2028\nEAN: 5705518183096";
  assert.deepEqual(T.labeledDates(dk), ['7/4-2028', '12/4-2028']);
  assert.deepEqual(T.labeledGtins(dk), ['5705518183096']);
  assert.deepEqual(T.labeledGtins('EAN-stregkode: 7340191175181'), ['7340191175181']);
  assert.deepEqual(T.labeledDates('Karen Volf Digestive Classic 250g bedst før:\n15-09-2026, 29-09-2026 og 06-10-2026'), ['15-09-2026', '29-09-2026', '06-10-2026']);
  assert.deepEqual(T.labeledLots('Lot nr. 12345 og 12346'), ['12345', '12346']);
  assert.deepEqual(T.labeledLots('Batch nr.: L2345, bedst før 1.2.2027'), ['L2345']);
  assert.deepEqual(T.labeledLots('partier af produktet er solgt'), []);                       // "partier" is a word, not a label
  const gr = 'με αριθμό παρτίδας Lot 18726, με ημερομηνία κατάψυξης 06/07/2026 και ημερομηνία ανάλωσης 06/07/2027, που';
  assert.deepEqual(T.labeledLots(gr), ['18726']);                                              // "παρτίδας Lot 18726" once
  assert.deepEqual(T.labeledDates(gr), ['06/07/2027']);                                        // the freezing day is not a best-before date
  const gr2 = 'με ημερομηνία ανάλωσης κατά προτίμηση πριν από 01.07.27 και παρτίδα L07 26 27 διαπιστώθηκε η παρουσία σκουληκιών';
  assert.deepEqual([T.labeledLots(gr2), T.labeledDates(gr2)], [['L07 26 27'], ['01.07.27']]);
  assert.equal(T.becauseClause('διαπιστώθηκε η παρουσία σκουληκιών. Η επιχείρηση', ['διαπιστωθηκε']), 'η παρουσία σκουληκιών');
  assert.equal(T.becauseClause('zbog 3,2 mg/kg aloina, i to', ['zbog']), '3,2 mg/kg aloina');   // a decimal comma does not end the clause
  assert.equal(T.decodeEntities('Makrelkr&aelig;s &oslash; &aring;'), 'Makrelkræs ø å');
});

test('kinds of hazard in the languages of the new sources — and a sentence that only cites the law is not a reason', () => {
  const cases = [
    ['utvrđene bakterije Listeria monocytogenes u proizvodu', 'microbe'], ['Možna prisotnost salmonele v izdelku', 'microbe'], ['Prisotnost noravirusa', 'microbe'],
    ['Schimmel', 'microbe'], ['Salmonellen', 'microbe'], ['Listerien', 'microbe'], ['tragova plijesni u proizvodu', 'microbe'],
    ['Fremdkörper', 'foreign'], ['potencijalnog prisustva stranog tijela metalnog porijekla', 'foreign'], ['Metallfragmente', 'foreign'],
    ['Presežena vsebnost aflatoksina B1', 'toxin'], ['Povećane količine cijanovodonične kiseline', 'toxin'], ['potencijalnog prisustva cereulida', 'toxin'],
    ['povišene razine pesticida klorpirifosa', 'chemical'], ['Rückstände und Kontaminanten', 'chemical'], ['Gesundheitsschädliche Substanz', 'chemical'], ['Acetamiprid', 'chemical'],
    ['V izdelku je bil z analizo določen alergen linalol', 'allergen'], ['ne označenog proteina mlijeka u proizvodu', 'allergen'], ['Allergene', 'allergen'],
    ['Verunreinigung mit Pinus-armandii-Kernen', 'other'], ['moguće izloženosti ionizacijskom zračenju', 'other'], ['Sonstige Gründe', 'other'],
    ['Der er risiko for mykotoksiner i produkterne', 'toxin'], ['påvist ikke-deklareret æg i produktet', 'allergen'], ['risiko for insekter/biller i produktet', 'foreign'],
    ['Bakterien Listeria monocytogenes er påvist', 'microbe'], ['for højt indhold af cadmium', 'chemical'], ['Uvnitř výrobku byl zjištěn výskyt živých škůdců', 'foreign'],
    ['Escherichia coli produkující shiga-toxin (STEC)', 'microbe'], ['παρουσία του παθογόνου μικροοργανισμού Salmonella spp.', 'microbe'], ['παρουσία σκουληκιών', 'foreign'],
    ['πιθανή παρουσία ξένων σωμάτων (θραυσμάτων γυαλιού)', 'foreign'], ['High level of hydrogen cyanide in cassave flour', 'toxin'], ['Glycoalkaloids in potatoes', 'toxin'],
  ];
  for (const [text, kind] of cases) assert.equal(hazardOf(text), kind, text);
  assert.equal(hazardOf('Fini\'s Feinstes Bio-Weizenkeime'), 'other');                                // "Keime" in a name is not germs
  assert.equal(sentenceNaming('Shodno članu 14. Zakona o hrani („Službeni glasnik BiH“), mikrobiološke promjene … . Provodi se u skladu s novim pragovima za cereulid u formulama.'), 'Provodi se u skladu s novim pragovima za cereulid u formulama');
  assert.equal(sentenceNaming('Proizvod je povučen.'), null);
});

verify();
