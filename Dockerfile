# Menggunakan image PHP dengan Apache
FROM php:7.4-apache

# Install ekstensi yang diperlukan
RUN docker-php-ext-install mysqli

# Salin kode aplikasi ke dalam container
COPY . /var/www/html/

# Beri hak akses
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html


# Aktifkan modul rewrite Apache
RUN a2enmod rewrite