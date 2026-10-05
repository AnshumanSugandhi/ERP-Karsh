from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, PurchaseOrderViewSet, PurchaseOrderItemViewSet

router = DefaultRouter()
router.register(r'vendors', VendorViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'po-items', PurchaseOrderItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
