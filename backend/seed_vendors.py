import os, sys, django, uuid
sys.path.append('d:/CODE/K.A.R.S.H/ERP/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_core.settings')
django.setup()

from vendors.models import Vendor, PurchaseOrder, PurchaseOrderItem
from inventory.models import Product

Vendor.objects.all().delete()
v1 = Vendor.objects.create(name='Global Cosmetics Supply Co.', contact_email='sales@globalcosmetics.com', contact_phone='+1-555-0100', lead_time_days=14, reliability_rating=4.8)
v2 = Vendor.objects.create(name='Luxe Ingredients Ltd.', contact_email='orders@luxe-ingredients.com', contact_phone='+44-20-1234-5678', lead_time_days=21, reliability_rating=4.5)
v3 = Vendor.objects.create(name='EcoPackaging Solutions', contact_email='hello@ecopack.net', contact_phone='+1-555-0299', lead_time_days=7, reliability_rating=4.9)

products = list(Product.objects.all()[:3])
if products:
    po1 = PurchaseOrder.objects.create(vendor=v1, status='SENT', po_number='PO-'+uuid.uuid4().hex[:6].upper())
    PurchaseOrderItem.objects.create(po=po1, product=products[0], ordered_quantity=5000, unit_price=2.50)
    
    if len(products) > 1:
        po2 = PurchaseOrder.objects.create(vendor=v2, status='DRAFT', po_number='PO-'+uuid.uuid4().hex[:6].upper())
        PurchaseOrderItem.objects.create(po=po2, product=products[1], ordered_quantity=1000, unit_price=12.00)

print('Mock vendors and POs created successfully!')
