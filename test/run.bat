start /b phantomjs --webdriver=8001 --webdriver-loglevel=DEBUG > log/webdriver.log

php ..\dist\vendor\phpunit\phpunit\phpunit --bootstrap bootstrap.php -c configuration.xml

Taskkill /IM phantomjs.exe /F