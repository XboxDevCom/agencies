import { useTranslation } from './I18nProvider';

const de = {
  directory: 'Verzeichnis', tools: 'Weitere Tools', investors: 'Investoren-Tipps', calculator: 'Rendite-Rechner',
  title: 'Creator. Agenturen. Verbindungen.', subtitle: 'Agenturen und Netzwerke im DACH-Umfeld – nach Schwerpunkt und Plattform entdecken.',
  search: 'Agentur, Schwerpunkt oder Standort suchen', results: 'Ergebnisse', entries: 'Einträge', all: 'Alle',
  reviewed: 'Mit Quellen geprüft', unverified: 'Prüfung offen', unknown: 'Nicht belegt',
  dataNote: 'Quellen statt Schätzwerte.', dataHelp: 'Geprüfte Angaben sind im Profil mit Quelle und Datum dokumentiert. Ungeprüfte Einträge bleiben entsprechend gekennzeichnet.',
  unknownHelp: 'Reichweiten, Konditionen und Creator-Zuordnungen ohne belastbare Quelle werden nicht als Fakten angezeigt.',
  country: 'Land', moreFilters: 'Weitere Filter', sorting: 'Sortierung', ascending: 'Aufsteigend', descending: 'Absteigend',
  profile: 'Profil ansehen', website: 'Website', sources: 'Quellen & Datenstand', checked: 'Geprüft am', fields: 'Geprüfte Angaben',
  source: 'Quelle', noSource: 'Für diesen Eintrag liegt noch keine geprüfte Quelle vor.', legacy: 'Angaben aus dem bisherigen Verzeichnis; noch nicht verifiziert.',
  countries: 'Deutschland · Österreich · Schweiz', reach: 'Dokumentierte Reichweite ab', reachHelp: 'Gesamtreichweite der Agentur, keine Aufnahmevoraussetzung.',
  noResults: 'Keine passende Agentur gefunden.', noResultsHelp: 'Suchbegriff verkürzen oder Filter zurücksetzen.',
  allResults: 'Alle Einträge anzeigen', missingPage: 'Diese Seite wurde nicht gefunden.', back: 'Zum Verzeichnis',
  dataLanguage: 'Profiltexte werden in der Sprache der Recherche angezeigt.',
};
type Copy = Record<keyof typeof de, string>;
const en: Copy = {
  directory: 'Directory', tools: 'More tools', investors: 'Investor tips', calculator: 'Yield calculator',
  title: 'Creators. Agencies. Connections.', subtitle: 'Discover agencies and networks in the DACH ecosystem by focus and platform.',
  search: 'Search agency, focus or location', results: 'Results', entries: 'Entries', all: 'All',
  reviewed: 'Sources reviewed', unverified: 'Review pending', unknown: 'Not documented',
  dataNote: 'Sources over estimates.', dataHelp: 'Reviewed fields include sources and dates in the profile. Unreviewed entries are labelled accordingly.',
  unknownHelp: 'Reach, terms and creator affiliations without reliable sources are not presented as facts.',
  country: 'Country', moreFilters: 'More filters', sorting: 'Sort by', ascending: 'Ascending', descending: 'Descending',
  profile: 'View profile', website: 'Website', sources: 'Sources & review date', checked: 'Reviewed on', fields: 'Reviewed fields',
  source: 'Source', noSource: 'This entry has no reviewed source yet.', legacy: 'Imported from the previous directory; not yet verified.',
  countries: 'Germany · Austria · Switzerland', reach: 'Documented reach from', reachHelp: 'Total agency reach, not a minimum to join.',
  noResults: 'No matching agencies.', noResultsHelp: 'Try a shorter search or reset the filters.',
  allResults: 'Show all entries', missingPage: 'This page could not be found.', back: 'Back to directory',
  dataLanguage: 'Profile descriptions retain the language of the research.',
};
const fr: Copy = {
  directory: 'Annuaire', tools: 'Autres outils', investors: 'Conseils investisseurs', calculator: 'Calculateur de rendement',
  title: 'Créateurs. Agences. Connexions.', subtitle: 'Agences et réseaux de l’écosystème DACH, par spécialité et plateforme.',
  search: 'Rechercher une agence, spécialité ou ville', results: 'Résultats', entries: 'Entrées', all: 'Tous',
  reviewed: 'Sources vérifiées', unverified: 'À vérifier', unknown: 'Non documenté',
  dataNote: 'Des sources, pas des estimations.', dataHelp: 'Les informations vérifiées sont accompagnées de sources et de dates dans le profil. Les autres entrées sont signalées.',
  unknownHelp: 'Les audiences, conditions et affiliations sans source fiable ne sont pas présentées comme des faits.',
  country: 'Pays', moreFilters: 'Autres filtres', sorting: 'Trier par', ascending: 'Croissant', descending: 'Décroissant',
  profile: 'Voir le profil', website: 'Site web', sources: 'Sources et vérification', checked: 'Vérifié le', fields: 'Informations vérifiées',
  source: 'Source', noSource: 'Aucune source vérifiée pour cette entrée.', legacy: 'Données de l’ancien annuaire ; pas encore vérifiées.',
  countries: 'Allemagne · Autriche · Suisse', reach: 'Audience documentée à partir de', reachHelp: 'Audience totale de l’agence, pas un seuil d’admission.',
  noResults: 'Aucune agence correspondante.', noResultsHelp: 'Raccourcir la recherche ou réinitialiser les filtres.',
  allResults: 'Afficher toutes les entrées', missingPage: 'Cette page est introuvable.', back: 'Retour à l’annuaire',
  dataLanguage: 'Les descriptions conservent la langue de la recherche.',
};
const it: Copy = {
  directory: 'Elenco', tools: 'Altri strumenti', investors: 'Consigli investitori', calculator: 'Calcolatore di rendimento',
  title: 'Creator. Agenzie. Connessioni.', subtitle: 'Agenzie e reti nell’ecosistema DACH, per specializzazione e piattaforma.',
  search: 'Cercare agenzia, specializzazione o città', results: 'Risultati', entries: 'Voci', all: 'Tutte',
  reviewed: 'Fonti verificate', unverified: 'Da verificare', unknown: 'Non documentato',
  dataNote: 'Fonti, non stime.', dataHelp: 'I dati verificati hanno fonti e date nel profilo. Le voci non verificate sono indicate come tali.',
  unknownHelp: 'Copertura, condizioni e affiliazioni senza fonti affidabili non vengono presentate come fatti.',
  country: 'Paese', moreFilters: 'Altri filtri', sorting: 'Ordina per', ascending: 'Crescente', descending: 'Decrescente',
  profile: 'Vedi profilo', website: 'Sito web', sources: 'Fonti e verifica', checked: 'Verificato il', fields: 'Dati verificati',
  source: 'Fonte', noSource: 'Nessuna fonte verificata per questa voce.', legacy: 'Dati del precedente elenco; non ancora verificati.',
  countries: 'Germania · Austria · Svizzera', reach: 'Copertura documentata da', reachHelp: 'Copertura totale dell’agenzia, non un requisito di ammissione.',
  noResults: 'Nessuna agenzia corrispondente.', noResultsHelp: 'Abbreviare la ricerca o azzerare i filtri.',
  allResults: 'Mostra tutte le voci', missingPage: 'Pagina non trovata.', back: 'Torna all’elenco',
  dataLanguage: 'Le descrizioni mantengono la lingua della ricerca.',
};
export const useDirectoryCopy = (): Copy => {
  const { language } = useTranslation();
  return { de, en, fr, it }[language];
};
