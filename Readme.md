# Argu AI

Argu AI est un projet expérimental d'analyse argumentative automatisée. Il combine plusieurs modèles d'intelligence artificielle pour détecter, classer et relier des segments d'arguments dans des textes.

Le pipeline s'appuie sur :
- **spaCy** avec le modèle `en_core_web_sm` pour la segmentation des textes en unités argumentatives,
- **RandomForestClassifier** pour identifier les types de segments (conclusion, sous-conclusion, etc.),
- **DistilBERT** pour déterminer les relations entre les segments.

L’objectif est d’extraire automatiquement la structure argumentative d’un texte, avec un accent sur l'interprétabilité et la précision.

> ⚠️ Ce projet n’a pas été mis à jour depuis plus d’un an. Il s'agit d'une base solide mais encore expérimentale, qui nécessite une refonte pour aller plus loin.

---

## Prochaine étape

La prochaine phase du projet consiste à :
- Migrer l'application vers **Next.js** pour bénéficier d’une architecture plus moderne côté frontend,
- **Séparer la logique métier** Python de l’interface utilisateur,
- **Remplacer l’API Flask** actuelle par une API native dans Next.js (API routes).

Ce refactoring permettra de rendre le projet plus modulaire, maintenable, et adapté à un déploiement à plus grande échelle.
