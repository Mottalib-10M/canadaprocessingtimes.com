import type { Locale } from './routes';
const fr = {
  updatedOn: 'Données relues le', editorialPolicy: 'Politique éditoriale', contactLabel: 'Contact', reviewedBy: 'Préparé par',
  skipToContent: 'Aller au contenu', mainNav: 'Navigation principale', breadcrumbLabel: 'Fil d’Ariane', breadcrumbHome: 'Accueil', menuOpen: 'Ouvrir le menu',
  faqTitle: 'Questions fréquentes', relatedCalculators: 'Pour aller plus loin', sourcesTitle: 'Sources officielles de cette page', writtenBy: 'Préparé par',
  asOf: 'Délais', lastUpdated: 'relus sur les fichiers publiés par IRCC le', footerValidated: 'Source : délais publiés par Immigration, Réfugiés et Citoyenneté Canada (IRCC), relus chaque semaine et archivés avec leur date',
  footerBrowser: 'Tous les calculs se font dans votre navigateur · aucun compte, aucun courriel, aucun consultant',
  footerDisclaimer: 'Site indépendant publié par Radif Partners, sans lien avec IRCC ni avec le gouvernement du Canada. Délais officiels datés et estimations à titre d’information : ce n’est ni un avis juridique ni une promesse de date. Seul IRCC décide de votre demande.',
  footerPopular: 'Délais par pays de dépôt',
  notFound: 'Aucune page à cette adresse. La page d’accueil donne le délai publié pour votre demande, la date de décision estimée et la tendance des dernières semaines.',
  readMore: 'Lire la réponse complète',
  estimate: 'Délais officiels datés ; la date de décision est une estimation (date de dépôt + délai publié, ou file publiée par IRCC). Information générale, pas un avis juridique.',
  moreOptions: 'Plus d’options', copyLink: 'Copier le lien', copied: 'Lien copié', print: 'Imprimer', howComputed: 'Comment c’est calculé', openFull: 'Ouvrir le simulateur complet',
};
const en: typeof fr = {
  updatedOn: 'Data read on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Prepared by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Common questions', relatedCalculators: 'Keep going', sourcesTitle: 'Official sources for this page', writtenBy: 'Prepared by',
  asOf: 'Times', lastUpdated: 'read from the files IRCC publishes on', footerValidated: 'Source: processing times published by Immigration, Refugees and Citizenship Canada (IRCC), read every week and archived with their date',
  footerBrowser: 'Every figure is computed in your browser · no account, no email, no consultant',
  footerDisclaimer: 'Independent site published by Radif Partners, not affiliated with IRCC or the Government of Canada. Dated official times and estimates for guidance only: this is neither legal advice nor a promised date. Only IRCC decides on your application.',
  footerPopular: 'Processing times by country of filing',
  notFound: 'Nothing lives at this address. The home page gives the published time for your application, the estimated decision date and the trend of recent weeks.',
  readMore: 'Read the full answer',
  estimate: 'Dated official times; the decision date is an estimate (filing date + published time, or the queue IRCC publishes). General information, not legal advice.',
  moreOptions: 'More options', copyLink: 'Copy share link', copied: 'Link copied', print: 'Print', howComputed: 'How this is computed', openFull: 'Open the full calculator',
};
export function t(lang: Locale) { return lang === 'en' ? en : fr; }
