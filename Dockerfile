FROM debian:buster

# Apt dependencies
RUN apt-get update && apt-get install -y \
    apache2 \
    libapache2-mod-wsgi-py3 \
    python3-venv

COPY --chown=www-data:www-data ./frontend/build /var/www/html/
COPY --chown=www-data:www-data ./backend /var/www/bring-a-plate/

# Re-build python virtualenv (contains abolute paths; best to exclude anything added locally)
RUN (cd /var/www/bring-a-plate/ && \
    python3 -m venv venv && \
    ./venv/bin/pip install -r requirements.txt)

# Prepare apache to host as WSGI app
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_PID_FILE /var/run/apache2/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_RUN_GROUP www-data
ENV APACHE_RUN_USER www-data
ADD deploy/000-default.conf /etc/apache2/sites-available/000-default.conf
EXPOSE 80

ENTRYPOINT ["/usr/sbin/apache2"]
CMD ["-D", "FOREGROUND"]
