import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
	// estagios do teste
	stages: [
		{ duration: '10s', target: 10}, // aquecimento
		{ duration: '30s', target: 50}, // carga de 30 segundos e 50 usuarios
		{ duration: '1m', target: 50}, // carga de 1 minutos mantendo 50 usuarios
		{ duration: '10s', target: 0},
	],
	thresholds: {
		http_req_duration: ['p(95)<500'],
	},
};

export default function () {
	const params = {
		headers: {
			'X-Custom-ID': '60d4f96e4e35583e9d848ae1e5c8e7e2',
			'Content-Type': 'application/json',
		},
	};

	let resNginx = http.get('http://98.52.0.21/', params);
	check(resNginx, { 'Nginx status is 200': (r) => r.status === 200 });

	let resApache = http.get('http://98.52.0.22/', params);
	check(resApache, { 'Apache status is 200': (r) => r.status === 200 });

	sleep(1);
}



