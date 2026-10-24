/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://canadaprocessingtimes.com";
export const SITE_NAMES: Record<string, string> = {"en": "Canada Processing Times", "fr": "Délais de traitement Canada"};
export const LANG_TAGS: Record<string, string> = {"en": "en-CA", "fr": "fr-CA"};
export const OG_LOCALES: Record<string, string> = {"en": "en_CA", "fr": "fr_CA"};
export const LOCALE_TAG = 'en-CA';
export const CURRENCY = 'CAD';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-09-01';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"en": "Independent publisher that turns Canadian immigration processing times into estimated decision dates, with IRCC service standards and open data", "fr": "Éditeur indépendant qui transforme les délais de traitement de l'immigration canadienne en dates de décision estimées, avec les normes de service et les données ouvertes d'IRCC"};
export const AUTHOR_DESC: Record<string, string> = {"en": "Radif Partners builds calculators from Government of Canada open data. For IRCC applications, it turns the processing time a reader copies from IRCC's tool into an estimated decision date, and sets it next to IRCC's service standards and the volumes IRCC publishes each month: applications received and decided, permits, permanent residents and new citizens. Nothing is sold, no consultant is recommended and no contact detail is ever asked for.", "fr": "Radif Partners construit des calculateurs à partir des données ouvertes du gouvernement du Canada. Pour les demandes à IRCC, il transforme le délai que le lecteur copie dans l'outil d'IRCC en date de décision estimée, et le place à côté des normes de service d'IRCC et des volumes qu'IRCC publie chaque mois : demandes reçues et tranchées, permis, résidents permanents et nouveaux citoyens. Rien n'est vendu, aucun consultant n'est recommandé et aucune coordonnée n'est demandée."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"en": ["IRCC processing times and service standards", "Visitor visa and study permit processing", "Work permits and post-graduation work permits", "Express Entry invitations by score band", "Family sponsorship processing", "Canadian citizenship physical presence"], "fr": ["Délais et normes de service d'IRCC", "Traitement des visas de visiteur et des permis d'études", "Permis de travail et permis post-diplôme", "Invitations d'Entrée express par tranche de score", "Traitement du parrainage familial", "Présence effective pour la citoyenneté canadienne"]};
export const CONTACT_EMAIL = "contact@canadaprocessingtimes.com";
export const THEME_COLOR = '#A3122B';
export const LOGO_SYMBOL = '⧗';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = 'G-R359PDRQN6';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'z260zhaoa1';
export const INDEXNOW_KEY = '3f276f07b912b288679d21eb53bc3c70';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : comme sur les autres sites du portefeuille
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "TVA",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
