from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("load", views.load_file, name="load"),
    path("unload", views.unload, name="unload"),
    path("models", views.get_model_data, name="models"),
    path("walls", views.get_wall_data, name="walls"),
    path("walls/<str:type_name>/", views.get_wall_data_filtered, name="walls_filtered")
    
]