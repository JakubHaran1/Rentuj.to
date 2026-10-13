function Map() {
  return (
    <div
      className="map-preview"
      role="img"
      aria-label="Map preview with rental listings"
    >
      <span className="map-road map-road--one" />
      <span className="map-road map-road--two" />
      <span className="map-road map-road--three" />
      <span className="map-label map-label--one">City centre</span>
      <span className="map-label map-label--two">Park</span>
      <span className="map-pin map-pin--one">PLN 3,400</span>
      <span className="map-pin map-pin--two">PLN 2,900</span>
      <span className="map-pin map-pin--three">PLN 3,100</span>
    </div>
  );
}

export default Map;
