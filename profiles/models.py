from django.contrib.auth.models import User
from django.db import models

import uuid


class Organisation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=50)
    url_name = models.CharField(max_length=50, default="")

    def __str__(self):
        return self.name


class Profile(models.Model):
    ROLE_VIEWER = "rv"
    ROLE_EDITOR = "re"
    ROLE_ORG_ADMIN = "ra"

    ROLE_CHOICES = [
        (ROLE_VIEWER, "Viewer"),
        (ROLE_EDITOR, "Editor"),
        (ROLE_ORG_ADMIN, "Organisation Admin"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    role = models.CharField(max_length=2, choices=ROLE_CHOICES, default=ROLE_VIEWER)


