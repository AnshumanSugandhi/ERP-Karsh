from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Warehouse, Category, Product, StockBatch, StockMovement
from .serializers import (
    WarehouseSerializer, CategorySerializer, ProductSerializer, 
    StockBatchSerializer, StockMovementSerializer
)

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class StockBatchViewSet(viewsets.ModelViewSet):
    queryset = StockBatch.objects.all()
    serializer_class = StockBatchSerializer

    @action(detail=False, methods=['get'])
    def near_expiry(self, request):
        """Custom endpoint to fetch only near-expiring stock batches"""
        days = int(request.query_params.get('days', 30))
        batches = StockBatch.objects.near_expiry(days_threshold=days)
        serializer = self.get_serializer(batches, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dead_stock(self, request):
        """Custom endpoint to fetch only dead stock batches"""
        days = int(request.query_params.get('days', 90))
        batches = StockBatch.objects.dead_stock(days_since_creation=days)
        serializer = self.get_serializer(batches, many=True)
        return Response(serializer.data)

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
