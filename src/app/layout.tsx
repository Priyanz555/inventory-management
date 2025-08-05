import type { Metadata } from 'next'
import './globals.css'
import Layout from '@/components/layout'

export const metadata: Metadata = {
  title: 'InvMgmt - Inventory Management System',
  description: 'A modern inventory management system built with Next.js and Shadcn UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
} 