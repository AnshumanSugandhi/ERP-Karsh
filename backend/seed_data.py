import os
import django
import urllib.request
from datetime import timedelta
from django.utils import timezone
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_core.settings')
django.setup()

from inventory.models import Category, Warehouse, Product, StockBatch, StockMovement
from django.contrib.auth import get_user_model

def download_image(url, filename):
    try:
        response = urllib.request.urlopen(url)
        return ContentFile(response.read(), name=filename)
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def seed():
    User = get_user_model()
    admin_user = User.objects.first()

    print("Cleaning old dummy stock data...")
    StockMovement.objects.all().delete()
    StockBatch.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    Warehouse.objects.all().delete()

    print("Creating Cosmetics Categories...")
    cat_skin = Category.objects.create(name='Skincare', description='Lotions, serums, and creams')
    cat_makeup = Category.objects.create(name='Makeup', description='Foundations, lipsticks, blushes')
    cat_fragrance = Category.objects.create(name='Fragrance', description='Perfumes and colognes')

    print("Creating Warehouses...")
    wh_main = Warehouse.objects.create(name='Central Cosmetics Hub', location='Paris', manager=admin_user)
    wh_retail = Warehouse.objects.create(name='Boutique Store A', location='London')

    print("Creating Cosmetics Products with Images...")
    # Product 1: Serum
    p1 = Product.objects.create(
        sku='SKIN-GLOW-01', name='Radiance Vitamin C Serum', category=cat_skin,
        base_price=1200.00, shelf_life_days=365, safety_stock_level=50, hsn_code='330499'
    )
    p1_img = download_image('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', 'serum.jpg')
    if p1_img: p1.image.save('serum.jpg', p1_img)

    # Product 2: Lipstick
    p2 = Product.objects.create(
        sku='MAKE-LIP-RED', name='Velvet Matte Lipstick (Ruby)', category=cat_makeup,
        base_price=850.00, shelf_life_days=730, safety_stock_level=100, hsn_code='330410'
    )
    p2_img = download_image('https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80', 'lipstick.jpg')
    if p2_img: p2.image.save('lipstick.jpg', p2_img)

    # Product 3: Perfume
    p3 = Product.objects.create(
        sku='FRAG-EAU-100', name='Eau De Parfum - Midnight Bloom', category=cat_fragrance,
        base_price=4500.00, shelf_life_days=1095, safety_stock_level=20, hsn_code='330300'
    )
    p3_img = download_image('https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80', 'perfume.jpg')
    if p3_img: p3.image.save('perfume.jpg', p3_img)

    today = timezone.now().date()

    print("Simulating Active Stock (GRN) for all products so Net Qty > 0...")
    # Batch for Serum
    b1 = StockBatch.objects.create(
        product=p1, warehouse=wh_main, batch_number='B-SERUM-001',
        mfd_date=today - timedelta(days=10), expiry_date=today + timedelta(days=355),
        quantity=300, unit_cost=400.00
    )
    StockMovement.objects.create(batch=b1, destination_warehouse=wh_main, movement_type='GRN', quantity=300, user=admin_user)

    # Batch for Lipstick (Some transferred to retail)
    b2 = StockBatch.objects.create(
        product=p2, warehouse=wh_main, batch_number='B-LIP-001',
        mfd_date=today, expiry_date=today + timedelta(days=730),
        quantity=150, unit_cost=250.00
    )
    StockMovement.objects.create(batch=b2, destination_warehouse=wh_main, movement_type='GRN', quantity=150, user=admin_user)
    
    # Batch for Perfume
    b3 = StockBatch.objects.create(
        product=p3, warehouse=wh_retail, batch_number='B-PERF-001',
        mfd_date=today - timedelta(days=5), expiry_date=today + timedelta(days=1090),
        quantity=45, unit_cost=1500.00
    )
    StockMovement.objects.create(batch=b3, destination_warehouse=wh_retail, movement_type='GRN', quantity=45, user=admin_user)

    print("Simulating Alerts (Near Expiry & Dead Stock)...")
    # Expiring Soon Serum
    b1_exp = StockBatch.objects.create(
        product=p1, warehouse=wh_retail, batch_number='B-SERUM-OLD-09',
        mfd_date=today - timedelta(days=350), expiry_date=today + timedelta(days=15),
        quantity=12, unit_cost=400.00
    )
    
    # Dead Stock Lipstick
    b2_dead = StockBatch.objects.create(
        product=p2, warehouse=wh_main, batch_number='B-LIP-DEAD-01',
        mfd_date=today - timedelta(days=400), expiry_date=today + timedelta(days=330),
        quantity=80, unit_cost=250.00
    )
    StockBatch.objects.filter(id=b2_dead.id).update(created_at=timezone.now() - timedelta(days=120)) # Force old creation date

    print("Cosmetics Dummy Data Seeded Successfully!")

if __name__ == '__main__':
    seed()
