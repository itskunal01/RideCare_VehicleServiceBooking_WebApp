from django.core.management.base import BaseCommand
from main.models import Service, Package


class Command(BaseCommand):
    help = 'Populates the database with initial services and packages'

    def handle(self, *args, **options):
        # Create Services
        services_data = [
            {
                'name': 'Engine Oil Change',
                'description': 'Replace engine oil and inspect filter for smoother performance.',
                'price': 499,
                'duration': '30 min'
            },
            {
                'name': 'Chain Cleaning & Lubrication',
                'description': 'Clean, lube, and adjust chain tension for smooth rides.',
                'price': 249,
                'duration': '20 min'
            },
            {
                'name': 'Brake Inspection & Adjustment',
                'description': 'Inspect brake pads, adjust tension, and ensure smooth braking.',
                'price': 299,
                'duration': '25 min'
            },
            {
                'name': 'Spark Plug Cleaning/Replacement',
                'description': 'Check, clean, and replace spark plug for efficient combustion.',
                'price': 199,
                'duration': '15 min'
            },
            {
                'name': 'Battery Check & Top-up',
                'description': 'Test voltage, clean terminals, and refill battery water if needed.',
                'price': 249,
                'duration': '20 min'
            },
            {
                'name': 'Brake Shoe/Pads Replacement',
                'description': 'Replace worn brake shoes or pads for optimal stopping power.',
                'price': 449,
                'duration': '30 min'
            },
            {
                'name': 'Clutch Plate Replacement',
                'description': 'Replace worn clutch plates and springs for smoother gear shifts.',
                'price': 1199,
                'duration': '90 min'
            },
            {
                'name': 'Tyre Replacement (Labour)',
                'description': 'Replace and balance tyres for better grip and handling.',
                'price': 399,
                'duration': '30 min'
            },
            {
                'name': 'Electrical Wiring Check',
                'description': 'Inspect, diagnose, and fix wiring or electrical issues.',
                'price': 499,
                'duration': '45 min'
            },
            {
                'name': 'Full Body Wash',
                'description': 'High-pressure wash and foam cleaning for a spotless finish.',
                'price': 299,
                'duration': '25 min'
            },
        ]

        services = {}
        for data in services_data:
            service, created = Service.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            services[data['name']] = service
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created service: {data["name"]}'))
            else:
                self.stdout.write(f'Service already exists: {data["name"]}')

        # Create Packages
        packages_data = [
            {
                'name': 'Basic Maintenance Package',
                'description': 'Perfect for regular upkeep and smooth daily rides.',
                'price': 999,
                'duration': '60 min',
                'is_recommended': False,
                'badge': 'Starter',
                'service_names': ['Engine Oil Change', 'Chain Cleaning & Lubrication', 'Brake Inspection & Adjustment']
            },
            {
                'name': 'Standard Service Package',
                'description': 'Riders who service every 2–3 months.',
                'price': 1299,
                'duration': '30 min',
                'is_recommended': False,
                'badge': '',
                'service_names': ['Engine Oil Change', 'Battery Check & Top-up', 'Full Body Wash']
            },
            {
                'name': 'Premium Care Package',
                'description': 'Comprehensive maintenance with detailing and tune-up.',
                'price': 1799,
                'duration': '90 min',
                'is_recommended': True,
                'badge': 'Recommended',
                'service_names': ['Engine Oil Change', 'Spark Plug Cleaning/Replacement', 'Chain Cleaning & Lubrication', 'Brake Inspection & Adjustment', 'Full Body Wash', 'Battery Check & Top-up']
            },
            {
                'name': 'Workshop Overhaul',
                'description': 'Full mechanical check and tune-up for top performance.',
                'price': 2499,
                'duration': '2 hrs',
                'is_recommended': False,
                'badge': 'Best Value',
                'service_names': ['Clutch Plate Replacement', 'Brake Shoe/Pads Replacement', 'Electrical Wiring Check', 'Tyre Replacement (Labour)', 'Full Body Wash']
            },
        ]

        for data in packages_data:
            service_names = data.pop('service_names')
            package, created = Package.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            
            # Add services to package
            package_services = [services[name] for name in service_names if name in services]
            package.services.set(package_services)
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created package: {data["name"]}'))
            else:
                self.stdout.write(f'Package already exists: {data["name"]}')

        self.stdout.write(self.style.SUCCESS('\nSuccessfully populated database with services and packages!'))

