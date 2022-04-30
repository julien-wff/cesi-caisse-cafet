# Caisse Cafet CESI

## À propos du projet

Ce projet vise à créer un système de caisse en ligne pour la cafet.

Le CMS Directus est utilisé pour la gestion des produits, types de produits et ventes. Une interface web est créée avec
VueJS 3 et DaisyUI pour faire office de caisse enregistreuse, connectée au CMS.

## Développement

Docker et Docker Compose sont utilisés pour le développement et la mise en production. Pour démarrer le développement,
il faut lancer le script situé dans `scripts/compose-dev.sh`. Cela va lancer le `docker-compose.yml` avec l'overwrite de
développement `docker-compose.dev.yml`.

Il est recommandé de ne pas lancer le container `web` pour le développement. Il a été désactivé, car impossible de faire
fonctionner le watcher des fichiers sources. Lancer donc les deux commandes suivantes dans deux terminaux :

```bash
sh scripts/compose-dev.sh postgresql redis directus 
```

```bash
cd web && pnpm i --frozen-lockfile && pnpm dev
```

## Production

### Déploiement

Pour lancer en mode production, créer le network `cafet_web` sur lequel sont disponibles le serveur web et Directus
aux adresses respectives `cafet-web:80` et `cafet-directus:8055`.

Les volumes `cafet_postgresql` et `cafet_directus_uploads` devront également être créés, afin de stocker respectivement
la base de données Postgres et les fichiers uploadés dans Directus.

Ensuite, afin de démarrer la mise en production, lancer la commande `docker-compose up -d --build`.

### Lien avec l'extérieur

Pour connecter le serveur web et le CMS à l'extérieur, il faut les lier à un reverse proxy qui va s'occuper de rediriger
les requêtes en fonction du domaine. Typiquement, on pourra utiliser Nginx ou HaProxy (un exemple de configuration
basique pour HaProxy est disponible dans `proxies/haproxy.cfg`).

On viendra donc connecter le serveur web à une URL (qui sera la principale) et le CMS à une autre URL (par exemple un
sous-domaine).

## Autres scripts

### Sauvegarde et restauration du schéma Directus

Deux scripts sont disponibles afin de sauvegarder et restaurer le schéma Directus : `scripts/schema-load.sh` et
`scripts/schema-save.sh`. La version save sert à sauvegarder le schéma directus dans le fichier
`./directus/schema/schema.yamp`. La version load permet de restaurer ce même schéma.

À noter qu'à chaque mise à jour du schéma sur le repository, il faut le recharger manuellement dans Directus.

Afin d'effectuer une opération ou l'autre, il faut que le container `cafet_directus` soit démarré.

### Sauvegarde et restauration de la base de données

Deux scripts sont disponibles afin de dump et restaurer la base de données : `scripts/database-dump.sh` et
`scripts/database-restore.sh`. Afin d'être restauré, le fichier dump doit être à l'emplacement
`./postgresql/dump/database.dump`. De même, lors d'une sauvegarde, le fichier dump sera créé à ce même emplacement.

Afin de restaurer un dump, il faut démarrer le container `cafet_postgresql` avec son volume vide et s'assurer que le
container `cafet_directus` ne démarre pas, sinon les deux bases de données seront en conflit. Autre note, pas besoin de
restaurer le schema directus si un dump est restauré (en prenant en compte que le dump est à jour au niveau du schéma).

Comme pour le schéma, il faut que le container `cafet_postgresql` soit démarré afin de réaliser ces opérations.
