FROM php:8.3.4-apache
WORKDIR /var/www

RUN a2enmod rewrite
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

COPY Build/ html
EXPOSE 80