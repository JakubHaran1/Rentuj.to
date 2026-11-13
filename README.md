# Rentuj.to

## Rentals API

`Property` holds the address and technical attributes shared by its listings.
`Listing` holds the owner, title, price, description, activation status, filters
and photos. A property can have multiple listings; if it has listings, exactly one has
`is_active: true`. `date_active` is independent of this status. An empty listing
title is displayed using the property's title.

`POST /api/rentals/listings` accepts listing fields and a nested `property`
object to create both. To create another listing for an existing property,
send `property_id` instead; the authenticated user must already own a listing
for it. A new listing is active by default; activating a listing automatically
deactivates the previous one. Send `is_active: false` to create an inactive
listing for an existing property. `PATCH /api/rentals/listings/{id}` may update a
nested `property`; those changes affect all listings for that property.
An active listing cannot be deactivated directly, or deleted while other listings
exist: activate another listing first. Deleting the last active listing leaves
its property in the database, but the property is hidden from the public
properties endpoint. Deleting an inactive listing leaves the property unchanged.
The current API permits adding a listing to an existing property only if the
user already owns one of its listings, so a property with no listings cannot
yet be reused through the API.
PostgreSQL deferred constraint triggers enforce the requirement at transaction
commit, including for changes outside the API.

Photos are uploaded separately to `POST /api/rentals/property-imgs` as
multipart data with `listing`, `img` and `is_main`. The listing owner may
upload up to 10 photos. The frontend currently creates a new property for
every listing; choosing an existing property is available through the API only.

Filters use the filter definition's `pk` in both the filter catalog and listing
payloads. For example, send `"filters": [{"pk": 1, "value": 1}]`; listing
responses include the same `pk`, `value` and the read-only filter `name`.
This replaces the previous `id` field in listing filter payloads; API clients
must use `pk` instead.

Migration `0014_listings` transfers existing property details, photos and filter
assignments. It stops if a property has no details, because its technical data
cannot be inferred. The legacy, superseded many-to-many filter table is removed
after assignments have been copied by earlier migrations. Back up the database
before migrating; a downgrade cannot safely represent multiple listings per
property.

Migration `0015_require_active_listing` requires every existing property to
already have an active listing and fails without changing data otherwise.
Migration `0016_allow_property_without_listings` permits properties without
listings while retaining the active-listing requirement for properties with listings.