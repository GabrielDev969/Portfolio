import { viewModeStorageKey } from '@/lib/storage-keys'

/**
 * Runs in <head> before first paint, so neither the film nor Quick view flashes:
 * marks JS as available, restores the saved view mode, and closes the masking bars
 * when the page opens at the top in film mode.
 */
export const headScript = `(function(){var d=document.documentElement;d.dataset.js='';var v='film';
try{if(localStorage.getItem(${JSON.stringify(viewModeStorageKey)})==='quick')v='quick'}catch(e){}
d.dataset.view=v;if(v==='film'&&!location.hash)d.dataset.bars='closed';})();`
