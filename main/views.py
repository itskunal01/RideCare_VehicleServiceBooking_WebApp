from datetime import timedelta
from django.utils import timezone
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, get_user_model, logout
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.db.models import Sum, Count
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Service, Package, Booking, UserProfile, ContactMessage
from .forms import UserRegistrationForm, BookingForm, ContactForm, ProfileForm
import json


def home(request):
    """Homepage view"""
    packages = Package.objects.filter(is_recommended=True)[:3]
    if packages.count() < 3:
        packages = Package.objects.all()[:3]
    services = Service.objects.all()[:6]
    return render(request, 'main/home.html', {
        'packages': packages,
        'services': services
    })


def register_view(request):
    """User registration view"""
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Create user profile
            UserProfile.objects.create(
                user=user,
                phone=form.cleaned_data.get('phone', ''),
            )
            messages.success(request, 'Registration successful! You can now login.')
            return redirect('login')
    else:
        form = UserRegistrationForm()
    
    return render(request, 'main/login.html', {'form': form, 'is_register': True})


def login_view(request):
    """User login view"""
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        # Django uses username, but we store email as username
        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {user.get_full_name() or user.username}!')
                next_url = request.GET.get('next', 'home')
                return redirect(next_url)
            else:
                messages.error(request, 'Invalid email or password.')
        except User.DoesNotExist:
            messages.error(request, 'Invalid email or password.')
        except Exception as e:
            messages.error(request, 'An error occurred. Please try again.')
    
    return render(request, 'main/login.html', {'is_register': False})


def logout_view(request):
    """Log the user out and send them to login page with a message."""
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('login')


@login_required
def services_view(request):
    """Services listing page"""
    services = Service.objects.all()
    return render(request, 'main/services.html', {'services': services})


@login_required
def packages_view(request):
    """Packages listing page"""
    packages = Package.objects.all()
    return render(request, 'main/packages.html', {'packages': packages})


@login_required
def booking_view(request):
    """Booking page"""
    services = Service.objects.all()
    packages = Package.objects.all()
    selected_service_ids = []
    selected_package_ids = []
    
    if request.method == 'POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            booking = form.save(commit=False)
            booking.user = request.user
            
            # Get selected services and packages from POST data
            selected_services = request.POST.getlist('services')
            selected_packages = request.POST.getlist('packages')
            
            # Calculate total BEFORE first save (total_amount is non-nullable)
            total = 0
            services_obj = Service.objects.filter(id__in=selected_services) if selected_services else []
            packages_obj = Package.objects.filter(id__in=selected_packages) if selected_packages else []
            
            total += sum(float(s.price) for s in services_obj)
            total += sum(float(p.price) for p in packages_obj)
            
            # Add service type fee
            if booking.service_type == 'doorstep':
                total += 150
            elif booking.service_type == 'pickup_drop':
                total += 250
            
            booking.total_amount = total
            booking.save()  # Save once with total_amount set
            
            # Attach relationships after booking has an ID
            if services_obj:
                booking.services.set(services_obj)
            if packages_obj:
                booking.packages.set(packages_obj)
            
            messages.success(request, f'Booking confirmed! Total: ₹{total}')
            return redirect('profile')
    else:
        form = BookingForm()
        # Get selected services/packages from GET parameters
        selected_service_ids = request.GET.getlist('services')
        selected_package_ids = request.GET.getlist('package')
        if not selected_package_ids:
            selected_package_ids = request.GET.getlist('packages')
    
    return render(request, 'main/booking.html', {
        'form': form,
        'services': services,
        'packages': packages,
        'selected_service_ids': selected_service_ids,
        'selected_package_ids': selected_package_ids,
    })


@login_required
def profile_view(request):
    """User profile page"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')

    # Calculate next service due date based on last completed booking and preferred interval
    last_completed = bookings.filter(status='completed').order_by('-preferred_date', '-created_at').first()
    next_due_date = None
    interval_days = 90
    try:
        interval_days = int(request.GET.get('interval', 90))
    except Exception:
        interval_days = 90

    if last_completed and last_completed.preferred_date:
        from datetime import timedelta
        next_due_date = last_completed.preferred_date + timedelta(days=interval_days)
    
    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('profile')
    else:
        form = ProfileForm(instance=profile)
    
    return render(request, 'main/profile.html', {
        'profile': profile,
        'bookings': bookings,
        'form': form,
        'next_due_date': next_due_date,
        'interval_days': interval_days,
    })


@require_http_methods(["POST"])
def contact_view(request):
    """Contact form submission"""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Thank you for your message! We will get back to you soon.')
            return redirect('home')
    
    return redirect('home')


def get_service_data(request):
    """API endpoint to get service/package data for booking"""
    services = list(Service.objects.values('id', 'name', 'price'))
    packages = list(Package.objects.values('id', 'name', 'price'))
    
    return JsonResponse({
        'services': services,
        'packages': packages
    })


def admin_dashboard(request):
    """Custom admin dashboard (staff only)"""
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)

    bookings_today = Booking.objects.filter(created_at__date=today).count()
    bookings_week = Booking.objects.filter(created_at__date__gte=week_ago).count()
    bookings_month = Booking.objects.filter(created_at__date__gte=month_ago).count()
    completed = Booking.objects.filter(status='completed').count()
    ongoing = Booking.objects.filter(status='in_progress').count()
    pending = Booking.objects.filter(status='pending').count()
    total_users = UserProfile.objects.count()
    top_package = Package.objects.annotate(total=Count('bookings')).order_by('-total').first()

    context = {
        'bookings_today': bookings_today,
        'bookings_week': bookings_week,
        'bookings_month': bookings_month,
        'completed': completed,
        'ongoing': ongoing,
        'pending': pending,
        'total_users': total_users,
        'top_service': top_package.name if top_package else 'N/A',
    }
    return render(request, 'main/admin_dashboard.html', context)


def admin_bookings(request):
    bookings = Booking.objects.select_related('user').prefetch_related('services', 'packages').order_by('-created_at')[:200]
    return render(request, 'main/admin_bookings.html', {'bookings': bookings})


def admin_services(request):
    services = Service.objects.all().order_by('name')
    return render(request, 'main/admin_services.html', {'services': services})


def admin_packages(request):
    packages = Package.objects.prefetch_related('services').all().order_by('name')
    return render(request, 'main/admin_packages.html', {'packages': packages})


def admin_users(request):
    User = get_user_model()
    profiles = []
    users = User.objects.all().select_related('profile')
    booking_counts = Booking.objects.values('user_id').annotate(total=Count('id'))
    counts_map = {b['user_id']: b['total'] for b in booking_counts}

    last_service_map = {}
    next_service_map = {}
    for u in users:
        profile, _ = UserProfile.objects.get_or_create(user=u)
        profiles.append(profile)

        last_completed = Booking.objects.filter(user=u, status='completed').order_by('-preferred_date', '-created_at').first()
        if last_completed and last_completed.preferred_date:
            from datetime import timedelta
            interval_days = 90
            last_service_map[u.id] = last_completed.preferred_date
            next_service_map[u.id] = last_completed.preferred_date + timedelta(days=interval_days)
        else:
            last_service_map[u.id] = None
            next_service_map[u.id] = None

    return render(
        request,
        'main/admin_users.html',
        {
            'users': profiles,
            'booking_counts': counts_map,
            'last_service_map': last_service_map,
            'next_service_map': next_service_map,
        },
    )


@staff_member_required(login_url='/login/')
def admin_update_booking_status(request):
    """Update booking status from admin UI (AJAX or form POST)."""
    if request.method != "POST":
        return JsonResponse({'ok': False, 'error': 'Method not allowed'}, status=405)

    booking_id = request.POST.get('booking_id')
    new_status = request.POST.get('status')

    valid_statuses = {choice[0] for choice in Booking.STATUS_CHOICES}
    if not booking_id or new_status not in valid_statuses:
        return JsonResponse({'ok': False, 'error': 'Invalid data'}, status=400)

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return JsonResponse({'ok': False, 'error': 'Booking not found'}, status=404)

    booking.status = new_status
    booking.save(update_fields=['status', 'updated_at'])

    # If non-AJAX form POST, redirect back to admin bookings.
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        return JsonResponse({'ok': True, 'status': booking.status})

    messages.success(request, f"Booking #{booking.id} updated to {booking.get_status_display()}.")
    return redirect('admin_bookings')

