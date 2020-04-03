const request = require('supertest');

const app = require('../index');

it('should go to error instead of go to homepage', async () => {
    let response = await request(app)
        .get('/homepagkkkke');
    expect(response.statusCode).toBe(404);
    
});

