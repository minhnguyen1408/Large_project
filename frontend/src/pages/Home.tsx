import { useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { Card } from "../components/Card";
import { LocationDetail } from "../components/LocationDetail";
import Dashboard from "./Dashboard";

import type { LocationSchemaType } from "@xhoantran/common";
import { useListLocation } from "../api/list";
import useDebounce from "../utils/useDebounce";

interface IPoint extends LocationSchemaType {
  lat: number;
  lng: number;
  _id: string; // Define _id property
}

const transformLocation = (location: LocationSchemaType): IPoint => {
  const {
    location: { coordinates },
  } = location;

  return {
    ...location,
    lat: coordinates[1],
    lng: coordinates[0],
  };
};

export default function Home() {
  const [selectedPoint, setSelectedPoint] = useState<LocationSchemaType | null>(
    null
  );
  const [pov, setPov] = useState({
    lat: 0,
    lng: 0,
    altitude: 2.5,
  });
  const povDebounced = useDebounce(pov, 100);
  const [prevPov, setPrevPov] = useState(pov);
  const globeRef = useRef<GlobeMethods | undefined>();

  const listLocation = useListLocation({
    long: povDebounced.lng,
    lat: povDebounced.lat,
    config: {
      enabled: !selectedPoint,
    },
  });

  const transformedData = listLocation.data?.map(transformLocation) || [];

  const onSelectedLocation = (location: LocationSchemaType) => {
    setSelectedPoint(location);
    setPrevPov(pov);
    globeRef.current?.pointOfView(
      {
        lat: ((location.location.coordinates[1] - 2 + 90) % 180) - 90,
        lng: ((location.location.coordinates[0] + 8 + 180) % 360) - 180,
        altitude: 0.75,
      },
      1000
    );
  };

  const onDeselectLocation = () => {
    setSelectedPoint(null);
    globeRef.current?.pointOfView(prevPov, 1000);
  };

  return (
    <>
      <Dashboard
        onSelectedLocation={(location) => onSelectedLocation(location)}
      >
        <div className="relative h-full w-full overflow-hidden">
          {/* Removed transition mobile code */}

          {/* Static sidebar for desktop */}
          <div className="hidden lg:absolute lg:inset-y-0 lg:z-40 lg:flex lg:w-96 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 py-4">
              <div className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  {selectedPoint ? (
                    <LocationDetail
                      id={selectedPoint._id}
                      onClickBack={() => onDeselectLocation()}
                    />
                  ) : (
                    <>
                      {transformedData.map((point, index) => (
                        <Card
                          onClick={() => onSelectedLocation(point)}
                          key={index}
                          location={point}
                        />
                      ))}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:pl-96">
            <main>
              <div className="px-4 sm:px-6 lg:px-8 flex justify-center items-center">
                <Globe
                  ref={globeRef}
                  pointsData={selectedPoint ? [transformLocation(selectedPoint)] : transformedData}
                  onPointClick={(point) =>
                    onSelectedLocation(point as LocationSchemaType)
                  }
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                  backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                  onZoom={(newPov) => setPov(newPov)}
                  pointAltitude={(point) =>
                    // @ts-expect-error _id is in LocationSchemaType
                    point._id === selectedPoint?._id ? 0.3 : 0.1
                  }
                  pointColor={(point) =>
                    // @ts-expect-error _id is in LocationSchemaType
                    point._id === selectedPoint?._id ? "red" : "#ffffaa"
                  }
                />
              </div>
            </main>
          </div>
        </div>
      </Dashboard>
    </>
  );
}
