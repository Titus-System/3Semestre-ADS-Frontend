import React, { useState, useEffect, useCallback } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import { feature } from "topojson-client";

import countries from "../assets/countries.json";

export default function MapaMundi() {
    const [geographies, setGeographies] = useState<any[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);


    useEffect(() => {
        const geoFeatures = feature(countries, countries.objects.countries).features;
        setGeographies(geoFeatures);
    }, []);


    return (
        <div className="p-16">
            <h1 className="text-3xl font-bold mb-6">Selecione um País</h1>

            <div
                id="map-container"
                className="flex flex-col items-center p-4 rounded-lg shadow-lg mx-auto"
                style={{ userSelect: "none" }}
            >

                <ComposableMap
                    projectionConfig={{ }}
                    width={980}
                    height={551}
                    className="cursor-pointer"
                >
                    <Geographies geography={geographies}>
                        {({ geographies }: any) =>
                            geographies.map((geo: any) => {
                                const isSelected = selectedCountry === geo.properties.name;
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onClick={() => setSelectedCountry(geo.properties.name)}
                                        style={{
                                            default: {
                                                fill: isSelected ? " #2563EB" : " #93C5FD",
                                                outline: "none",
                                                stroke: " #1E40AF",
                                                strokeWidth: 0.5,
                                                transition: "all 0.2s",
                                            },
                                            hover: {
                                                fill: " #3B82F6",
                                                outline: "none",
                                                cursor: "pointer",
                                            },
                                            pressed: {
                                                fill: " #1E40AF",
                                                outline: "none",
                                            },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ComposableMap>

                {selectedCountry && (
                    <p className="mt-6 text-xl font-semibold text-blue-700">
                        País selecionado: {selectedCountry}
                    </p>
                )}
            </div>
        </div>
    );
}
