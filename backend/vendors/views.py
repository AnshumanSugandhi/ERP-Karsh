from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Vendor, PurchaseOrder, PurchaseOrderItem
from .serializers import VendorSerializer, PurchaseOrderSerializer, PurchaseOrderItemSerializer
import uuid

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer

    def perform_create(self, serializer):
        # Auto-generate PO number if not provided
        po_number = self.request.data.get('po_number')
        if not po_number:
            po_number = f"PO-{uuid.uuid4().hex[:6].upper()}"
        serializer.save(po_number=po_number, created_by=self.request.user if self.request.user.is_authenticated else None)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        po = self.get_object()
        serializer = PurchaseOrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(po=po)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PurchaseOrderItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderItem.objects.all()
    serializer_class = PurchaseOrderItemSerializer
