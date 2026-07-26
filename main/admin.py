from django.contrib import admin
from .models import Service, Package, Booking, UserProfile, ContactMessage


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'duration', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'duration', 'is_recommended', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['is_recommended', 'created_at']
    filter_horizontal = ['services']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'bike_name', 'service_type', 'status', 'total_amount', 'preferred_date', 'created_at']
    list_filter = ['status', 'service_type', 'preferred_date', 'created_at']
    search_fields = ['user__username', 'name', 'email', 'bike_name', 'vehicle_number']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['services', 'packages']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'message']

