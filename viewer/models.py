from django.db import models
import uuid




class IfcModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    owner_organisation = models.ForeignKey('profiles.Organisation',on_delete=models.CASCADE, null=True)
    model_name = models.CharField(max_length=200)
    display_name = models.CharField(max_length=200,default="")
    # owner -> Check how user ids are stored
    path = models.CharField(max_length=200)

    def __str__(self):
        return self.display_name


class Annotation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    parent_model = models.ForeignKey(IfcModel, on_delete=models.CASCADE)
    express_id = models.IntegerField(default=-1)
    # parent_element_id -> Check how elements are referenced once loaded, probably integer
    # owner -> Check how user ids are stored
    text = models.TextField(default="")

    def __str__(self):
        return self.text

