echo 'Creating dump directory...'
docker exec -it postgresql bash -c 'mkdir /dump'

echo 'Dumping database...'
docker exec -it postgresql bash -c 'pg_dump -U postgresql directus > /dump/database.dump'

echo 'Copying database dump to host...'
docker cp postgresql:/dump/database.dump ./postgresql/dump/database.dump

echo 'Removing dump from container...'
docker exec -it postgresql bash -c 'rm -r /dump'

echo 'Done.'
