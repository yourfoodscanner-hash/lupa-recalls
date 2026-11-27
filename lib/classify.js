'use strict';
/**
 * From a source's own words to the app's fixed kinds — for the sources that are read by the job.
 * (A hand-written notice names its kind itself.)
 *
 * The kind only chooses the short label the app puts in front of the reason, in the user's
 * language ("Strano tijelo: …"). When the words do not clearly say one kind, the answer is
 * "other": the app then shows the notice's own words alone. A wrong label is worse than none.
 */

/** Lower case, without accents: "Présence d'allergènes" → "presence d'allergenes". */
function fold(text) {
  return String(text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * kind → words that name it (French, English, German, Italian, Spanish, Croatian/Bosnian/Serbian,
 * Slovenian, Danish, Swedish, Czech, Greek; folded). Order matters: the first kind found wins. Short stems are avoided where they are
 * also ordinary words ("blei" is in "bleibt", "glas" in "im Glas").
 */
const HAZARD_WORDS = [
  ['allergen', ['allergene', 'allergen', 'alergeno', 'alergen', 'non declare', 'undeclared', 'nicht deklariert', 'nicht gekennzeichnet', 'non dichiarat', 'gluten', 'arachide', 'sulfites', 'nedeklari', 'neoznacen', 'ne oznacen',
    'ikke deklareret', 'ikke angivet', 'odeklarerad', 'ej deklarerad', 'inte deklarerad', 'nedeklarovan', 'neuveden', 'αλλεργιογον', 'αλλεργιον', 'μη δηλωμεν']],
  ['foreign', ['corps etranger', 'corps etrangers', 'foreign bod', 'foreign object', 'fremdkorper', 'corpo estraneo', 'cuerpo extrano', 'morceaux de verre', 'debris de verre', 'bris de verre', 'fragments de', 'particules de', 'metal pieces', 'glass', 'plastic pieces', 'presence de verre', 'presence de plastique', 'presence de metal',
    'glassplitter', 'glasscherben', 'metallfragment', 'kunststofffragment', 'glasfragment', 'glasstuck', 'glasteil', 'metallteil', 'metallstuck', 'metallsplitter', 'kunststoffteil', 'kunststoffstuck', 'plastikteil',
    'strano tijel', 'stranog tijel', 'strana tijel', 'stranih tijel', 'strano telo', 'stranog tela', 'komadic', 'komadi stakla', 'cestice stakla', 'cesticama stakla', 'cestica stakla', 'komadi plastike', 'komadi metala', 'dijelovi plastike', 'dijelovi metala', 'dijelova metala', 'metalnog porijekla', 'tujk', 'delci stekla', 'delci plastike', 'kovinski delci', 'kovinskih delcev', 'fizikalno tveganje',
    'fremmedlegem', 'glasskar', 'glasstykk', 'metalstykk', 'metalspan', 'plaststykk', 'frammande foremal', 'frammande foremal', 'glasbit', 'metallbit', 'plastbit', 'cizi teles', 'cizich teles', 'kousky skla', 'ulomky skla', 'ξενο σωμα', 'ξενα σωματα', 'ξενων σωματων', 'θραυσμ', 'σκουληκ', 'insekt', 'insect']],
  ['toxin', ['toxine', 'toxin', 'aflatoxin', 'ochratoxin', 'patulin', 'histamin', 'cereulide', 'cereulid', 'alcaloide', 'alkaloid', 'mycotoxin', 'biotoxin', 'tossina', 'deoxynivalenol', 'zearalenone', 'ergot',
    'toksin', 'aflatoksin', 'okratoksin', 'ohratoksin', 'mikotoksin', 'fumonizin', 'fumonisin', 'atropin', 'skopolamin', 'scopolamin', 'tropan', 'pirolizidin', 'pyrrolizidin', 'blausaure', 'cijanovodon', 'cianovodik', 'amigdalin',
    'mykotoks', 'mykotox', 'hydrocyan', 'τοξιν', 'μυκοτοξ', 'αφλατοξ']],
  ['microbe', ['listeria', 'salmonell', 'escherichia', 'e. coli', 'e.coli', 'stec', 'norovirus', 'hepatite', 'hepatitis', 'bacillus', 'clostridium', 'botulism', 'botulique', 'campylobacter', 'cronobacter', 'staphylocoque', 'staphylococc', 'microbiolog', 'moisissure', 'mould', 'schimmel', 'bacteri', 'bakteri', 'virus', 'levures', 'germes',
    'listeri', 'listera', 'salmonel', 'norovir', 'noravir', 'krankheitserreger', 'enterobacter', 'pseudomonas', 'burkholderia', 'mikrobiol', 'plijesn', 'plijesan', 'plesn', 'plesen', 'plesni', 'kvasac', 'kvasovk', 'vtec',
    'skimmel', 'mogel', 'plisn', 'σαλμονελ', 'λιστερ', 'βακτηρ', 'μουχλ', 'ευρωτ']],
  ['chemical', ['pesticide', 'oxyde d\'ethylene', 'ethylene oxide', 'ethylenoxid', 'residu', 'residue', 'ruckstand', 'metaux lourds', 'heavy metal', 'plomb', 'cadmium', 'mercure', 'arsenic', 'hydrocarbure', 'mosh', 'moah', 'migration', 'dioxine', 'pcb', 'substance interdite', 'substance non autorisee', 'additif non autorise', 'colorant non autorise', 'chlorate', 'nitrosamine', 'bisphenol', 'phtalate', 'depassement de la limite', 'depassement des limites', 'lmr', 'contaminant chimique', 'chimique',
    'pesticid', 'pestizid', 'etilen oksid', 'etilen-oksid', 'etilenoksid', 'kontaminant', 'gesundheitsschadliche substanz', 'migracij', 'teski metal', 'teskih metal', 'kadmij', 'olova', 'akrilamid', 'acrylamid', 'klorat', 'hlorat', 'dioksin', 'glicidil', 'glycidyl', 'kemicn', 'kemijsk', 'hemijsk', 'nedozvoljen', 'nedovoljen', 'neodobren', 'mineralol', 'pfas', 'zveplov', 'sulfit', 'acetamiprid', 'chlorpyrifos', 'klorpirifos', 'imidacloprid',
    'kadmium', 'bekampelsesmiddel', 'bekampningsmedel', 'rezidu', 'φυτοφαρμακ', 'υπολειμμα', 'αιθυλενοξειδ']],
  ['label', ['etiquetage', 'etiquette', 'labelling', 'labeling', 'kennzeichnung', 'etichettatura', 'date limite de consommation erronee', 'dlc erronee', 'ddm erronee', 'erreur de date', 'date de peremption erronee', 'mauvaise date',
    'irrefuhrung', 'deklaracij', 'oznacavanj', 'oznacevanj', 'oznacb',
    'mærkning', 'maerkning', 'markning', 'επισημανσ']],
];

/**
 * The kind of hazard the texts name — or "other". The texts are asked in the order given (the
 * reason first, then what else the source says): the first one that clearly names a kind decides.
 * A source's list of possible consequences ("Allergies", "Blessures") is therefore only asked when
 * the reason itself names no kind.
 */
/** Names of a microbe that contain a word of another kind ("shiga-toxin" is E. coli, not a toxin in food). */
const MICROBE_FIRST = ['shiga-toxin', 'shigatoxin', 'shiga toxin', 'shiga-toksin', 'shigatoksin'];

function hazardOf(...texts) {
  for (const text of texts) {
    const folded = fold(text);
    if (folded.trim() === '') continue;
    if (MICROBE_FIRST.some((w) => folded.includes(w))) return 'microbe';
    for (const [kind, words] of HAZARD_WORDS) {
      if (words.some((w) => folded.includes(w))) return kind;
    }
  }
  return 'other';
}

/**
 * The first sentence of a text that names a kind of hazard (at most 160 characters) — for a notice
 * that says why only in passing ("… novih pragova za cereulid u formulama za dojenčad."). null if none does.
 */
const LEGAL = /^(?:shodno|sukladno|u skladu s|prema [cč]lan|gem[aä][sß])|zakon[a-z]* o |slu[zž]beni glasnik|narodne novine|uredb[a-z]* \(|uredb[a-z]* (?:komisije|br\.)|pravilnik[a-z]* o|verordnung \(/i;
function sentenceNaming(text) {
  const sentences = String(text ?? '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[\p{Lu}„"“])/u);
  for (const s of sentences) {
    const clean = s.trim().replace(/[.!?]+$/, '');
    if (LEGAL.test(clean)) continue;                       // a sentence that only cites the law
    if (clean.length >= 6 && hazardOf(clean) !== 'other') return clean.length <= 160 ? clean : `${clean.slice(0, 159).replace(/\s+\S*$/, '')}…`;
  }
  return null;
}

module.exports = { fold, hazardOf, sentenceNaming };
