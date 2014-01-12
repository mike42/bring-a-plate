Bring a Plate
=============
This is a web app to help you co-ordinate "Bring a plate" style events, by giving each guest a unique web link. They can use the app to view what food is being brought, and what dietary requirements other guests have (although they can't see the guest list!).

For the organiser, there is a special interface for creating the invitation links. It allows the food, invitation and guest lists to be exported as a spreadsheet. You could use this to:
- create invitations with a mail merge
- generate QR codes for web links
- produce food labels which list allergens and specially mark vegetarian food
- prepare name tags

Set up
------
The setup is quite typical of a PHP web app.
- Import the database schema from lib/schema.sql and put the files on your webserver.
- Copy "site.example" to "site" and edit config.php to add your database settings.
- Log in to your site (load 'admin.php') to verify that it's working.
- Secure your admin.php (see below)
- Write up your event information in 

How to secure admin.php
-----------------------
The admin.php file lets you view and edit the invitations. If you don't secure it, then anybody can change the guest list!

With Apache, you need to set up [Authentication](http://httpd.apache.org/docs/current/howto/auth.html) for it. On most shared web hosts, you can log in and put something like this in the admin/ folder:

    AuthUserFile /home/username/.htpasswd
    AuthName "Login Required"
    AuthType Basic

    require valid-user

And then the htpasswd program would be used to generate the logins.

External libraries
------------------
- [jQuery](http://jquery.com/)
- [Twitter Bootstrap](http://getbootstrap.com/)
