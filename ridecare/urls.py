"""
URL configuration for ridecare project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Custom admin dashboard (our UI)
    path('admin/', include('main.urls_admin')),  # Staff-protected dashboard
    # Django built-in admin (kept at a different path)
    path('django-admin/', admin.site.urls),
    path('', include('main.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0] if settings.STATICFILES_DIRS else None)

