from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("upload", views.upload, name="upload"),
    path("annotate", views.annotate, name="annotate"),
    path("get_annotations", views.get_annotations, name="get_annotations"),
    path("<str:org_name>/<str:model_name>/", views.model_view, name="model_view"),
    path("<str:org_name>/", views.org_view, name="org_view"),

]