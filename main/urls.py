from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('services/', views.services_view, name='services'),
    path('packages/', views.packages_view, name='packages'),
    path('booking/', views.booking_view, name='booking'),
    path('profile/', views.profile_view, name='profile'),
    path('contact/', views.contact_view, name='contact'),
    path('api/service-data/', views.get_service_data, name='service_data'),
]

