@echo off
echo Starting CarBooking Database Container...
docker run --name carbooking-db -e MYSQL_ROOT_PASSWORD=carbookingpass -e MYSQL_DATABASE=carbooking -p 3307:3306 -d mariadb:10

echo Waiting for database to start...
timeout /t 10

echo Importing Schema...
docker exec -i carbooking-db mysql -u root -pcarbookingpass carbooking < init-db.sql

echo Database Setup Complete!
pause
