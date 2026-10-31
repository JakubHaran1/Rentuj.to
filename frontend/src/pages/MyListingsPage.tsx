import type { PropertyListingType } from "../types";
import PropertyBoxes from "../components/common/PropertyBoxes";
import { useEffect, useState } from "react";
import { PropertiesService } from "../services/propertiesService";
import { useUserContext } from "../components/context/UserContext";
import Button from "../components/common/Button";

function MyListingPage() {
  const [properties, setProperties] = useState<PropertyListingType[]>([]);
  const { user } = useUserContext();
  useEffect(() => {
    async function getProperties() {
      const propList = await PropertiesService.getPropertiesList(user?.id);
      console.log(propList);
      setProperties(propList);
    }
    getProperties();
  }, [user?.id]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[#c2c9d2] bg-[#e9edf2] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {properties.length == 0 ? (
          <div>
            <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
              Create a listing
            </h1>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
              Your listings will be here.
            </p>
            <Button className="my-3" to={"/listing-create"}>
              Create a listing
            </Button>
          </div>
        ) : (
          <div className="">
            <h1 className="text-3xl font-semibold text-[#16324f] dark:text-white">
              Manage your rentals
            </h1>
            <p className="mt-2 text-sm text-[#6b7280] dark:text-slate-300">
              This is a place where you can add, edit or delete your rentals
            </p>
          </div>
        )}
      </section>
      <PropertyBoxes boxType="Your listings" boxData={properties} />
    </main>
  );
}

export default MyListingPage;
