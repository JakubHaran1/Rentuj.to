from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("rentals", "0009_remove_rentalfilter_value_propertyfilter_and_more"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                INSERT INTO rentals_propertyfilter
                    (property_details_id, rental_filter_id, value)
                SELECT propertydetail_id, rentalfilter_id, 1
                FROM rentals_propertydetail_filters
                ON CONFLICT (property_details_id, rental_filter_id) DO NOTHING
            """,
            reverse_sql="""
                DELETE FROM rentals_propertyfilter
                WHERE value = 1
            """,
        ),
    ]
