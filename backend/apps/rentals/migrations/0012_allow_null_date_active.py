from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("rentals", "0011_alter_propertydetail_date_active"),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                "ALTER TABLE rentals_propertydetail "
                "ALTER COLUMN date_active DROP NOT NULL"
            ),
            reverse_sql=(
                "ALTER TABLE rentals_propertydetail "
                "ALTER COLUMN date_active SET NOT NULL"
            ),
        ),
    ]
