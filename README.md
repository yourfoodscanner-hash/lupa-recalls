# lupa-recalls — povučeni proizvodi za aplikaciju LUPA

Ovaj repozitorij pravi **jedan fajl** koji aplikacija LUPA čita:

```
https://yourfoodscanner-hash.github.io/lupa-recalls/v1/recalls.json
```

U fajlu su službene obavijesti o povlačenju proizvoda (hrana, hrana za bebe, suplementi,
kozmetika) iz EU, BiH, Hrvatske, Srbije i Slovenije. Svaka obavijest ima izvor i link na
službenu obavijest. Aplikacija sama ne čita ničije stranice — čita samo ovaj fajl.

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

## 2. Kako dodati obavijest ručno (BiH, Hrvatska, Srbija, Slovenija …)

Obavijesti iz regije unose se ručno, iz službene objave nadležnog tijela. Najlakše direktno na
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
| `gtins` | ne | Barkodovi proizvoda (8, 12, 13 ili 14 cifara). Sa barkodom aplikacija upozori i pri skeniranju. **Upiši ga samo ako je u obavijesti** — ne pogađaj. |

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

### Gdje gledati (službene objave)

- BiH — Agencija za sigurnost hrane BiH: https://www.fsa.gov.ba/
- Hrvatska — Državni inspektorat, „Obavijesti za potrošače”: https://dirh.gov.hr/
- Slovenija — „Umiki in odpoklici živil” (https://www.gov.si/teme/umiki-in-odpoklici-zivil/); od 2024. se
  obavijesti objavljuju na listi „Nevarni in neskladni izdelki”
  (https://www.gov.si/podrocja/podjetnistvo-in-gospodarstvo/varstvo-potrosnikov-in-konkurence/nevarni-in-neskladni-izdelki/).
- Srbija — jedinstvena službena lista nije pronađena. Unosi samo iz saopštenja nadležnog tijela
  (Ministarstvo zdravlja, Ministarstvo poljoprivrede – Uprava za veterinu), s linkom na to saopštenje;
  vijest iz medija nije izvor.
- EU, neprehrambeni proizvodi (kozmetika) — Safety Gate: https://ec.europa.eu/safety-gate-alerts/

## 3. Izvori koje posao čita sam

| Izvor | Zemlja | Stanje |
|---|---|---|
| RappelConso (`sources/rappelconso.js`) | Francuska | Radi (26. 11. 2026: 19 336 redova → 281 obavijest, 45 dana). Vidi napomenu ispod. |

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

Za pregled živih podataka: `node tools/probe.js rappelconso` (ispiše kolone, primjere polja s
identifikacijom i koliko redova ima barkod).

Iz registra se uzimaju samo hrana, hrana za bebe, dodaci prehrani i kozmetika, zadnjih 45 dana.
Serije i rokovi se **ne** čitaju iz registra (polje u kojem su nije provjereno, a pogrešno
pročitana serija je gora od nikakve) — nalaze se u službenoj obavijesti, jedan dodir dalje.

Izvor se isključuje u `config.json`: `"enabled": false`.

Podaci RappelConso: DGCCRF, „Licence Ouverte / Open Licence 2.0” — izvor se navodi uz svaku
obavijest (aplikacija ispisuje „RappelConso” i vodi na samu obavijest).

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
node tools/probe.js rappelconso
```

## 6. Format fajla (v1)

Opisan u `lib/contract.js`. Provjere u ovom repozitoriju su **iste** one koje aplikacija radi kad
čita fajl (aplikacija: `lib/recalls.ts`); obje strane se testiraju na istim primjerima
(`test/fixtures/contract-cases.json`). Format se ne mijenja unutar `v1`: aplikacija koja bi
čitala drugačiji format tražila bi `v2/recalls.json`.

Granice: najviše 800 obavijesti i 500 000 znakova (aplikacija prihvata do 1000 i 600 000).
Kad ih ima više, izostavljaju se najstarije iz automatskih izvora; ručno unesene ostaju.

## 7. Šta ovaj fajl nije

Lista ne mora biti potpuna i ne zamjenjuje službene objave. Barkod označava proizvod, ne seriju:
aplikacija zato nikad ne kaže da je baš to pakovanje povučeno, nego upućuje na seriju i rok u
obavijesti. Proizvod kojeg nema na listi nije zbog toga nužno siguran.
