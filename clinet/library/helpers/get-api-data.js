import fetch from 'isomorphic-unfetch';
import shuffle from 'lodash/shuffle';
import axiosInstance from 'components/axios';

const fetchAPIData = (url) => {
  return fetch(url)
    .then((r) => r.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error('Error fetching API data:', error);
      return null;
    });
};

export const processAPIData = (apiData) => {
  let fetchData = {};
  if (apiData) {
    apiData.forEach((item) => {
      fetchData.data = item.data ? [...item.data] : [];
      fetchData.name = item.name ? item.name : '';
    });
  }
  const data = fetchData ? fetchData.data : [];
  return data;
};

export const searchedData = (processedData) => {
  const randNumber = Math.floor(Math.random() * 50 + 1);
  const data = shuffle(processedData.slice(0, randNumber));
  return data;
};

export const searchStateKeyCheck = (state) => {
  for (var key in state) {
    if (
      state[key] !== null &&
      state[key] !== '' &&
      !Array.isArray(state[key]) &&
      state[key] !== 0 &&
      state[key] !== 100
    ) {
      return true;
    }
  }
  return false;
};

export const paginator = (posts, processedData, limit) => {
  return [...posts, ...processedData.slice(posts.length, posts.length + limit)];
};

export const getAPIData = async (apiUrl) => {
  const promises = apiUrl.map(async (repo) => {
    const apiPath = `${process.env.NEXT_PUBLIC_SERVER_API}/data`; // Update the API path accordingly
    const api = `${apiPath}/${repo.endpoint}.json`;
    try {
      const response = await fetchAPIData(api);
      return {
        name: repo.name,
        data: response,
      };
    } catch (error) {
      console.error(`Error fetching data for ${repo.name}:`, error);
      return {
        name: repo.name,
        data: null,
      };
    }
  });
  const receivedData = await Promise.all(promises);
  return receivedData;
};
