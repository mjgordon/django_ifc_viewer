from django.contrib import admin


from .models import IfcModel, WallElement

admin.site.register(IfcModel)
admin.site.register(WallElement)
