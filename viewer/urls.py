from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:owner_name>/<str:model_name>/", views.model_view, name="model_view"),
    path("<str:owner_name>/", views.owner_view, name="owner_view"),
    path("upload", views.upload, name="upload"),
]