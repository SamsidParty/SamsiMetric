FROM php:8.3.4-apache
WORKDIR /var/www

RUN a2enmod rewrite
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN apt-get update && apt-get install -y cron

COPY Build/ html

WORKDIR /var/www/html
COPY .en[v] ./

EXPOSE 80