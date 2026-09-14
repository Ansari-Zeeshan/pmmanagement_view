import request from 'supertest';
import app from '../app.js';

describe('PM Connect Backend API Suite', () => {
  it('GET /api/v1/health should return 200 OK', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('GET /api/v1/projects without auth token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/projects with Bearer token should succeed and return project payload', async () => {
    const res = await request(app)
      .get('/api/v1/projects')
      .set('Authorization', 'Bearer dev-demo-token');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.projects)).toBe(true);
  }, 10000);
});
