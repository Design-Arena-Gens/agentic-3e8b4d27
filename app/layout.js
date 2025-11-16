export const metadata = {
  title: 'Image Editor',
  description: 'Upload and edit images with filters and effects',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
