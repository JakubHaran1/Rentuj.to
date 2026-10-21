from django.db import migrations, models


def clear_legacy_new_email_values(apps, schema_editor):
    User = apps.get_model("users", "User")
    User.objects.using(schema_editor.connection.alias).filter(
        new_email__in=["false", "true", "False", "True"],
    ).update(new_email=None)


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0012_alter_user_new_email"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="new_email",
            field=models.EmailField(max_length=254, null=True),
        ),
        migrations.RunPython(
            clear_legacy_new_email_values,
            migrations.RunPython.noop,
        ),
    ]
