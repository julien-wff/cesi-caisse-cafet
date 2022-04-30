echo 'Creating dump directory...'
docker exec -it cafet_postgresql bash -c 'mkdir /dump'

echo 'Dumping database...'
docker exec -it cafet_postgresql bash -c 'pg_dump -U postgresql directus > /dump/database.dump'

echo 'Copying database dump to host...'
docker cp cafet_postgresql:/dump/database.dump ./postgresql/dump/database.dump

echo 'Removing dump from container...'
docker exec -it cafet_postgresql bash -c 'rm -r /dump'

echo 'Done.'
