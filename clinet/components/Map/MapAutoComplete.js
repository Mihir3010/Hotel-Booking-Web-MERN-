import React, { useState } from 'react';
import { Input } from 'antd';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const SearchInput = (props) => {
  const [searchBox, setSearchBox] = useState();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAP_API_KEY,
    libraries: ["places"], // Add the libraries prop here
  });
  const { getInputValue } = props;
  const [locationInput, setLocationInput] = useState({
    searchedLocation: '',
    searchedPlaceAPIData: [],
  });

  const handleOnChange = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
    setLocationInput({
      searchedLocation: event.target.value,
    });
  };

  const onLoad = (ref) => setSearchBox(ref);

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    setLocationInput({
      searchedLocation: places && places[0] && places[0].formatted_address,
      searchedPlaceAPIData: places ? places : [],
    });

    // Call a function to search and provide data based on the search input
    searchAndProvideData(places && places[0] && places[0].formatted_address);

    getInputValue({
      searchedLocation: places && places[0] && places[0].formatted_address,
      searchedPlaceAPIData: places ? places : [],
    });
  };

  const handleOnPressEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      setLocationInput({ searchedLocation: event.target.value });
      getInputValue(locationInput);
    }
  };

  // Function to search and provide data based on the search input
  const searchAndProvideData = (searchInput) => {
    // Perform search logic here, e.g., fetching data from JSON based on searchInput
    // Update the state or pass the data to the parent component as needed
    // For demonstration purposes, I'll assume you have a JSON file named "data.json" containing an array of objects

    // Assuming the JSON data structure is as follows:
    const jsonData = [
      {
        id: 1,
        name: 'Location 1',
        address: 'Address 1',
      },
      {
        id: 2,
        name: 'Location 2',
        address: 'Address 2',
      },
      {
        id: 3,
        name: 'Location 3',
        address: 'Address 3',
      },
    ];

    // Perform the search based on searchInput
    const searchData = jsonData.filter((item) =>
      item.address.toLowerCase().includes(searchInput.toLowerCase())
    );

    // Log the search results (you can update the state or pass it to the parent component as needed)
    console.log(searchData);
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return (
    <div className="map_autocomplete">
      {isLoaded && (
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          <Input
            type="text"
            defaultValue=""
            value={locationInput.searchedLocation || ''}
            placeholder="Search 'Ahmedabad'"
            size="large"
            onChange={handleOnChange}
            onPressEnter={handleOnPressEnter}
          />
        </StandaloneSearchBox>
      )}
    </div>
  );
};

const MapAutoComplete = (props) => {
  const { updateValue } = props;
  return <SearchInput getInputValue={updateValue} />;
};

export default MapAutoComplete;
