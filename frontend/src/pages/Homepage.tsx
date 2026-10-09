import Nav from "../components/Nav";
import Map from "../components/Map";
import Button from "../components/Button";
function Homepage() {
  return (
    <div id="home">
      <section className="grid gap-8 py-12 md:grid-cols-[minmax(0,1fr)_300px] md:items-center md:py-16">
        <div>
          <p className="text-sm font-semibold text-[#2e8b57]">
            Long-term renting, made clearer
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#16324f] sm:text-4xl dark:text-white">
            Find a place that feels like home.
          </h1>
          <p className="mt-4 max-w-xl leading-7 text-[#6b7280] dark:text-slate-300">
            Browse rental listings, talk to landlords and keep the important
            details of your tenancy in one place.
          </p>
        </div>
      </section>
      <Nav />
      <section
        className="mt-14 grid overflow-hidden rounded-xl border border-[#c2c9d2] bg-[#e9edf2] dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[0.8fr_1.2fr]"
        aria-labelledby="nearby-heading"
      >
        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-[#2e8b57]">
            Your next home could be nearby
          </p>
          <h2
            id="nearby-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-[#16324f] dark:text-white"
          >
            Looking around your area?
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#6b7280] dark:text-slate-300">
            Explore available rentals on the map. Use your device location or
            choose an area to start browsing.
          </p>
          <Button>Find rentals near me</Button>
          <p className="mt-3 text-xs text-[#6b7280] dark:text-slate-400">
            Your location is only used with your permission.
          </p>
        </div>
        <Map />
      </section>
    </div>
  );
}

export default Homepage;
