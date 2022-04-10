# Caisse cafet CESI

## À propos du projet

Ce projet vise à créer un système de caisse en ligne pour la cafet.

Le CMS Directus est utilisé pour la gestion des produits, types de produits et ventes. Une interface web sera créé avec
SvelteKit et DaisyUI pour faire office de caisse enregistreuse, connectée au CMS.

## Développement

Docker et Docker Compose sont utilisés pour le développement et la mise en production. Pour démarrer le développement,
il faut lancer le script situé dans `scripts/compose-dev.sh`. Cela va lancer le `docker-compose.yml` avec l'overwrite de
développement `docker-compose.dev.yml`

## Production

Pour lancer en mode production, créer le network `directus` et le volume `postgresql`, puis lancer la
commande `docker-compose up -d`.
