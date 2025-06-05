import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# =========================
# Paths e configurações básicas
# =========================

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-dkkqgl!$^vk#_@w*%mz-l^t)pf4@nqd!&u-d=5e9a0y@8i#r6a'
DEBUG = True
ALLOWED_HOSTS = []

# =========================
# Aplicativos instalados
# =========================

INSTALLED_APPS = [
    # Django padrão
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Terceiros
    'rest_framework',
    'drf_yasg',
    'corsheaders',

    # Apps locais
    'core',
]

# =========================
# Middleware
# =========================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# =========================
# URLs e WSGI
# =========================

ROOT_URLCONF = 'suporte.urls'
WSGI_APPLICATION = 'suporte.wsgi.application'

# =========================
# Templates
# =========================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# =========================
# Banco de dados
# =========================

DATABASES = {
    'default': {
        'ENGINE': 'mysql.connector.django',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': os.getenv('DATABASE_PORT', '3306'),
    }
}

# =========================
# Autenticação
# =========================

AUTH_USER_MODEL = 'core.Usuario'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# =========================
# Internacionalização
# =========================

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# =========================
# Arquivos estáticos e mídia
# =========================

STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# =========================
# Configurações de CORS
# =========================

CORS_ALLOW_ALL_ORIGINS = True

# =========================
# Outros
# =========================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



