import { NextRequest } from 'next/server';

export type NextRouteContext<T extends Record<string, string>> = {
  params: T;
};

export type RouteHandler<T extends Record<string, string>> = (
  request: NextRequest,
  context: NextRouteContext<T>
) => Promise<Response> | Response;