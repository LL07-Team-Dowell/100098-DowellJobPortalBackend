import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status


def verify_user_token(view_func):
    def wrapper(self, request, *args, **kwargs):
        authorization = request.META.get("HTTP_AUTHORIZATION")
        if authorization is None:
            return Response(
                {"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            token = authorization.replace("Bearer", "").strip()
            user = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms="HS256",
                options={"verify_signature": False},
            )
        except jwt.ExpiredSignatureError:
            return Response(
                {"message": "Token has expired"}, status=status.HTTP_403_FORBIDDEN
            )
        except jwt.DecodeError:
            return Response({"message": "Invalid token"}, status=status.HTTP_403_FORBIDDEN)
        return view_func(self, request, user, *args, **kwargs)
    return wrapper


def sign_token(user):
    try:
        payload = {
            **user,
            "exp": int(
                (
                    datetime.now()
                    + timedelta(hours=settings.JWT_CONF["TOKEN_LIFETIME_HOURS"])
                ).timestamp()
            ),
            "iat": datetime.now().timestamp(),
        }
        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        return Response({"access_token": jwt_token}, status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            "failed to get auth credentials", status.HTTP_500_INTERNAL_SERVER_ERROR
        )