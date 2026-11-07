import { type SelectHTMLAttributes } from "react";

type BuildingTypeProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

function BuildingType({
  error,
  className = "",
  ...BuildingTypeProps
}: BuildingTypeProps) {
  return (
    <label className="block text-sm font-medium text-[#1f2937] dark:text-slate-200">
      Building type
      <select
        className={`mt-1.5 w-full rounded-lg border border-[#c2c9d2] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#2f80ed] focus:ring-2 focus:ring-[#2f80ed]/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white ${className}`}
        {...BuildingTypeProps}
      >
        <option value="DETACHED">Detached house</option>
        <option value="SEMI_DETACHED">Semi-detached house</option>
        <option value="TERRACED">Terraced house</option>
        <option value="APARTMENT_BUILDING">Apartment building</option>
        <option value="BLOCK_OF_FLATS">Block of flats</option>
        <option value="TENEMENT">Tenement building</option>
        <option value="ROOM_IN_SHARED_APARTMENT">
          Room in a shared apartment
        </option>
      </select>
      {error && (
        <span className="mt-1 block text-sm font-normal text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

export default BuildingType;
