# Generated by Django 4.1 on 2023-09-11 16:43

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viewer', '0010_annotation_author'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotation',
            name='datetime',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2023, 9, 11, 16, 43, 1, 382577, tzinfo=datetime.timezone.utc)),
            preserve_default=False,
        ),
    ]
