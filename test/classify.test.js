'use strict';
/** From a source's words to the app's kinds of hazard: only when the words clearly say it — otherwise "other". */
const test = require('node:test');
const assert = require('node:assert/strict');
const { hazardOf, fold } = require('../lib/classify');

test('the words name the kind', () => {
  const cases = [
    ['Présence de Listeria monocytogenes', 'microbe'], ['Présence de salmonelles', 'microbe'], ['Escherichia coli STEC', 'microbe'], ['Norovirus', 'microbe'],
    ['Présence de moisissures', 'microbe'], ['Salmonella spp.', 'microbe'], ['Verdacht auf Bakterien', 'microbe'],
    ['Présence d\'arachide non mentionnée sur l\'étiquetage', 'allergen'], ['Allergènes non déclarés', 'allergen'], ['Undeclared allergen: milk', 'allergen'], ['Nicht deklariertes Allergen', 'allergen'],
    ['Présence de corps étrangers (morceaux de verre)', 'foreign'], ['Foreign body: metal pieces', 'foreign'], ['Fremdkörper', 'foreign'],
    ['Présence possible de céréulide (toxine produite par Bacillus cereus)', 'toxin'], ['Aflatoxines', 'toxin'], ['Histamine', 'toxin'], ['Dépassement de la teneur en ochratoxine A', 'toxin'],
    ['Résidus de pesticides (oxyde d\'éthylène)', 'chemical'], ['Dépassement de la limite maximale en cadmium', 'chemical'], ['Présence d\'une substance interdite (sibutramine)', 'chemical'], ['Migration de composants de l\'emballage', 'chemical'],
    ['Erreur d\'étiquetage', 'label'], ['Date limite de consommation erronée', 'label'],
    ['Non-conformité', 'other'], ['Défaut de qualité', 'other'], ['', 'other'], [null, 'other'], [undefined, 'other'],
  ];
  for (const [text, kind] of cases) assert.equal(hazardOf(text), kind, String(text));
});

test('several texts are read together; an undeclared allergen wins over the labelling it is found on', () => {
  assert.equal(hazardOf('Non-conformité', 'Listeria monocytogenes (agent responsable de la listériose)'), 'microbe');
  assert.equal(hazardOf('Erreur d\'étiquetage : présence de lait non déclaré', 'Allergènes'), 'allergen');
  assert.equal(hazardOf(null, undefined, ''), 'other');
  assert.equal(fold('Présence d\'ALLERGÈNES'), 'presence d\'allergenes');
});
