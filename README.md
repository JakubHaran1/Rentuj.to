# Rentuj.to

## Rentals API

`Listing` holds the owner, address, property details, title, price, description,
activation status, filters and photos. There is no separate property model or
property endpoint.

`POST /api/rentals/listings` accepts multipart data: `listing` is a JSON object
with the listing fields, including address and property details; `images` is a
JSON array of `{ "file_key": "...", "is_main": true }` objects, and each
`file_key` names an uploaded file. The authenticated user becomes the owner.
The list endpoint supports the `owner_id` filter.

Photos can also be uploaded to `POST /api/rentals/property-imgs` as multipart
data with `listing`, `img` and `is_main`. The owner may upload up to 10 photos.

Filters use the filter definition's `pk` in both the filter catalog and listing
payloads. For example, send `"filters": [{"pk": 1, "value": 1}]`; listing
responses include the same `pk`, `value` and the read-only filter `name`.
This replaces the previous `id` field in listing filter payloads; API clients
must use `pk` instead.

Migration `0007_merge_property_into_listing` copies property details and owner
to each associated listing, then removes all properties. Properties without
listings are deleted. Listing titles are retained; an empty listing title is
filled from its property's title. Photos and filters remain attached to their
listings. Back up the database before applying this irreversible migration.