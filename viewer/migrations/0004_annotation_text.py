# Generated by Django 4.1 on 2023-09-04 21:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('viewer', '0003_alter_annotation_id_alter_ifcmodel_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotation',
            name='text',
            field=models.TextField(default=''),
        ),
    ]