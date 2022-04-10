echo 'Creating dump directory...'
docker exec -it postgresql bash -c 'mkdir /dump'

echo 'Copying dump file to /dump/database.dump...'
docker cp ./postgresql/dump/database.dump postgresql:/dump/database.dump

echo 'Restoring database...'
docker exec -it postgresql bash -c 'psql -q -f /dump/database.dump -U postgresql -d directus'

echo 'Deleting dump file...'
docker exec -it postgresql bash -c 'rm -r /dump'

echo 'Done.'
