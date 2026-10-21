from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0014_alter_user_new_email"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="new_email_request",
        ),
    ]
