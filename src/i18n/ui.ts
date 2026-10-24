import type { Locale } from './routes';
const fr = {
  updatedOn: 'Données relues le', editorialPolicy: 'Politique éditoriale', contactLabel: 'Contact', reviewedBy: 'Préparé par',
  skipToContent: 'Aller au contenu', mainNav: 'Navigation principale', breadcrumbLabel: 'Fil d’Ariane', breadcrumbHome: 'Accueil', menuOpen: 'Ouvrir le menu',
  faqTitle: 'Questions fréquentes', relatedCalculators: 'Pour aller plus loin', sourcesTitle: 'Sources officielles de cette page', writtenBy: 'Préparé par',
  asOf: 'Données', lastUpdated: 'extraites par IRCC le', footerValidated: 'Source : données ouvertes d’Immigration, Réfugiés et Citoyenneté Canada (IRCC), relues chaque mois',
  oglText: 'Contient de l’information visée par la', oglName: 'Licence du gouvernement ouvert – Canada', oglHref: 'https://ouvert.canada.ca/fr/licence-du-gouvernement-ouvert-canada',
  footerBrowser: 'Tous les calculs se font dans votre navigateur · aucun compte, aucun courriel, aucun consultant',
  footerDisclaimer: 'Site indépendant publié par Radif Partners, sans lien avec IRCC ni avec le gouvernement du Canada, qui ne l’approuvent pas. Volumes officiels et estimations à titre d’information : ce n’est ni un avis juridique ni une promesse de date. Seul IRCC décide de votre demande.',
  footerPopular: 'Demandes par pays de citoyenneté',
  notFound: 'Aucune page à cette adresse. La page d’accueil transforme le délai affiché par IRCC en date de décision estimée et donne les volumes publiés en données ouvertes.',
  readMore: 'Lire la réponse complète',
  estimate: 'La date de décision est une estimation (date de dépôt + délai que vous lisez chez IRCC) ; les volumes viennent des données ouvertes d’IRCC. Information générale, pas un avis juridique.',
  moreOptions: 'Plus d’options', copyLink: 'Copier le lien', copied: 'Lien copié', print: 'Imprimer', howComputed: 'Comment c’est calculé', openFull: 'Ouvrir le simulateur complet',
};
const en: typeof fr = {
  updatedOn: 'Data read on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'Data', lastUpdated: 'extracted by IRCC on', footerValidated: 'Source: open data from Immigration, Refugees and Citizenship Canada (IRCC), read every month',
  oglText: 'Contains information licensed under the', oglName: 'Open Government Licence – Canada', oglHref: 'https://open.canada.ca/en/open-government-licence-canada',
  footerBrowser: 'Every figure is computed in your browser · no account, no email, no consultant',
  footerDisclaimer: 'Independent site published by Radif Partners, not affiliated with or endorsed by IRCC or the Government of Canada. Official volumes and estimates for guidance only: this is neither legal advice nor a promised date. Only IRCC decides on your application.',
  footerPopular: 'Applications by country of citizenship',
  notFound: 'Nothing lives at this address. The home page turns the time IRCC shows into an estimated decision date and gives the volumes IRCC publishes as open data.',
  readMore: 'Read the full answer',
  estimate: 'The decision date is an estimate (filing date + the time you read on IRCC’s site); volumes come from IRCC open data. General information, not legal advice.',
  moreOptions: 'More options', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is computed', openFull: 'Open the full calculator',
};
export function t(lang: Locale) { return lang === 'en' ? en : fr; }
