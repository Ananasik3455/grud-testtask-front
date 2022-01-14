import axios from 'axios';

const webClient = axios.create({
  baseURL: 'https://api.le-systeme-solaire.net/rest/',
});

export default webClient;
