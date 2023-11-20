from django.db import models
import uuid


class IfcModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    owner_organisation = models.ForeignKey('profiles.Organisation',on_delete=models.CASCADE, null=True)
    model_name = models.CharField(max_length=200)
    display_name = models.CharField(max_length=200,default="")
    path = models.CharField(max_length=200)

    def __str__(self):
        return self.display_name


class Annotation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    parent_model = models.ForeignKey(IfcModel, on_delete=models.CASCADE)
    express_id = models.IntegerField(default=-1)
    author = models.ForeignKey('profiles.Profile',on_delete=models.CASCADE, null=True)
    datetime = models.DateTimeField(auto_now_add=True)
    center_x = models.FloatField(default=0)
    center_y = models.FloatField(default=0)
    center_z = models.FloatField(default=0)
    
    text = models.TextField(default="")

    def __str__(self):
        return self.text
