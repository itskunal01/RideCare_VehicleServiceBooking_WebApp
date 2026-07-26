from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from .models import Booking, UserProfile, ContactMessage

User = get_user_model()


class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True, label='Full Name')
    phone = forms.CharField(max_length=15, required=False)

    class Meta:
        model = User
        fields = ('first_name', 'email', 'phone', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.username = self.cleaned_data['email']  # Use email as username
        if commit:
            user.save()
        return user


class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = [
            'name', 'phone', 'email', 'bike_name', 'vehicle_number',
            'purchase_year', 'odometer_reading', 'service_type',
            'address', 'preferred_date', 'preferred_time'
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'required': True}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'required': True}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'required': True}),
            'bike_name': forms.TextInput(attrs={'class': 'form-control', 'required': True}),
            'vehicle_number': forms.TextInput(attrs={'class': 'form-control', 'required': True}),
            'purchase_year': forms.NumberInput(attrs={'class': 'form-control', 'required': True, 'min': 1990, 'max': 2025}),
            'odometer_reading': forms.NumberInput(attrs={'class': 'form-control', 'min': 0}),
            'service_type': forms.RadioSelect(attrs={'class': 'form-check-input'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'required': True}),
            'preferred_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date', 'required': True}),
            'preferred_time': forms.TimeInput(attrs={'class': 'form-control', 'type': 'time', 'required': True}),
        }


class ProfileForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30, required=False, label='Full Name')
    email = forms.EmailField(required=False)

    class Meta:
        model = UserProfile
        fields = ['phone', 'address', 'profile_photo']
        widgets = {
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'profile_photo': forms.FileInput(attrs={'class': 'form-control'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.user:
            self.fields['first_name'].initial = self.instance.user.first_name
            self.fields['email'].initial = self.instance.user.email

    def save(self, commit=True):
        profile = super().save(commit=False)
        if commit:
            profile.save()
            # Update user fields
            if 'first_name' in self.cleaned_data:
                profile.user.first_name = self.cleaned_data['first_name']
            if 'email' in self.cleaned_data:
                profile.user.email = self.cleaned_data['email']
            profile.user.save()
        return profile


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'required': True}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'required': True}),
            'message': forms.Textarea(attrs={'class': 'form-control', 'rows': 5, 'required': True}),
        }

