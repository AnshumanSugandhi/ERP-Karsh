from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WarehouseViewSet, CategoryViewSet, ProductViewSet, 
    StockBatchViewSet, StockMovementViewSet, StorageLocationViewSet
)

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'stock-batches', StockBatchViewSet)
router.register(r'stock-movements', StockMovementViewSet)
router.register(r'storage-locations', StorageLocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

