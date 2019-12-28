# Statically host front-end code
# TODO host flask app as well.
FROM nginx
COPY ./frontend/build /usr/share/nginx/html

