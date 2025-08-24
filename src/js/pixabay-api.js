import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '51947968-c6a427fc5995ddec4f6cc2eb4';

export async function fetchImages(query, page = 1, perPage = 15) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
