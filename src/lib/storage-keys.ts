// Shared by the head script (server-rendered) and the client stores, so it must not live in a
// 'use client' module: there, a server import would get a client reference instead of the string.

/** localStorage: 'full' | 'quick'. */
export const viewModeStorageKey = 'viewMode'
