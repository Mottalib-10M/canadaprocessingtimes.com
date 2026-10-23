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
export const LAST_UPDATED = '2026-10-21';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"en": "Independent publisher that archives Canadian immigration processing times every week and turns them into estimated decision dates and trends", "fr": "Éditeur indépendant qui archive chaque semaine les délais de traitement de l'immigration canadienne et en tire des dates de décision estimées et des tendances"};
export const AUTHOR_DESC: Record<string, string> = {"en": "Radif Partners reads the processing times that IRCC publishes for each application type and country of filing, keeps a dated copy of every reading, and turns the figures into what an applicant actually asks: the date a decision could come if the published time holds, whether that time is rising or falling, and how a country compares with the others. Nothing is sold, no consultant is recommended and no contact detail is ever asked for.", "fr": "Radif Partners relit les délais qu'IRCC publie pour chaque type de demande et chaque pays de dépôt, garde une copie datée de chaque relevé et en tire ce que le demandeur veut savoir : la date à laquelle une décision pourrait arriver si le délai publié se maintient, le sens de la tendance et la place de son pays parmi les autres. Rien n'est vendu, aucun consultant n'est recommandé et aucune coordonnée n'est demandée."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"en": ["IRCC processing times", "Visitor visa and study permit processing", "Work permits and post-graduation work permits", "Express Entry rounds of invitations", "Family sponsorship processing", "Canadian citizenship physical presence"], "fr": ["Délais de traitement d'IRCC", "Traitement des visas de visiteur et des permis d'études", "Permis de travail et permis post-diplôme", "Rondes d'invitations d'Entrée express", "Traitement du parrainage familial", "Présence effective pour la citoyenneté canadienne"]};
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
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
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
