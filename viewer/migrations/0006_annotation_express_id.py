# Generated by Django 4.1 on 2023-09-09 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viewer', '0005_rename_name_ifcmodel_model_name_ifcmodel_owner_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotation',
            name='express_id',
            field=models.IntegerField(default=-1),
        ),
    ]