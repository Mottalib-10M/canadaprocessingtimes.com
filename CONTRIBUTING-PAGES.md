# Écrire ou modifier une page

Une page = UN fichier `src/content/guides/<id>.ts` (`defineGuide`), avec la version anglaise (`en`) et, si la
recherche existe en français, la version française (`fr`) côte à côte. Routes, menus, pied de page, sitemap,
hreflang, schémas et liens internes lisent ces fichiers et rien d'autre. Liste des pages prévues :
`src/lib/planned.ts`. Modèle : `src/content/guides/visitor-visa.ts`.

## Règles

- **Aucun chiffre tapé à la main.** Tout nombre, part, date vient de la trousse `KIT as K` (`src/lib/kit.ts`),
  elle-même nourrie par les seuls jeux de données ouverts sous Licence du gouvernement ouvert du Canada
  (`src/data/ogl/`, écrits par `npm run update-data`) : `K.ops12(indicateur, pays)`, `K.approval12(pays)`,
  `K.net12(pays)`, `K.rank12(ind., pays)`, `K.full(ind., pays)` sur `K.MONTHS`, `K.fullYear`, `K.fullExtremes`,
  `K.pr12/prSeries(catégorie)` sur `K.PRD.months`, `K.imp12/impSeries(programme)` sur `K.IMPD.months`,
  `K.study12/studySeries(pays)` sur `K.STD.months`, `K.eeYear/eeBands/eeBandShare/eeCountry/eeTop` (Entrée
  express), `K.stdOf(prog)` + `K.fmtStd` + `K.fmtFy` (normes de service d'IRCC), `K.CIT_RULE` (règle des 1 095
  jours), `K.tool(kind, lang, args, valeurs)`. Indicateurs : trIn, trFin, trOk, spFin, v1, prIn, copr, cit.
  Les ids de programmes sont dans `src/lib/data.ts` (`PROGS`).
- **Les délais publiés sur canada.ca ne sont jamais reproduits** (Avis du gouvernement du Canada : pas d'usage
  commercial). Une page renvoie à l'outil d'IRCC (`h.src('ptimes')`) et le simulateur `delai` prend le délai que
  le lecteur y lit. Ni file d'attente, ni ronde, ni tableau de canada.ca.
- Dans `body(h)` : `h.a(id, texte)` lien interne (id inconnu = test en échec), `h.src(clé)` source de
  `params-2026.json`, `h.table(...)`, `h.months(mois, [[titre, série], ...])` tableau mensuel,
  `h.mini(kind, { p, d, t })` mini-simulateur (au moins un par page), `h.n`, `h.pct`, `h.ch` (écart signé),
  `h.pa` (écart sans signe), `h.day`, `h.my`, `h.w12`, `h.cn(code pays)`.
- Un texte qui dépend des données reste vrai quand elles changent : mots calculés (hausse/baisse, noms des
  premiers pays) ou garde `if (...) throw` au chargement du module.
- Titre 50 à 60 caractères, terme clé d'abord, « 2026 » compris, jamais en tête un pays, « Canada », un mot
  d'outil (calculateur, simulateur) ou une question. Description 150 à 160 caractères, « 2026 » comprise.
- `resume` : UN paragraphe de 120 mots ou plus, la réponse directe et chiffrée (RECETTE §21).
- Corps : 520 mots de prose ou plus (450 pour une page de pays), tableaux à part. FAQ : 3 à 5 questions, réponses de
  40 à 90 mots, aucune question répétée sur le site. Aucun tiret long ni demi-cadratin, aucune tournure listée
  dans `tests/pages.test.ts`.
- Jamais se présenter comme IRCC, jamais promettre une date, jamais recommander un avocat ou un consultant, aucun
  lien vers un autre site du portefeuille (`_trame/domaines-ovh.txt`).
- Deux pages ne se ressemblent jamais à plus de 30 % (`check-unique.py`) : chaque page a ses propres faits, ses
  propres exemples et son propre plan.

## Vérifier

```
PAGE_FILES=visitor-visa,super-visa npx vitest run tests/pages.test.ts
```

puis, une fois toutes les pages écrites, `npm run check` (build et tous les contrôles).
