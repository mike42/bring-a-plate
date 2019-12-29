FROM debian:buster
COPY ./frontend/build /var/www/html/
COPY ./backend /var/www/bring-a-plate/

RUN apt-get update && apt-get install -y \
    apache2 \
    libapache2-mod-wsgi-py3

ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_PID_FILE /var/run/apache2/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_RUN_GROUP www-data
ENV APACHE_RUN_USER www-data

ADD deploy/000-default.conf /etc/apache2/sites-available/000-default.conf

EXPOSE 80

ENTRYPOINT ["/usr/sbin/apache2"]
CMD ["-D", "FOREGROUND"]
