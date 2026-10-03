from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from django.db.models.functions import Coalesce
from .models import Warehouse, Category, Product, StockBatch, StockMovement, StorageLocation
from .serializers import ( StorageLocationSerializer, StorageLocationTreeSerializer,
    WarehouseSerializer, CategorySerializer, ProductSerializer, 
    StockBatchSerializer, StockMovementSerializer
)

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

    @action(detail=True, methods=['get'])
    def layout_tree(self, request, pk=None):
        warehouse = self.get_object()
        root_locations = StorageLocation.objects.filter(warehouse=warehouse, parent__isnull=True)
        serializer = StorageLocationTreeSerializer(root_locations, many=True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    # Annotate total stock by summing the quantity of all related stock batches
    queryset = Product.objects.annotate(
        total_stock=Coalesce(Sum('batches__quantity'), 0)
    )
    serializer_class = ProductSerializer

class StockBatchViewSet(viewsets.ModelViewSet):
    queryset = StockBatch.objects.all()
    serializer_class = StockBatchSerializer

    def get_queryset(self):
        queryset = StockBatch.objects.all()
        location_id = self.request.query_params.get('location')
        if location_id:
            queryset = queryset.filter(location_id=location_id)
        return queryset

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

class StorageLocationViewSet(viewsets.ModelViewSet):
    queryset = StorageLocation.objects.all()
    serializer_class = StorageLocationSerializer


