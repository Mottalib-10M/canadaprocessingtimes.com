/** Toutes les pages prévues (id = nom du fichier de src/content/guides). Les tests de contenu acceptent un lien
 *  vers ces ids pendant la rédaction ; le test « toutes les pages existent » échoue tant qu'il manque un fichier. */
export const PLANNED_GUIDES = [
  // Visite
  'visitor-visa', 'super-visa', 'visitor-record', 'eta',
  // Études et travail
  'study-permit', 'study-permit-extension', 'work-permit', 'pgwp', 'work-permit-extension', 'iec',
  // Résidence permanente
  'express-entry', 'cec', 'fsw', 'pnp', 'quebec-skilled-worker', 'atlantic', 'caregiver',
  // Famille et réfugiés
  'spousal-sponsorship', 'parents-grandparents', 'dependent-child', 'refugees',
  // Citoyenneté
  'citizenship', 'citizenship-calculator', 'pr-card',
  // Outils
  'express-entry-draws', 'history', 'beyond-processing-time',
  // Pays
  'india', 'philippines', 'nigeria', 'china', 'pakistan', 'iran', 'vietnam', 'mexico', 'brazil', 'morocco', 'algeria', 'cameroon', 'tunisia', 'france', 'haiti',
];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, 'home', 'method', 'about', 'widget', 'contact', 'editorial', 'privacy', 'terms', 'cookies']);
