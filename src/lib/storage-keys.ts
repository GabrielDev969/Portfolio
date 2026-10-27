// Shared by the head script (server-rendered) and the client stores, so it must not live in a
// 'use client' module: there, a server import would get a client reference instead of the string.

/** localStorage: 'film' | 'quick'. */
export const viewModeStorageKey = 'viewMode'

/** sessionStorage: set once the cold open has played (or been decided against) this session. */
export const introSeenStorageKey = 'introSeen'
