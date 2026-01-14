import firebase_admin
from firebase_admin import credentials
from app.settings import BASE_DIR


def get_firebase_app():
    if not firebase_admin._apps:
        cred = credentials.Certificate(
            f"{BASE_DIR.joinpath("secrets")}/church-calendar-5ed23-firebase-adminsdk-fbsvc-b49aebf051.json"
            )
        firebase_admin.initialize_app(cred)

    return firebase_admin.get_app()
