import axios from "axios";

const API_URL = "localhost:3000/common/display/"; // Replace with your backend server's API URL

export const fetchData = async () => {
  try {
    const response = await axios.get({API_URL}/'display?role=retailer'); // Make a GET request to fetch data
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};

// export const postData = async (data) => {
//   try {
//     const response = await axios.post({API_URL}/data, data); // Make a POST request to send data
//     return response.data; // Return the response data
//   } catch (error) {
//     console.error("Error posting data:", error);
//     throw error; // Rethrow the error to handle it in the component
//   }
// };