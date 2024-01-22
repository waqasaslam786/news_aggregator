 ******** About News Aggregator ********

***** PHP Version => 8.1.25 
***** Laravel version => 10

News data are get from three platforms
1 => Newsapi AI  https://www.newsapi.ai/
2 => Newsapi.org  https://newsapi.org/
3 => New York Time  https://developer.nytimes.com/


Setup at your local computer
•	Run command in root folder of project “composer install”
•	Kindy create a MYSQL database at your local XAMPP/WAMPP server
•	Run command in root folder of project “php artisan migrate”
•	Run command in root folder of project “php artisan db:seed”
•	For fetching the news data and save news information. Please run the following command “php artisan fetch:news”


•	After successfully installing and running this project, simply visit the URL http://localhost:8000 to confirm that the backend is running properly.


