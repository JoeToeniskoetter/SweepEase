import type { ChangeEvent } from "react";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
interface AddressInfo {
  streetNumber: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  zipCode: string;
}

interface PlacesAutocompleteProps {
  existingAddress?: string;
  onPlaceSelect: (suggestion: AddressInfo | null) => void;
}

export const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelect,
  existingAddress,
}) => {
  const {
    ready,
    suggestions: { status, data },
    value,
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    defaultValue: existingAddress,
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {
      types: ["street_number", "street_address"],
    },
    debounce: 400,
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  function extractAddress(
    data: google.maps.places.PlaceResult
  ): AddressInfo | null {
    const addressInfo: AddressInfo = {
      streetNumber: "",
      address: "",
      city: "",
      state: "",
      lat: 0,
      lng: 0,
      zipCode: "",
    };

    if (!data.address_components) {
      return null;
    }

    for (const component of data.address_components) {
      if (component.types.includes("street_number")) {
        addressInfo.streetNumber = component.long_name;
      } else if (component.types.includes("route")) {
        addressInfo.address = component.long_name;
      } else if (component.types.includes("locality")) {
        addressInfo.city = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        addressInfo.state = component.short_name;
      } else if (component.types.includes("postal_code")) {
        addressInfo.zipCode = component.long_name;
      }
    }

    // Check if any essential information is missing
    if (Object.values(addressInfo).some((value) => value === "")) {
      return null; // Incomplete address information
    }

    // Include latitude and longitude
    addressInfo.lat =
      data.geometry?.location != undefined ? data.geometry.location.lat() : 0;
    addressInfo.lng =
      data.geometry?.location != undefined ? data.geometry.location.lng() : 0;

    return addressInfo;
  }

  const handleSelect = async (
    suggestion: google.maps.places.AutocompletePrediction
  ) => {
    clearSuggestions();
    const d = (await getDetails({
      placeId: suggestion.place_id,
      fields: ["address_components", "geometry"],
    })) as google.maps.places.PlaceResult;
    const details = extractAddress(d);
    setValue(`${details?.streetNumber} ${details?.address}`, false);
    onPlaceSelect(details);
  };

  const renderSuggestions = () =>
    data.map((suggestion: google.maps.places.AutocompletePrediction) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => handleSelect(suggestion)}
          className="p-1 border-b border-gray-400 hover:bg-gray-200 cursor-pointer"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div>
      <input
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        value={value}
        onChange={(e) => handleInput(e)}
        disabled={!ready}
        placeholder="123 Something St."
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && (
        <ul className="fixed z-10 bg-white p-2 shadow-xl">
          {renderSuggestions()}
        </ul>
      )}
    </div>
  );
};
