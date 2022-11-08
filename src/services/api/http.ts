import axios from 'axios';

export const API_URL = process.env.API_URL;

// Создаем инстанст axios с опредленнными настройками
const $api = axios.create({
	withCredentials: false, // Чтобы куки к каждмоу запросу цеплялсь автоматически
	baseURL: API_URL,
});

$api.interceptors.request.use(config => {
	// eslint-disable-next-line no-param-reassign
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('token');
		if (config.headers && token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

// $api.interceptors.response.use(
//   (config) => config,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && error.config && !error.config._isRetry) {
//       originalRequest._isRetry = true;
//       try {
//         const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
//         localStorage.setItem('token', response.data.accessToken);
//         return $api.request(originalRequest);
//       } catch (e) {
//         console.log('НЕ АВТОРИЗОВАН');
//       }
//     }
//     throw error;
//   }
// );

export default $api;
