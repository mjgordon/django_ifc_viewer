from django.db import models
import uuid


class IfcModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    owner_name = models.CharField(max_length=200)
    model_name = models.CharField(max_length=200)
    # owner -> Check how user ids are stored
    path = models.CharField(max_length=200)

    def __str__(self):
        return self.model_name


class Annotation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    parent_model = models.ForeignKey(IfcModel, on_delete=models.CASCADE)
    # parent_element_id -> Check how elements are referenced once loaded, probably integer
    # owner -> Check how user ids are stored
    text = models.TextField(default="")

    def __str__(self):
        return self.text

