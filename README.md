# Chat communicating by websockets with expressjs and mongodb.
Kamil Rakoczy

# Main aim
Main aim of the application is to allow sending text messages and images to another users using simple interface.
Beside of that there is admin user that is allowed to delete messages of other users or demote/promote to admin and delete users.

# Description of application
Chat was build using expressjs as web framework, passportjs to authenticate users, mongodb for database engine and socket io for direct communication between clients and server.
It is build using MVC model and with javascript security aspects in mind.

Application contains 3 main folders: views, config and app and starting script server.js:

 - views folder contains all views files written in ejs templating language.
 - config folder contains configuration scripts for database and passportjs user authenticator.
 - app folder contains static served css/js, database models and routes configuration.
 - server.js script contains starting configuration of web server and web socket server
