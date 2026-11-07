import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import type { GalleryImage } from "../components/imgGallery/imgTypes";
import type { CreateFormStateType, GeoApiResponseType } from "../types";

import { RentalService } from "../services/RentalService";
import { GeoService } from "../services/geoService";
import CreateListingForm from "../components/createListings/CreateListingForm";
function CreateListing() {
  const [fieldState, setFieldState] = useState("");
  const [fieldSuggestion, setFieldSuggestion] = useState<string[]>([]);

  const cityRef = useRef<HTMLDivElement>(null);
  const streetRef = useRef<HTMLDivElement>(null);

  const [imgs, setImgs] = useState<GalleryImage[]>([]);
  const [croppedImgs, setCroppedImgs] = useState<GalleryImage[]>([]);

  const formCreate = useForm<CreateFormStateType>({
    defaultValues: {
      address: "",
      description: "",
      number_of_levels: 0,
      number_of_rooms: 0,
      square_meters: 0,
      price: 0,
      building_type: "APARTMENT_BUILDING",
      date_active: "",
      filters: [],
      property: {
        title: "",
        city: "",
        street: "",
        home_number: 0,
        floor_number: 0,
      },
    },
  });
  const resetCreateForm = () => {
    formCreate.reset();
    setFieldState("");
    setFieldSuggestion([]);
    setImgs([]);
    setCroppedImgs([]);
  };
  const onSubmitCreate = async (data: CreateFormStateType) => {
    setFieldSuggestion([]);

    const apartmentPhotos = imgs
      .map(
        (image) =>
          croppedImgs.find((croppedImage) => croppedImage.id === image.id) ??
          image,
      )
      .map((image) => image.file)
      .filter((file) => file.size > 0);

    const { city, street, home_number } = data.property;
    const coordinates_data = await GeoService.geocoding<GeoApiResponseType[]>(
      city,
      street,
      home_number,
    );

    const locations = coordinates_data.map(
      ({ properties: { address_line1, formatted, lat, lon } }) => ({
        address_line1,
        formatted,
        lat: String(lat),
        lon: String(lon),
      }),
    );

    const coordinate = locations.length === 1 ? locations[0] : undefined;
    const dataToSend = {
      ...data,
      date_active: data.date_active || null,
      latitude: coordinate ? Number(coordinate.lat) : null,
      longitude: coordinate ? Number(coordinate.lon) : null,
      apartment_photos: apartmentPhotos,
    };

    await RentalService.createPropertyItem(dataToSend);
    resetCreateForm();
  };

  useEffect(() => {
    const closeSuggestionList = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) return;
      if (
        !cityRef.current?.contains(e.target) &&
        !streetRef.current?.contains(e.target)
      ) {
        setFieldState("");
        setFieldSuggestion([]);
      }
    };
    document.addEventListener("click", closeSuggestionList);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
            Create a listing
          </h1>
          <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
            Add the property details that will be shown in your listing.
          </p>
        </div>
        <CreateListingForm
          formCreate={formCreate}
          cityRef={cityRef}
          streetRef={streetRef}
          fieldState={fieldState}
          setFieldState={setFieldState}
          fieldSuggestion={fieldSuggestion}
          setFieldSuggestion={setFieldSuggestion}
          imgs={imgs}
          setImgs={setImgs}
          croppedImgs={croppedImgs}
          setCroppedImgs={setCroppedImgs}
          onSubmitCreate={onSubmitCreate}
        />
      </section>
    </main>
  );
}

export default CreateListing;
