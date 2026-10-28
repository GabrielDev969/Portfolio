import { viewModeStorageKey } from '@/lib/storage-keys'

/**
 * Runs in <head> before first paint, so Quick view never flashes the full page: it marks JS as
 * available and restores the saved view mode.
 */
export const headScript = `(function(){var d=document.documentElement;d.dataset.js='';var v='full';
try{if(localStorage.getItem(${JSON.stringify(viewModeStorageKey)})==='quick')v='quick'}catch(e){}
d.dataset.view=v;})();`
