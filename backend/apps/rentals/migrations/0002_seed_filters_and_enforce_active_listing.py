from django.db import migrations


FILTER_NAMES = [
    "Pets allowed",
    "Furnished",
    "Parking",
    "Balcony",
    "Garden",
    "Elevator",
    "Internet",
    "Utilities included",
    "No agency fee",
    "Children welcome",
    "Remote work friendly",
    "Verified landlord",
    "Private landlord",
    "Air conditioning",
    "Dishwasher",
    "Washing machine",
    "Storage room",
    "Bike storage",
    "Near public transport",
    "Smoke free",
]


def create_filter_names(apps, schema_editor):
    PropertyFilterName = apps.get_model("rentals", "PropertyFilterName")
    PropertyFilterName.objects.using(schema_editor.connection.alias).bulk_create(
        [PropertyFilterName(name=name) for name in FILTER_NAMES],
        ignore_conflicts=True,
    )


FORWARD_SQL = """
CREATE FUNCTION rentals_check_active_listing(property_pk bigint) RETURNS void AS $$
BEGIN
    PERFORM 1 FROM rentals_property WHERE id = property_pk FOR UPDATE;
    IF FOUND AND EXISTS (
        SELECT 1 FROM rentals_listing WHERE property_id = property_pk
    ) AND NOT EXISTS (
        SELECT 1 FROM rentals_listing
        WHERE property_id = property_pk AND is_active
    ) THEN
        RAISE EXCEPTION 'Property % with listings must have an active listing', property_pk
            USING ERRCODE = '23514', CONSTRAINT = 'property_requires_active_listing';
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION rentals_enforce_active_listing() RETURNS trigger AS $$
BEGIN
    IF TG_TABLE_NAME = 'rentals_property' THEN
        PERFORM rentals_check_active_listing(NEW.id);
    ELSE
        IF TG_OP <> 'INSERT' THEN
            PERFORM rentals_check_active_listing(OLD.property_id);
        END IF;
        IF TG_OP <> 'DELETE' THEN
            PERFORM rentals_check_active_listing(NEW.property_id);
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER rentals_property_active_listing
AFTER INSERT ON rentals_property DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION rentals_enforce_active_listing();

CREATE CONSTRAINT TRIGGER rentals_listing_active_listing
AFTER INSERT OR UPDATE OR DELETE ON rentals_listing
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION rentals_enforce_active_listing();
"""

REVERSE_SQL = """
DROP TRIGGER rentals_listing_active_listing ON rentals_listing;
DROP TRIGGER rentals_property_active_listing ON rentals_property;
DROP FUNCTION rentals_enforce_active_listing();
DROP FUNCTION rentals_check_active_listing(bigint);
"""


class Migration(migrations.Migration):
    dependencies = [
        ("rentals", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_filter_names, migrations.RunPython.noop),
        migrations.RunSQL(FORWARD_SQL, REVERSE_SQL),
    ]
