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

/** kind → words that name it (French, English, German, Italian, Spanish; folded). Order matters: the first kind found wins. */
const HAZARD_WORDS = [
  ['allergen', ['allergene', 'allergen', 'alergeno', 'non declare', 'undeclared', 'nicht deklariert', 'non dichiarat', 'gluten', 'arachide', 'sulfites']],
  ['foreign', ['corps etranger', 'corps etrangers', 'foreign bod', 'foreign object', 'fremdkorper', 'corpo estraneo', 'cuerpo extrano', 'morceaux de verre', 'debris de verre', 'bris de verre', 'fragments de', 'particules de', 'metal pieces', 'glass', 'plastic pieces', 'presence de verre', 'presence de plastique', 'presence de metal']],
  ['toxin', ['toxine', 'toxin', 'aflatoxin', 'ochratoxin', 'patulin', 'histamin', 'cereulide', 'alcaloide', 'alkaloid', 'mycotoxin', 'biotoxin', 'tossina', 'deoxynivalenol', 'zearalenone', 'ergot']],
  ['microbe', ['listeria', 'salmonell', 'escherichia', 'e. coli', 'e.coli', 'stec', 'norovirus', 'hepatite', 'hepatitis', 'bacillus', 'clostridium', 'botulism', 'botulique', 'campylobacter', 'cronobacter', 'staphylocoque', 'staphylococc', 'microbiolog', 'moisissure', 'mould', 'schimmel', 'bacteri', 'bakteri', 'virus', 'levures', 'germes']],
  ['chemical', ['pesticide', 'oxyde d\'ethylene', 'ethylene oxide', 'ethylenoxid', 'residu', 'residue', 'ruckstand', 'metaux lourds', 'heavy metal', 'plomb', 'cadmium', 'mercure', 'arsenic', 'hydrocarbure', 'mosh', 'moah', 'migration', 'dioxine', 'pcb', 'substance interdite', 'substance non autorisee', 'additif non autorise', 'colorant non autorise', 'chlorate', 'nitrosamine', 'bisphenol', 'phtalate', 'depassement de la limite', 'depassement des limites', 'lmr', 'contaminant chimique', 'chimique']],
  ['label', ['etiquetage', 'etiquette', 'labelling', 'labeling', 'kennzeichnung', 'etichettatura', 'date limite de consommation erronee', 'dlc erronee', 'ddm erronee', 'erreur de date', 'date de peremption erronee', 'mauvaise date']],
];

/**
 * The kind of hazard the texts name — or "other". The texts are asked in the order given (the
 * reason first, then what else the source says): the first one that clearly names a kind decides.
 * A source's list of possible consequences ("Allergies", "Blessures") is therefore only asked when
 * the reason itself names no kind.
 */
function hazardOf(...texts) {
  for (const text of texts) {
    const folded = fold(text);
    if (folded.trim() === '') continue;
    for (const [kind, words] of HAZARD_WORDS) {
      if (words.some((w) => folded.includes(w))) return kind;
    }
  }
  return 'other';
}

module.exports = { fold, hazardOf };
