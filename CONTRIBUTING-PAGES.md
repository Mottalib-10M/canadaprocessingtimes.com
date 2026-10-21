# Écrire ou modifier une page

Une page = UN fichier `src/content/guides/<id>.ts` (`defineGuide`), avec la version anglaise (`en`) et, si la
recherche existe en français, la version française (`fr`) côte à côte. Routes, menus, pied de page, sitemap,
hreflang, schémas et liens internes lisent ces fichiers et rien d'autre. Liste des pages prévues :
`src/lib/planned.ts`. Modèle : `src/content/guides/visitor-visa.ts`.

## Règles

- **Aucun chiffre tapé à la main.** Tout délai, date, nombre vient de la trousse `KIT as K` (`src/lib/kit.ts`) :
  `K.readingOf(prog, pays)` (délai publié `t`, date IRCC, série), `K.fullTrend(série)` (historique complet :
  `first/firstDate`, `min/minDate`, `max/maxDate`, `prev/prevDate`, `last`), `K.points(série)`,
  `K.valueNear(série, date)`, `K.rangeOf(prog)`, `K.estimate(...)`, `K.ROUNDS`, `K.eeStats(...)`,
  `K.P.citizenship` (règle des 1 095 jours). Les ids de programmes sont dans `src/lib/data.ts` (`PROGS`).
  Séries : `c:<clé>:<PAYS>` (par pays), `n:<clé>` (sans pays), `f:<clé>` (prospectif), `t:SP-EXT|WP-EXT`
  (prolongations, par semaine), `w:<clé>` (personnes en attente).
- Dans `body(h)` : `h.a(id, texte)` lien interne (id inconnu = test en échec), `h.src(clé)` source de
  `params-2026.json`, `h.table(...)`, `h.hist(série, { max, unit })` tableau des relevés datés avec la copie citée,
  `h.mini(kind, { p, d, t })` mini-simulateur (au moins un par page), `h.t(délai)`, `h.d(jours, unité)`,
  `h.day(iso)`, `h.my(iso)`, `h.n(x)`, `h.cn(code pays)`.
- Le texte n'invente aucun point d'historique : il ne cite que ce que `K.points` ou `K.fullTrend` rendent, avec la date.
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
