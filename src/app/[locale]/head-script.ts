import { introSeenStorageKey, viewModeStorageKey } from '@/lib/storage-keys'
import { dur } from '@/motion/tokens'

/**
 * Runs in <head> before first paint, so neither the film nor Quick view flashes:
 * - marks JS as available and restores the saved view mode;
 * - closes the masking bars when the page opens at the top in film mode;
 * - decides on the cold open: first visit this session, film mode, no deep-link hash, motion
 *   allowed. CSS performs the cut at dur.intro, so it ends on time even before hydration;
 *   Skip and Esc are wired here for the same reason.
 */
export const headScript = `(function(){var d=document.documentElement;d.dataset.js='';var v='film';
try{if(localStorage.getItem(${JSON.stringify(viewModeStorageKey)})==='quick')v='quick'}catch(e){}
d.dataset.view=v;if(v!=='film'||location.hash)return;d.dataset.bars='closed';
var seen=true;try{seen=sessionStorage.getItem(${JSON.stringify(introSeenStorageKey)})==='1';sessionStorage.setItem(${JSON.stringify(introSeenStorageKey)},'1')}catch(e){}
if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.dataset.intro='';var end=function(){delete d.dataset.intro;removeEventListener('keydown',key,true);document.removeEventListener('click',click,true)};
var key=function(e){if(e.key==='Escape')end()};var click=function(e){if(e.target.closest&&e.target.closest('[data-skip-intro]'))end()};
addEventListener('keydown',key,true);document.addEventListener('click',click,true);setTimeout(end,${dur.intro * 1000});})();`
