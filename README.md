# lupa-recalls — povučeni proizvodi za aplikaciju LUPA

Ovaj repozitorij pravi **jedan fajl** koji aplikacija LUPA čita:

```
https://yourfoodscanner-hash.github.io/lupa-recalls/v1/recalls.json
```

U fajlu su službene obavijesti o povlačenju proizvoda (hrana, hrana za bebe, suplementi,
kozmetika). Posao ih sam čita iz šest službenih izvora — Francuska, Njemačka, Austrija, Slovenija,
Hrvatska, BiH (poglavlje 3) — a ručno se može dodati bilo koja druga (poglavlje 2). Svaka obavijest
ima izvor i link na službenu obavijest. Aplikacija sama ne čita ničije stranice — čita samo ovaj fajl.

Posao se pokreće sam, svaki dan u 03:10 UTC, i nakon svake izmjene u repozitoriju.

---

## 1. Postavljanje (jednom)

1. Na GitHubu napravi **javni** repozitorij `lupa-recalls` pod nalogom `yourfoodscanner-hash`
   (bez README-a, bez licence — prazan).
2. U tom repozitoriju, prije prvog slanja koda:
   - **Settings → Pages → Build and deployment → Source: GitHub Actions**;
   - **Settings → Actions → General → Workflow permissions → Read and write permissions** (posao
     čuva objavljeni fajl u repozitoriju).

   Ako GitHub ne da izabrati izvor za Pages dok je repozitorij prazan, uradi ovo odmah nakon koraka 3.
   Prvo pokretanje će tada pasti na objavi — to je očekivano; pokreni ga ponovo (korak 4).
3. Raspakuj zip, pa:

   ```
   cd lupa-recalls
   git init -b main
   git add .
   git commit -m "lupa-recalls: prva verzija"
   git remote add origin https://github.com/yourfoodscanner-hash/lupa-recalls.git
   git push -u origin main
   ```
4. Slanje koda samo pokrene posao (**Actions → Feed**). Kad završi (oko 1 minute), otvori adresu s
   vrha: treba se vidjeti JSON. U sažetku pokretanja (Summary) piše koliko je obavijesti objavljeno
   i iz kojeg izvora. Ručno pokretanje: **Actions → Feed → Run workflow**.

Ako se adresa naloga ili repozitorija razlikuje, adresa fajla se mijenja — tada je treba
promijeniti i u aplikaciji (`lib/recallsStore.ts`, `RECALLS_URL`) i u `config.json` ovdje.

## 2. Kako dodati obavijest ručno (samo ono što izvori ne daju)

Obavijesti iz BiH, Hrvatske, Slovenije, Njemačke, Austrije i Francuske posao čita sam (poglavlje 3) —
njih **ne treba** unositi. Ručno se unosi samo ono čega u tim izvorima nema: npr. Srbija, ili
obavijest neke druge zemlje EU. Unosi se iz službene objave nadležnog tijela. Najlakše direktno na
GitHubu: otvori `curated/hr.json` (ili `ba.json`, `rs.json`, `si.json`; za ostale zemlje EU
`eu.json`) → olovka (Edit) → dodaj obavijest u listu → **Commit changes**. Za oko minutu je
u aplikaciji.

```json
[
  {
    "id": "hr-2026-11-24-kasica-jabuka",
    "country": "HR",
    "published": "2026-11-24",
    "category": "baby",
    "hazard": "foreign",
    "name": "Dječja kašica jabuka i kruška, 190 g",
    "brand": "Naziv marke",
    "reason": "komadići stakla",
    "details": "U pojedinim teglicama mogući su komadići stakla.",
    "lots": "L24318, L24319",
    "bestBefore": "30. 6. 2027.",
    "action": "Ne konzumirati. Proizvod vratiti na mjesto kupovine.",
    "source": "Državni inspektorat Republike Hrvatske",
    "url": "https://dirh.gov.hr/…adresa-službene-obavijesti…",
    "gtins": ["3850123456782"]
  }
]
```

| Polje | Obavezno | Šta je |
|---|---|---|
| `id` | da | Jedinstveno ime: mala slova a–z, cifre i `-` (3–80 znakova). Najbolje `zemlja-datum-proizvod`. Jednom objavljen id se ne mijenja i ne koristi ponovo. |
| `country` | da | Gdje je obavijest objavljena: `BA`, `HR`, `RS`, `SI` ili druga članica EU (`DE`, `IT` …). |
| `published` | da | Dan objave: `GGGG-MM-DD`. |
| `category` | da | `baby` (hrana za bebe), `food`, `supplement`, `cosmetic`, `other`. |
| `hazard` | da | Vrsta opasnosti — aplikacija je ispisuje na jeziku korisnika: `microbe` (bakterije, virusi, plijesni), `allergen` (alergen koji nije naveden), `foreign` (strano tijelo), `chemical`, `toxin`, `label` (greška na deklaraciji), `other` (bez oznake). |
| `name` | da | Proizvod, kako ga obavijest zove (do 160 znakova). |
| `reason` | da | Sama stvar, riječima obavijesti: „komadići stakla”, „Listeria monocytogenes” (do 160). Aplikacija ispred stavi vrstu: „Strano tijelo: komadići stakla”. |
| `source` | da | Ko je objavio (do 120). |
| `url` | da | Adresa službene obavijesti. **Samo `https://`.** |
| `brand`, `details`, `lots`, `bestBefore`, `action` | ne | Marka; objašnjenje (do 800); serije; rok; šta uraditi (do 500). Prepiši kako piše u obavijesti. |
| `gtins` | ne | Barkodovi proizvoda (8, 12, 13 ili 14 cifara). Sa barkodom aplikacija upozori i pri skeniranju. **Upiši ga samo ako je u obavijesti** — ne pogađaj. Ne upisuj broj koji počinje s 2, 02 ili 04 (roba na vagu): nije jedinstven. |

Pravila koja posao sam provjerava (i **ne objavljuje ništa** dok greška nije ispravljena):
pogrešan datum, nepoznata vrijednost, adresa koja nije https, barkod s pogrešnom kontrolnom
cifrom, isti id dvaput, nepoznato polje (npr. `lot` umjesto `lots`), predug tekst, zemlja koja
ne odgovara fajlu. Greška se vidi u Actions → zadnje pokretanje, s imenom fajla i rednim brojem
obavijesti. Dok se ne ispravi, korisnici vide zadnji ispravan fajl.

Ručno unesena obavijest ostaje u aplikaciji 180 dana od objave (`config.json`,
`curatedWindowDays`). Da je ukloniš ranije, obriši je iz fajla.

Fajl čije ime počinje s `_` (npr. `curated/_nacrt.json`) se ne čita — zgodno za nacrte.

**Ako mijenjaš iz Terminala, a ne na GitHubu:** posao poslije svakog pokretanja sam upiše
objavljeni fajl u repozitorij (`public/v1/recalls.json`, `state/last-run.json`), pa je tvoja kopija
iza. Prije slanja povuci te izmjene:

```
cd ~/lupa-recalls
git add .
git commit -m "šta je promijenjeno"
git pull --rebase origin main
git push
```

### Gdje gledati (službene objave koje posao ne čita sam)

- Srbija — jedinstvena službena lista nije pronađena. Unosi samo iz saopštenja nadležnog tijela
  (Ministarstvo zdravlja, Ministarstvo poljoprivrede – Uprava za veterinu), s linkom na to saopštenje;
  vijest iz medija nije izvor.
- Italija, Španija i ostale članice EU bez vlastitog adaptera — čitaju se preko EU RASFF portala
  (poglavlje 3); ručno se unosi samo ono što tamo nema (npr. serija ili barkod iz službene objave
  ministarstva, kao posebna obavijest s linkom na nju).
- EU, neprehrambeni proizvodi (kozmetika) — Safety Gate: https://ec.europa.eu/safety-gate-alerts/

## 3. Izvori koje posao čita sam

| Izvor (`config.json`) | Zemlja | Šta čita | Prozor | 26. 11. 2026. |
|---|---|---|---|---|
| RappelConso (`rappelconso`) | Francuska | otvoreni podaci DGCCRF (JSON) | 45 dana | 281 |
| lebensmittelwarnung.de (`lebensmittelwarnung`) | Njemačka | RSS za hranu i za kozmetiku + stranica svake nove obavijesti | 45 dana | 41 |
| AGES (`ages`) | Austrija | lista „Produktwarnungen & Produktrückrufe”, kategorije hrana, dječja hrana, suplementi, kozmetika | 60 dana | 10 |
| GOV.SI „Nevarni in neskladni izdelki” (`govsi`) | Slovenija | službeni JSON izvoz liste | 180 dana | 103 |
| HAPIH „Obavijesti za potrošače” (`hapih`) | Hrvatska | RSS kategorije + stranica svake nove obavijesti (tekst Državnog inspektorata) | 180 dana | 36 |
| Agencija za sigurnost hrane BiH (`fsaba`) | BiH | WordPress API, kategorija „Povlačenje i opoziv hrane” | 180 dana | 1 |
| Fødevarestyrelsen „Tilbagekaldte produkter” (`fvst`) | Danska | RSS liste + stranica svake nove obavijesti | 60 dana | 19 (27. 11.) |
| Potraviny na pranýři (`pranyr`) | Češka | lista „Nebezpečné potraviny” (SZPI, SVS) + stranica svake nove | 45 dana | 53 (27. 11.) |
| EFET „Ανακλήσεις” (`efet`) | Grčka | RSS i lista kategorije + stranica svakog novog saopćenja | 90 dana | 6 (27. 11.) |
| FAVV/AFSCA „Terugroepingen” (`favv`) | Belgija | lista (10 po stranici) + stranica svakog novog opoziva | 30 dana | 19 (27. 11.) |
| FSAI „All Alerts” (`fsai`) | Irska | lista food i allergen alerts + stranica svakog novog upozorenja | 45 dana | 15 (27. 11.) |
| GIS „Ostrzeżenia” (`gis`) | Poljska | lista (10 po stranici) + stranica svakog novog upozorenja o hrani | 60 dana | 12 (27. 11.) |
| Nébih „Termékvisszahívás” (`nebih`) | Mađarska | lista (50) + stranica svakog novog opoziva | 45 dana | 11 (27. 11.) |
| Ruokavirasto „Takaisinvedot” (`ruokavirasto`) | Finska | lista + stranica svakog novog opoziva | 60 dana | 8 (27. 11.) |
| NVWA „Veiligheidswaarschuwingen” (`nvwa`) | Holandija | pretraga sajta („veiligheidswaarschuwing”, najnovije prvo) + news sitemap i 3 najnovija upozorenja + stranica svakog novog | 45 dana | 22 (27. 11.) |
| U.S. FDA Enforcement Report (`fda`) — samo v2 | SAD | openFDA API (`api.fda.gov/food/enforcement.json`), hrana i dodaci prehrani | 45 dana | 62 (27. 11.) |
| EU RASFF Consumers' Portal (`rasff`) | 13 zemalja EU (vidi niže) | lista po zemlji (RSS) + javni JSON svake notifikacije | 30 dana | 87 (27. 11.) |

Prozor od 180 dana za Sloveniju, Hrvatsku i BiH je isti kao za ručno unesene obavijesti: ti izvori
objavljuju malo, pa bi kraći prozor ostavio zemlju praznom.

**SAD (FDA).** Zvanični sedmični „Enforcement Report” FDA za hranu i dodatke prehrani, preko openFDA:
zapis po proizvodu, a obavijest po opozivu (`event_id` — jedan opoziv od 50 proizvoda je jedna
obavijest s nazivima, barkodovima i serijama svih). Barkod samo uz „UPC” (i kad je pisan u grupama,
„0 11152 64246 8”), serija i rok samo iz polja „code_info” kad su označeni („Lot”, „Best By”, „Exp”).
Datum je sedmica izvještaja. Link vodi na FDA zapis tog opoziva (openFDA). Meso, perad i jaja su
USDA (FSIS), čiji servis ne odgovara GitHubovim serverima. Obavijesti iz SAD idu **samo u v2**
(aplikacija koja čita v1 ne prihvata zemlju US). Izvor se isključuje u `config.json`
(`"enabled": false`); izvor koji `config.json` ne navodi se ne čita.

Svaki adapter je napisan **prema stvarnim odgovorima** tih servisa (26. i 27. 11. 2026, snimljeni na
GitHub Actions) i testiran na njima (`test/fixtures/live/`, `test/sources.test.js`,
`test/sources-europe.test.js`, `test/sources-europe-2.test.js`). Kad izvor
promijeni oblik, adapter **ne pogađa**: stane s porukom šta je vidio, fajl se objavi s obavijestima tog
izvora od prošlog puta, a nakon 3 dana šutnje pokretanje „padne” i stigne e-mail (poglavlje 4).

**Šta se uzima, a šta ne — isto pravilo za sve izvore:**
- naziv, datum, razlog, link — iz polja izvora; gdje izvor ima polja za seriju, rok, preporuku,
  objašnjenje (Njemačka, Austrija), objavljuju se kako pišu;
- iz slobodnog teksta (Hrvatska, Slovenija, BiH, Danska, Grčka, Belgija, Irska, Poljska, Mađarska,
  Finska, Holandija) **serija, rok i barkod uzimaju se samo kad ih tekst označi** („lot L233249A2”, „rok uporabe: 27.11.2026”, „EAN 3831115348162”, „bar koda …”,
  „GTIN broja …”), i to cijeli: ništa se ne sastavlja iz dijelova, broj u sredini rečenice nije
  barkod, barkod mora imati ispravnu kontrolnu cifru, a broj koji dodjeljuje prodavnica (počinje s 2,
  02, 04) se nikad ne objavljuje (`lib/text.js`, testovi u `test/text.test.js`). Kad nije sigurno,
  polje ostaje prazno — sve je u službenoj obavijesti, jedan dodir dalje;
- razlog: riječi same obavijesti („zbog utvrđene prisutnosti kikirikija …”, „Prisotnost bakterije
  Listeria monocytogenes”); vrsta opasnosti (`hazard`) samo kad je riječi jasno imenuju, inače
  `other`.

**Šta se izostavlja (i broji u Summary):** sve osim hrane, hrane za bebe, suplemenata i kozmetike
(igračke, posuđe i materijali u dodiru s hranom, hrana za životinje, električni uređaji …); u
Sloveniji obavijesti za robu koja nije stigla do potrošača (zadržana na granici, nije puštena u
promet, prodavana samo restoranima); u BiH objave koje nisu povlačenje (zabrana uvoza, odbijanje na
granici, pojačane kontrole).

**Danska, Češka, Grčka.** Danska: stranica obavijesti uvijek ima iste naslove („Hvilken fødevare
tilbagekaldes”, „Hvorfor …”, „Hvad skal du gøre …”); naziv je proizvod kad je naveden jedan, a kad ih
je više, naslov obavijesti, a proizvodi s rokovima idu u „details”. Češka: samo kategorija
„Nebezpečné potraviny” (ne „nejakostní” ni „falšované”), i samo ono što je nađeno u prodaji —
restorani, menze, brza hrana i gotova jela se izostavljaju (ne mogu se kupiti ni skenirati); serija
je polje „Šarže”. Grčka: saopćenje je tekst, pa se serija („παρτίδα”, „Lot”) i rok („ημερομηνία
ανάλωσης”) uzimaju samo označeni; datum zamrzavanja nije rok; posuđe se izostavlja.

**Belgija, Irska, Poljska, Mađarska, Finska, Holandija.** Belgija: opis proizvoda je niz „Oznaka:
vrijednost” („Naam van het product”, „Merk”, „THT”, „Lotnummer”, „EAN”), a spisak prodavnica se ne
prenosi; raspon roka („vanaf 07-12-26 tot 13-12-26”) ostaje raspon („07-12-26 – 13-12-26”).
Irska: food i allergen alerts s iste liste; tabela proizvoda se čita kao „Kolona: vrijednost”, pa se i
iz nje uzimaju samo označene serije i rokovi; „Batch Code: Use by date …” nije serija. Poljska: samo
upozorenja „dotyczące żywności” (posuđe „wyrób do kontaktu z żywnością” se izostavlja), ažuriranja
ostaju kao zasebne obavijesti. Mađarska: lista ne daje ni datum ni naziv, pa se čita stranica svakog
novog opoziva, od najnovijeg dok dva kruga zaredom nisu starija od prozora; hrana za kućne ljubimce
(„ne adják kedvencüknek”) i posuđe se izostavljaju; opoziv s „RASFF referencia szám” dobije `group`
te notifikacije. Finska: proizvod je ono što stranica navede kao proizvod (spisak proizvoda,
„… -tuotetta”, „nimellä …”), inače naslov; posuđe se izostavlja. Holandija: listu upozorenja
NVWA sajt crta u pregledniku iz svoje pretrage (RSS odgovara „feeds offline”), pa posao pita pretragu
isto što pita preglednik („veiligheidswaarschuwing”, najnovije prvo, 50 po stranici, uz SHA-256
zahtjeva kao „hash”, kao i sam sajt); uz to čita news sitemap (sve vijesti zadnja 2 dana) i 3
najnovija upozorenja. Ako pretraga ne odgovori, kratke liste i dalje vide svako novo upozorenje
(posao radi svaki dan), a jednom pročitano ostaje dok je u prozoru. Samo upozorenja „over
levensmiddelen en diervoeders” (ne „consumentenartikelen”); hrana za životinje se izostavlja.

**EU RASFF — za zemlje koje posao (još) ne čita kod njihove agencije.** Portal Evropske komisije za
potrošače vodi, za svaku zemlju, listu RASFF notifikacija o hrani na njenom tržištu. Posao je čita
za zemlje navedene u `config.json` → `rasff.countries`: BG, CY, EE, ES, IT, LT, LU, LV, MT, PT, RO,
SE, SK — tj. sve članice EU osim onih koje se čitaju kod vlastite agencije (FR, DE, AT, SI, HR, DK,
CZ, GR, BE, IE, PL, HU, FI, NL). Italija, Portugal, Rumunija, Bugarska, Litvanija, Kipar i Malta
inače nisu dostupni (servis ne odgovara izvan zemlje ili blokira); za ostale je ovo privremeno, dok
se ne napiše adapter njihove agencije — tada se zemlja briše s ove liste (test ne dozvoljava da se
ista zemlja čita dvaput). Obavijest iz RASFF-a ima naziv proizvoda kako ga notifikacija navodi,
razlog (naslov notifikacije, na engleskom), nalaz i mjere poduzete u toj zemlji; **serije, rokovi i
barkodovi se tamo ne objavljuju**, pa ih ni ovdje nema. Link vodi na notifikaciju u RASFF Window.
Hrana za životinje i materijali u dodiru s hranom se izostavljaju.

**Povučene obavijesti (Hrvatska).** Kad Državni inspektorat povuče raniju obavijest („Opoziv
obavijesti objavljene 19.06.2026.: …”), proizvod ipak nije opozvan: ne objavljuje se ni ta objava ni
obavijest koju ona povlači.

**Koliko se pita.** Slovenija i BiH: jedan zahtjev. Austrija: lista i 4 kategorije (stranica po
stranica dok prozor ne prođe). Njemačka i Hrvatska: feed, pa stranica **samo za novu ili
promijenjenu obavijest** (ono što je već jednom pročitano cijelo uzima se iz prethodnog fajla) — dva
zahtjeva istovremeno, nikad više. Stranica koja se ne može pročitati: obavijest se objavi s onim što
daje feed, a stranica se traži ponovo sljedećeg dana.

Za pregled živih podataka bilo kojeg izvora: `node tools/probe.js <izvor>` (npr. `hapih`) — ispiše
koliko bi obavijesti bilo objavljeno, zašto su ostale izostavljene i tri primjera.

**Šta nije automatski i zašto:**
- **EU Safety Gate** (kozmetika): pojedinačna obavijest se može pročitati
  (`/safety-gate-alerts/public/api/notification/{id}`), ali lista po kategoriji ne — pretraga
  odgovara „405”, a lista „najnovijih” nije potpuna. Bez pouzdane liste se ne objavljuje ništa.
- **Italija, Portugal, Rumunija, Bugarska, Litvanija, Kipar, Malta:** stranice agencija ne odgovaraju
  serverima GitHuba (ili blokiraju) — pokriveni su preko EU RASFF portala (gore).
- **Švedska:** Livsmedelsverketova lista i RSS „Återkallanden” su 27. 11. 2026. prazni — adapter se
  piše kad se pojavi prva stvarna obavijest; do tada RASFF.
- **Zemlje izvan EU** (UK, Norveška, Švicarska, Island, Srbija, Crna Gora, Sjeverna Makedonija,
  Moldavija, Ukrajina …): aplikacija trenutno prihvata samo zemlje EU, BA i RS
  (`lib/contract.js` i `lib/recalls.ts` u aplikaciji). Adapteri za njih idu kad aplikacija prihvati
  te kodove.

**Napomena o RappelConso.** Adapter je pisan bez pristupa živim podacima, a zatim usklađen s
onim što je registar stvarno dao 26. 11. 2026 (19 336 redova):
- obavezne kolone su prepoznate; kad jednom ne budu, adapter **ne pogađa** — stane s porukom u
  kojoj su kolone koje je vidio, fajl se objavi bez tog izvora;
- registar sav tekst daje malim slovima → adapter stavlja veliko početno slovo (naziv, razlog,
  objašnjenje, svaka rečenica u „šta uraditi”) i piše marku s velikim početnim slovima;
  tekst koji već ima velika slova ne dira;
- „sans marque” (bez marke) → obavijest nema marku;
- **barkod**: registar nema kolonu s barkodom. Uzima se samo iz polja `identification_produits`
  (unosi oblika `$…$…$…$`), i samo kad je **cijeli dio** između dva `$` ispravan barkod od 12, 13
  ili 14 cifara. Ništa se ne sastavlja iz dijelova, a dio od 8 cifara se ne uzima (tako izgleda i
  serija pisana kao datum). Koliko obavijesti ima barkod piše u Summary („s barkodom: N”).

- **brojevi koje prodavnice dodjeljuju same** (počinju s 2, 02 ili 04 — roba na vagu: sir, meso,
  pekara) se ne objavljuju kao barkod: isti broj je u drugoj prodavnici drugi proizvod, pa bi
  aplikacija pri skeniranju upozorila na pogrešan. U registru ih je 26. 11. 2026. bilo 30 od 233.
  Isto važi za ručni unos: takav barkod zaustavlja objavu s porukom — izostavi ga.

Za pregled živih podataka: `node tools/probe.js rappelconso` (ispiše kolone, primjere polja s
identifikacijom i koliko redova ima barkod).

Iz registra se uzimaju samo hrana, hrana za bebe, dodaci prehrani i kozmetika, zadnjih 45 dana.
Serije i rokovi se **ne** čitaju iz registra (polje u kojem su nije provjereno, a pogrešno
pročitana serija je gora od nikakve) — nalaze se u službenoj obavijesti, jedan dodir dalje.

Podaci RappelConso: DGCCRF, „Licence Ouverte / Open Licence 2.0” — izvor se navodi uz svaku
obavijest (aplikacija ispisuje „RappelConso” i vodi na samu obavijest). Isto vrijedi za ostale
izvore: uz svaku obavijest piše ko ju je objavio i link vodi na njegovu službenu obavijest.

## 4. Šta se dešava kad nešto pođe po zlu

| Situacija | Šta posao uradi | Šta vidi korisnik |
|---|---|---|
| Greška u ručno unesenoj obavijesti | Ništa ne objavi; pokretanje „palo”, GitHub pošalje e-mail | Zadnji ispravan fajl |
| Izvor se ne može pročitati (jedan dan) | Objavi fajl s obavijestima tog izvora od jučer; upozorenje u Summary | Ništa se ne mijenja |
| Izvor šuti 3 dana zaredom | Fajl se objavi, a pokretanje se na kraju označi kao „palo” (e-mail) | Ništa se ne mijenja |
| Lista bi se odjednom prepolovila | Ništa ne objavi (izgleda kao greška). Ako je namjerno: `node lib/build.js --force` | Zadnji ispravan fajl |
| Posao se ne pokreće danima | — | Nakon 3 dana aplikacija na listi ispiše „Podaci nisu osvježeni od …” |

Svaka objavljena verzija fajla ostaje u historiji repozitorija (`public/v1/recalls.json`), pa se
uvijek može vidjeti šta su korisnici dobili kojeg dana.

## 5. Provjera na računaru (nije obavezno)

Treba samo Node.js 20 ili noviji; nema ničega za instalirati.

```
npm test                 # svi testovi
npm run check            # provjeri ručno unesene obavijesti, ništa ne upisuje
node lib/build.js        # pročitaj izvore i napravi fajl (kao GitHub)
node tools/probe.js rappelconso     # ili: lebensmittelwarnung, ages, govsi, hapih, fsaba
```

## 6. Format fajla (v1 i v2)

Opisan u `lib/contract.js`. Provjere u ovom repozitoriju su **iste** one koje aplikacija radi kad
čita fajl (aplikacija: `lib/recalls.ts`); obje strane se testiraju na istim primjerima
(`test/fixtures/contract-cases.json`).

Posao objavljuje dva oblika istih obavijesti:
- **v2 — fajl po zemlji** (`v2/index.json` i `v2/fr.json`, `v2/us.json` …): indeks kaže koje zemlje
  imaju fajl, koliko obavijesti i znakova ima svaki i datum najnovije; fajl zemlje ima samo
  obavijesti te zemlje (`"country"` mora biti ista kao zemlja fajla). Zemlje: one iz v1, **US** i
  Evropa izvan EU — GB, CH, NO, IS, MK, MD, UA, ME, AL (`COUNTRIES_V2`; zemlja bez izvora nema fajl).
  Svaki fajl ima svoje granice (800 obavijesti, 500 000 znakova), pa mnogo obavijesti jedne zemlje
  nikad ne istiskuje drugu. `group` povezuje obavijesti i preko fajlova. Zemlja koja više nema
  nijednu obavijest nema ni fajl ni red u indeksu.
- **v1 — jedan fajl** (`v1/recalls.json`) za verzije aplikacije koje čitaju samo njega: iste
  obavijesti, samo zemlje v1 (EU, BA, RS), najviše 800 obavijesti i 500 000 znakova (aplikacija
  prihvata do 1000 i 600 000). Kad ih ima više, obavijest gubi **zemlja s najviše obavijesti** — svoju
  najstariju iz automatskog izvora; ručno unesene ostaju. U v2 ostaju sve.

Obavijest je u oba oblika ista. Format se ne mijenja unutar verzije: nova polja koja aplikacija ne
poznaje ona preskoči.

**Isti proizvod u više zemalja — polje `group` (neobavezno).** Svaka zemlja zadržava svoju obavijest
(svoju zemlju, link i tekst), a obavijesti koje su **sigurno** isti proizvod dobiju isto `group`, da
ih aplikacija može prikazati kao jednu karticu sa spiskom zemalja i linkom za svaku:
- ista RASFF notifikacija na listama više zemalja, ili opoziv agencije koji navodi tu notifikaciju
  (Mađarska: „RASFF referencia szám: 2026.10359”) → `"rasff-2026-10406"`;
- isti barkod proizvođača u dvije ili više obavijesti (iz bilo kojih izvora, i ručno unesenih) →
  `"gtin-3850123456782"`.

**Po nazivu se nikad ne spaja** — slični nazivi mogu biti drugi proizvod, druga serija ili drugi
problem, a pogrešna veza je gora od nikakve. `group` se upisuje samo kad povezuje bar dvije
obavijesti u fajlu; računa ga posao pri svakoj izgradnji (`withGroups` u `lib/build.js`), ručno se ne
unosi. Aplikacija koja polje ne poznaje ga preskoči (kao i svako nepoznato polje), pa je to i dalje
format `v1`.

## 7. Šta ovaj fajl nije

Lista ne mora biti potpuna i ne zamjenjuje službene objave. Barkod označava proizvod, ne seriju:
aplikacija zato nikad ne kaže da je baš to pakovanje povučeno, nego upućuje na seriju i rok u
obavijesti. Proizvod kojeg nema na listi nije zbog toga nužno siguran.
