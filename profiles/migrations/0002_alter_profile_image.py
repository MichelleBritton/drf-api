# Generated by Django 3.2.23 on 2024-02-19 14:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.ImageField(default='../samples/default_profile_ycpbtt', upload_to='images/'),
        ),
    ]