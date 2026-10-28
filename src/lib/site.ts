/** Where the static export is served: https://gabrieldev969.github.io/Portfolio/ */
export const basePath = '/Portfolio'
export const siteOrigin = 'https://gabrieldev969.github.io'
export const siteUrl = `${siteOrigin}${basePath}`

/** URL of a file in public/, e.g. asset('cv/CV_Gabriel_Santos_EN.pdf'). */
export function asset(path: string) {
  return `${basePath}/${path.replace(/^\//, '')}`
}
