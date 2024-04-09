import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 20 }, // Ramp up to 20 users over 1 minute
        { duration: '3m', target: 20 }, // Stay at 20 users for 3 minutes
        { duration: '1m', target: 0 },  // Ramp down to 0 users over 1 minute
    ],
};

export default function () {
    // Example Loki query for logs over the last hour. Adjust the query as needed.
    let query = `{job="your-app"} |= "error"`;
    let response = http.get(`http://localhost:3100/loki/api/v1/query_range?query=${encodeURIComponent(query)}&start=${(new Date().getTime() - 3600 * 1000)}&end=${new Date().getTime()}&limit=1000`);

    check(response, {
        'is status 200': (r) => r.status === 200,
        'has results': (r) => JSON.parse(r.body).data.result.length > 0,
    });

    sleep(1);
}

