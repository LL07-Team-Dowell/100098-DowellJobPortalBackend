from .imports import *


# api for job portal begins here---------------------------
@method_decorator(csrf_exempt, name="dispatch")
class serverStatus(APIView):
    def get(self, request):
        return Response(
            {"info": "Welcome to Dowell-Job-Portal-Version 2.0"},
            status=status.HTTP_200_OK,
        )
# api for job portal ends here--------------------------------

from .imports import *
# authorization api----------------------------------------
@method_decorator(csrf_exempt, name="dispatch")
class auth(APIView):
    """get jwt token for authorization"""

    def post(self, request):
        # print(request.data.get("company_id"))
        if not validate_id(request.data.get("company_id")):
            return Response("something went wrong ok!", status.HTTP_400_BAD_REQUEST)
        user = {
            "username": request.data.get("username"),
            "portfolio": request.data.get("portfolio"),
            "data_type": request.data.get("data_type"),
            "company_id": request.data.get("company_id"),
        }
        return sign_token(user)
# authorization ends here-----------------------------------
