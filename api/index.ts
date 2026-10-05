import type { Request, Response } from 'express';
import { app } from '../server';

const API_ROUTES: Record<string, string> = {
  status: '/api/status',
  'study/explain': '/api/study/explain',
  'study/verify': '/api/study/verify',
  'study/teach-step': '/api/study/teach-step',
};

export default function handler(req: Request, res: Response) {
  const route = req.query.route;
  if (typeof route !== 'string' || !Object.prototype.hasOwnProperty.call(API_ROUTES, route)) {
    return res.status(404).json({ success: false, error: 'API route not found.' });
  }

  const query = new URL(req.url || '/', 'http://localhost');
  query.searchParams.delete('route');
  req.url = `${API_ROUTES[route]}${query.search}`;

  return app(req, res);
}
