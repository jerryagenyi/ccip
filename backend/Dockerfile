FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files (composer.lock is optional and will be generated during install if missing)
COPY composer.json ./

# Install PHP dependencies
RUN composer install --no-scripts --no-autoloader

# Copy application files
COPY . .

# Complete composer setup (skip scripts since artisan may not be available during build)
RUN composer dump-autoload --optimize --no-scripts

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && mkdir -p /var/www/html/bootstrap/cache \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Expose port
EXPOSE 8000

# Start PHP development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

