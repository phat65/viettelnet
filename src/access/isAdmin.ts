import type { Access, PayloadRequest } from 'payload'

// Every account in Users is an administrator. Public account creation is disabled.
export const isAdmin = ({ req }: { req: PayloadRequest }): boolean => req.user?.collection === 'users'
export const adminOrPublished: Access = ({ req }) =>
  req.user?.collection === 'users' ? true : { status: { equals: 'published' } }
