// useApi.js
import { useState } from 'react';

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to get location data from ipinfo.io
  const getLocationFromIp = async () => {
    const url = `https://ipinfo.io/json?token=820396dae94140`; // Use your actual token from ipinfo.io
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.city && data.country) {
        // Combine city and country for full location
        return `${data.city}, ${data.country}`;
      } else {
        throw new Error('City or country information is missing');
      }
    } catch (err) {
      console.error('Error fetching location from IP:', err);
      return ''; // Return empty string or handle error as needed
    }
  };

  // Helper function to get user's location
  const getUserLocation = () =>
    new Promise(async (resolve, reject) => {
      if (!navigator.geolocation) {
        // Use IP-based location service if Geolocation is not supported
        const cityCountry = await getLocationFromIp();
        resolve({ cityName: cityCountry });
      } else {
        navigator.geolocation.getCurrentPosition(
          async () => {
            // Even if geolocation is successful, use IP for city/country to keep consistency
            const cityCountry = await getLocationFromIp();
            resolve({ cityName: cityCountry });
          },
          async () => {
            // In case of error or if the user denies geolocation, fallback to IP
            const cityCountry = await getLocationFromIp();
            resolve({ cityName: cityCountry });
          },
          { 
            maximumAge: 60000, // Accept a cached position within 60 seconds old
            timeout: 15000, // Give up after 15 seconds
            enableHighAccuracy: true // Though not used for city, set for potential future use
          }
        );
      }
    });

  const postData = async (url, data, apiKey) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user's location
      const locationInfo = await getUserLocation();
      console.log('Location:', locationInfo);
      // Update the data object with location information
      const updatedData = {
        ...data,
        location: locationInfo.cityName // Use the city name obtained from IP
      };

      console.log('Sending data with location:', updatedData); 

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseData = await response.json();
      setIsLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return { postData, isLoading, error };
};

export default useApi;




// import { useState } from 'react';

// const useApi = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Helper function to get user's location
//   const getUserLocation = () =>
//     new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation is not supported by your browser.'));
//       } else {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//       }
//     });

//   const postData = async (url, data, apiKey) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Get user's location
//       const position = await getUserLocation();
//       const { latitude, longitude } = position.coords;
//       // You can use the latitude and longitude to get more detailed location info if needed
//       // For now, we'll just add them directly to the data object
//       const updatedData = {
//         ...data,
//         location: `Lat: ${latitude}, Long: ${longitude}` // Modify this as needed based on your backend requirements
//       };

//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'x-api-key': apiKey,
//         },
//         body: JSON.stringify(updatedData),
//       });

//       if (!response.ok) {
//         throw new Error('Something went wrong!');
//       }

//       const responseData = await response.json();
//       setIsLoading(false);
//       return responseData;
//     } catch (err) {
//       setError(err.message);
//       setIsLoading(false);
//     }
//   };

//   return { postData, isLoading, error };
// };

// export default useApi;
