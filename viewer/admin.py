from django.contrib import admin

from .models import IfcModel, Annotation

admin.site.register(IfcModel)
admin.site.register(Annotation)
