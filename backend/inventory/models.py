from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class Warehouse(models.Model):
    name = models.CharField(max_length=255)
    location = models.TextField()
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    sku = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True, help_text="Product image for e-commerce")
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    hsn_code = models.CharField(max_length=50, blank=True)
    shelf_life_days = models.PositiveIntegerField(help_text="Expected shelf life in days")
    safety_stock_level = models.PositiveIntegerField(default=10)
    
    def __str__(self):
        return f"{self.sku} - {self.name}"

class StockBatchManager(models.Manager):
    def near_expiry(self, days_threshold=30):
        """Returns batches that are expiring within the given days and still have stock."""
        threshold_date = timezone.now().date() + timedelta(days=days_threshold)
        return self.filter(expiry_date__lte=threshold_date, quantity__gt=0)
        
    def dead_stock(self, days_since_creation=90):
        """Returns batches that have sat for X days without moving (simplified dead stock logic)."""
        threshold = timezone.now() - timedelta(days=days_since_creation)
        return self.filter(created_at__lte=threshold, quantity__gt=0)

class StockBatch(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='batches')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    batch_number = models.CharField(max_length=100, unique=True)
    mfd_date = models.DateField(help_text="Manufacturing Date")
    expiry_date = models.DateField(help_text="Expiry Date")
    quantity = models.PositiveIntegerField(default=0)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = StockBatchManager()

    def __str__(self):
        return f"{self.batch_number} ({self.product.name})"

class StockMovement(models.Model):
    MOVEMENT_TYPES = (
        ('GRN', 'Goods Received Note'),
        ('TRANSFER', 'Transfer'),
        ('SCRAP', 'Scrap'),
        ('DISPATCH', 'Dispatch')
    )
    batch = models.ForeignKey(StockBatch, on_delete=models.CASCADE)
    source_warehouse = models.ForeignKey(Warehouse, related_name='outbound_movements', on_delete=models.SET_NULL, null=True, blank=True)
    destination_warehouse = models.ForeignKey(Warehouse, related_name='inbound_movements', on_delete=models.SET_NULL, null=True, blank=True)
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity = models.PositiveIntegerField()
    reason_code = models.CharField(max_length=255, blank=True, help_text="Required for scrap or adjustments")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.movement_type} - {self.batch.batch_number} ({self.quantity})"
