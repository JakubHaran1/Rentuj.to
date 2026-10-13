const recentlyViewed = [
  {
    location: "Warsaw · Mokotów",
    title: "Bright apartment near the metro",
    details: "2 rooms · 48 m² · available now",
    price: "PLN 3,400",
    imageClass: "listing-cover--one",
  },
  {
    location: "Kraków · Podgórze",
    title: "Quiet apartment with a balcony",
    details: "2 rooms · 52 m² · available November 1",
    price: "PLN 3,100",
    imageClass: "listing-cover--two",
  },
  {
    location: "Wrocław · Śródmieście",
    title: "Well-located studio",
    details: "1 room · 31 m² · available now",
    price: "PLN 2,500",
    imageClass: "listing-cover--three",
  },
];
function RecentlyViewed() {
  return (
    <section className="mt-14" aria-labelledby="recent-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="recent-heading"
            className="text-xl font-semibold text-[#16324f] dark:text-white"
          >
            Recently viewed
          </h2>
          <p className="mt-1 text-sm text-[#6b7280] dark:text-slate-400">
            Pick up where you left off.
          </p>
        </div>
        <a
          className="text-sm font-semibold text-[#2f80ed] hover:underline"
          href="#recently-viewed"
        >
          View all
        </a>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentlyViewed.map((listing) => (
          <article
            className="overflow-hidden rounded-xl border border-[#c2c9d2] bg-[#e9edf2] dark:border-slate-800 dark:bg-slate-900"
            key={listing.title}
          >
            <div className={`listing-cover ${listing.imageClass}`}>
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-[#16324f]">
                {listing.location}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#16324f] dark:text-white">
                {listing.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#6b7280] dark:text-slate-400">
                {listing.details}
              </p>
              <p className="mt-4 text-sm font-semibold text-[#1f2937] dark:text-slate-100">
                {listing.price}
                <span className="font-normal text-[#6b7280] dark:text-slate-400">
                  {" "}
                  / month
                </span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewed;
