import { basePath } from '@/lib/site'

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main>
          <h1>This scene was cut.</h1>
          <p>
            <a href={`${basePath}/`}>Back to the start</a>
          </p>
        </main>
      </body>
    </html>
  )
}
