const request = require('supertest');
const app = require('../server');

// Mock the pg Pool so tests don't need a real database
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

const { Pool } = require('pg');
const mockPool = new Pool();

describe('Health Check', () => {
  test('GET /health returns status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'OK' });
  });
});

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/tasks returns array of tasks', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, title: 'Test Task', completed: false, created_at: new Date() },
      ],
    });

    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('Test Task');
  });

  test('POST /api/tasks creates a new task', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 2, title: 'New Task', completed: false, created_at: new Date() }],
    });

    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'New Task' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Task');
    expect(res.body.completed).toBe(false);
  });

  test('POST /api/tasks returns 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Title is required');
  });

  test('PUT /api/tasks/:id updates a task', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'Updated Task', completed: true, created_at: new Date() }],
    });

    const res = await request(app)
      .put('/api/tasks/1')
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  test('PUT /api/tasks/:id returns 404 for missing task', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .put('/api/tasks/999')
      .send({ title: 'Ghost Task' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });

  test('DELETE /api/tasks/:id deletes a task', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'Task to delete' }],
    });

    const res = await request(app).delete('/api/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task deleted');
  });

  test('DELETE /api/tasks/:id returns 404 for missing task', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app).delete('/api/tasks/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Task not found');
  });
});
