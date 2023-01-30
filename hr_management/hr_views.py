import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import requests

@method_decorator(csrf_exempt, name='dispatch')
class getServerReport(APIView):

    def get(self, request):
        return Response({"info": "APi services for Hr_view"},status=status.HTTP_200_OK)