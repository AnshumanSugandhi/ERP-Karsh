from django.contrib import admin
from .models import Warehouse, Category, Product, StockBatch, StockMovement

@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'is_active', 'manager')
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

class StockBatchInline(admin.TabularInline):
    model = StockBatch
    extra = 1
    fields = ('batch_number', 'warehouse', 'quantity', 'unit_cost', 'mfd_date', 'expiry_date')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('sku', 'name', 'category', 'base_price', 'net_quantity', 'shelf_life_days')
    search_fields = ('sku', 'name')
    list_filter = ('category',)
    inlines = [StockBatchInline]

@admin.register(StockBatch)
class StockBatchAdmin(admin.ModelAdmin):
    list_display = ('batch_number', 'product', 'warehouse', 'mfd_date', 'expiry_date', 'quantity')
    search_fields = ('batch_number', 'product__name')
    list_filter = ('warehouse', 'expiry_date')

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('movement_type', 'batch', 'quantity', 'source_warehouse', 'destination_warehouse', 'timestamp')
    list_filter = ('movement_type', 'timestamp')
