import json
from django.shortcuts import render
from django.conf import settings


def home(request):
    return render(request, "index.html")


def download(request):
    versions_json_path = str(
        settings.BASE_DIR.joinpath("static/versions.json")
        )

    with open(versions_json_path, 'r', encoding='utf-8') as f:
        versions = json.load(f)

    return render(request, "download.html", {
        "android_url": versions.get('android', {}).get('url', "") or "",
        "ios_url": versions.get('ios', {}).get('url', ""),
    })
