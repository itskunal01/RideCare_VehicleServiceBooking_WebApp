from django.urls import path
from django.contrib.admin.views.decorators import staff_member_required
from . import views

urlpatterns = [
    path('', staff_member_required(views.admin_dashboard, login_url='/login/'), name='admin_dashboard'),
    path('bookings/', staff_member_required(views.admin_bookings, login_url='/login/'), name='admin_bookings'),
    path('bookings/update-status/', staff_member_required(views.admin_update_booking_status, login_url='/login/'), name='admin_update_booking_status'),
    path('services/', staff_member_required(views.admin_services, login_url='/login/'), name='admin_services'),
    path('packages/', staff_member_required(views.admin_packages, login_url='/login/'), name='admin_packages'),
    path('users/', staff_member_required(views.admin_users, login_url='/login/'), name='admin_users'),
]

