import { builtStorageKey, viewModeStorageKey } from '@/lib/storage-keys'

/**
 * Runs in <head> before first paint, so Quick view never flashes the full page: it marks JS as
 * available and restores the saved view mode.
 *
 * It also decides whether the page opens empty for the swarm to build (design/COMMIT-SHEET.md
 * §6): only in the full view, with motion allowed, the first time this session, and not on a
 * deep link. html[data-build] hides the page's pieces (opacity only, so the words stay in the
 * accessibility tree and the layout never moves). If the swarm has not started within 5 s,
 * whatever the reason, the page is simply shown.
 */
export const headScript = `(function(){var d=document.documentElement;d.dataset.js='';var v='full';
try{if(localStorage.getItem(${JSON.stringify(viewModeStorageKey)})==='quick')v='quick'}catch(e){}
d.dataset.view=v;var b=v==='full'&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
try{if(sessionStorage.getItem(${JSON.stringify(builtStorageKey)})==='1')b=false}catch(e){}
if(b){d.dataset.build='';setTimeout(function(){if(!d.dataset.swarm)delete d.dataset.build},5000)}})();`
