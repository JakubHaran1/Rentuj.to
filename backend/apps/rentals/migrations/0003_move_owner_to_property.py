from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def move_owners(apps, schema_editor):
    Property = apps.get_model("rentals", "Property")
    Listing = apps.get_model("rentals", "Listing")
    database = schema_editor.connection.alias

    for property_obj in Property.objects.using(database).iterator():
        owners = list(
            Listing.objects.using(database)
            .filter(property_id=property_obj.pk)
            .values_list("owner_id", flat=True)
            .distinct()[:2]
        )
        if len(owners) != 1:
            raise RuntimeError(
                f"Cannot determine a single owner for property {property_obj.pk}."
            )
        Property.objects.using(database).filter(pk=property_obj.pk).update(
            owner_id=owners[0]
        )


class Migration(migrations.Migration):
    dependencies = [
        ("rentals", "0002_seed_filters_and_enforce_active_listing"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="owner",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="properties",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.RunPython(move_owners),
        migrations.AlterField(
            model_name="property",
            name="owner",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="properties",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.RemoveField(
            model_name="listing",
            name="owner",
        ),
    ]
