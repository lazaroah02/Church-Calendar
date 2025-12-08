from django.shortcuts import render
from django.conf import settings


def home(request):
    return render(request, "index.html")


def download(request):
    return render(request, "download.html", {
        "android_url": settings.ANDROID_DOWNLOAD_URL,
        "ios_url": settings.IOS_DOWNLOAD_URL,
    })
