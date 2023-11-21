from django.db import models
import uuid

class IfcModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    project_name = models.CharField(max_length=200,default="")
    author_name = models.CharField(max_length=200,default="")

    def __str__(self):
        return self.project_name

class WallElement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    parent_model = models.ForeignKey(IfcModel, on_delete=models.CASCADE)
    express_id = models.IntegerField(default=-1)
    element_name = models.CharField(max_length=200,default="")
    type_name = models.CharField(max_length=200,default="")

    def __str__(self):
        return self.element_name

