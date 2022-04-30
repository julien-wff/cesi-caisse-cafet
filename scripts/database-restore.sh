echo 'Creating dump directory...'
docker exec -it cafet_postgresql bash -c 'mkdir /dump'

echo 'Copying dump file to /dump/database.dump...'
docker cp ./postgresql/dump/database.dump cafet_postgresql:/dump/database.dump

echo 'Restoring database...'
docker exec -it cafet_postgresql bash -c 'psql -q -f /dump/database.dump -U postgresql -d directus'

echo 'Deleting dump file...'
docker exec -it cafet_postgresql bash -c 'rm -r /dump'

echo 'Done.'
