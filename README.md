### Online Directory

## Installation
1. Clone the repository to your machine and run npm install to install apps listed in the package.json file
2. Configure your mongodb database and place the URI in the env file.
3. Create an app on github by adding a new app on the developer settings page
4. Copy the app's ID and Secret key to the env file
5. Generate a random string to act as the passport secret key.
6. App is now ready to run. Use the command 'npm start' to run the app

## Architecture
The app implements two models: Entry, and User. The entry model handles the database connection using mongoose for schema. The entry and user routes handle CRUD operations for entries and users respectively.  

## Extra Feature
This app implements search functionality that searches names, addresses, and description fields for entries that match your search term. 