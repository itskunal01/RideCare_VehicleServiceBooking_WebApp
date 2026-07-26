from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Service(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    duration = models.CharField(max_length=50)  # e.g., "30 min"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Package(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    duration = models.CharField(max_length=50)  # e.g., "90 min"
    services = models.ManyToManyField(Service, related_name='packages')
    is_recommended = models.BooleanField(default=False)
    badge = models.CharField(max_length=50, blank=True)  # e.g., "Recommended", "Best Value"
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['price']


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    profile_photo = models.ImageField(upload_to='profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Booking(models.Model):
    SERVICE_TYPE_CHOICES = [
        ('doorstep', 'Doorstep Service'),
        ('pickup_drop', 'Workshop Pick-up & Drop'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    
    # Customer Information
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    
    # Vehicle Details
    bike_name = models.CharField(max_length=200)
    vehicle_number = models.CharField(max_length=50)
    purchase_year = models.IntegerField()
    odometer_reading = models.IntegerField(blank=True, null=True)
    
    # Service Details
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES, default='doorstep')
    address = models.TextField()
    preferred_date = models.DateField()
    preferred_time = models.TimeField()
    
    # Booking Details
    services = models.ManyToManyField(Service, related_name='bookings', blank=True)
    packages = models.ManyToManyField(Package, related_name='bookings', blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.user.username} - {self.bike_name}"

    class Meta:
        ordering = ['-created_at']


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.name}"

    class Meta:
        ordering = ['-created_at']

