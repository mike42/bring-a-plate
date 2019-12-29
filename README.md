# Bring a Plate

[![Build Status](https://travis-ci.org/mike42/bring-a-plate.svg?branch=master)](https://travis-ci.org/mike42/bring-a-plate)

"Bring a Plate" is a web app to co-ordinate attendee-catered events.

## Build process

### Front-end

The front-end is a Javascript (React) single-page application. Build it as follows:

```bash
(cd frontend && \
    npm install &&
    npm run-script build)
```

### Back-end

The back-end is a Python (Flask) WSGI application. It does not need to be built, but dependencies will need to be loaded into a virtual env.

```bash
(cd backend && \
    python3 -m venv venv && \
    ./venv/bin/pip3 install -r requirements.txt)
```

## Deployment

### Kubernetes/Docker deployment

(Work in progress)

### Manual installation

The following steps assume that you are running a recent Debian GNU/Linux or Ubuntu system. The app needs to run in a web server which does the following:

- Serve the front-end as static resources
- Run the back-end via a WSGI container

Install dependencies:

```
sudo apt-get install apache2 libapache2-mod-wsgi-py3
```

Copy in the front-end:

```
sudo cp -Rv frontend/build/* /var/www/html/
```

Place the back-end somewhere outside the webroot:

```
sudo mkdir -p /var/www/bring-a-plate
sudo cp -Rv backend/* /var/www/bring-a-plate
```

Add these lines to `/etc/apache2/sites-enabled/000-default.conf`, just before `</VirtualHost>`

```
WSGIDaemonProcess bring-a-plate python-home=/var/www/bring-a-plate/venv
WSGIProcessGroup bring-a-plate
WSGIApplicationGroup %{GLOBAL}
WSGIScriptAlias /api /var/www/bring-a-plate/application.py/api
<Directory /some/path/project>
    Require all granted
</Directory>
```

Restart apache.

```
systemctl restart apache2
```

