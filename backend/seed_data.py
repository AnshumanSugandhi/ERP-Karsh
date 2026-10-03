import os
import django
from datetime import timedelta
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_core.settings')
django.setup()

from inventory.models import Category, Warehouse, Product, StockBatch, StockMovement
from django.contrib.auth import get_user_model

def seed():
    User = get_user_model()
    admin_user = User.objects.first()

    print("Cleaning old dummy stock data...")
    StockMovement.objects.all().delete()
    StockBatch.objects.all().delete()

    print("Creating Categories...")
    cat_fmcg, _ = Category.objects.get_or_create(name='FMCG', description='Fast Moving Consumer Goods')
    cat_elec, _ = Category.objects.get_or_create(name='Electronics', description='Electronic Devices')

    print("Creating Warehouses...")
    wh_central, _ = Warehouse.objects.get_or_create(name='Central Hub', location='Mumbai', manager=admin_user)
    wh_store, _ = Warehouse.objects.get_or_create(name='Retail Store A', location='Pune')

    print("Creating Products...")
    prod_milk, _ = Product.objects.get_or_create(
        sku='MILK-001', name='Organic Milk 1L', category=cat_fmcg,
        base_price=80.00, shelf_life_days=7, safety_stock_level=50
    )
    prod_laptop, _ = Product.objects.get_or_create(
        sku='LAP-101', name='Pro Laptop 15"', category=cat_elec,
        base_price=75000.00, shelf_life_days=3650, safety_stock_level=10
    )

    today = timezone.now().date()

    print("Simulating GRN (Goods Received Note)...")
    # Fresh Milk arrives at Central Hub
    batch_milk_fresh = StockBatch.objects.create(
        product=prod_milk, warehouse=wh_central, batch_number='BATCH-FRESH-001',
        mfd_date=today, expiry_date=today + timedelta(days=prod_milk.shelf_life_days),
        quantity=200, unit_cost=60.00
    )
    StockMovement.objects.create(
        batch=batch_milk_fresh, destination_warehouse=wh_central, movement_type='GRN',
        quantity=200, user=admin_user, reason_code="Initial Supplier Delivery"
    )

    print("Simulating Internal Transfer...")
    # Transfer 50 Milk cartons from Central to Store A
    StockMovement.objects.create(
        batch=batch_milk_fresh, source_warehouse=wh_central, destination_warehouse=wh_store,
        movement_type='TRANSFER', quantity=50, user=admin_user, reason_code="Restocking Store A"
    )
    
    # Update quantities manually (In the real app, we will use Django Signals to automate this math)
    batch_milk_fresh.quantity = 150
    batch_milk_fresh.save()
    StockBatch.objects.create(
        product=prod_milk, warehouse=wh_store, batch_number='BATCH-FRESH-001-STORE-A',
        mfd_date=today, expiry_date=today + timedelta(days=prod_milk.shelf_life_days),
        quantity=50, unit_cost=60.00
    )

    print("Simulating Dead/Expired Stock for Alerts...")
    # Old batch of milk that expired a week ago
    batch_expired = StockBatch.objects.create(
        product=prod_milk, warehouse=wh_central, batch_number='BATCH-OLD-999',
        mfd_date=today - timedelta(days=30), expiry_date=today - timedelta(days=23),
        quantity=20, unit_cost=60.00
    )
    # Manually hack the created_at date in the DB to make it look like 'Dead Stock' (sat untouched for 100 days)
    StockBatch.objects.filter(id=batch_expired.id).update(created_at=timezone.now() - timedelta(days=100))

    print("Seeding Complete!")

if __name__ == '__main__':
    seed()
