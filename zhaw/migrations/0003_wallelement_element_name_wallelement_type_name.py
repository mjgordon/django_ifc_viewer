# Generated by Django 4.1 on 2023-11-20 22:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zhaw', '0002_ifcmodel_author_name_ifcmodel_project_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='wallelement',
            name='element_name',
            field=models.CharField(default='', max_length=200),
        ),
        migrations.AddField(
            model_name='wallelement',
            name='type_name',
            field=models.CharField(default='', max_length=200),
        ),
    ]