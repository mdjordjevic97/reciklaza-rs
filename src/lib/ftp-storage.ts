import { Client } from 'basic-ftp'
import { Readable } from 'stream'

const FTP_HOST = process.env.FTP_HOST!
const FTP_USER = process.env.FTP_USER!
const FTP_PASSWORD = process.env.FTP_PASSWORD!
const FTP_BASE_PATH = process.env.FTP_BASE_PATH || '/'
const FILES_BASE_URL = process.env.FILES_BASE_URL!

async function withFtpClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client()
  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: false,
    })
    return await fn(client)
  } finally {
    client.close()
  }
}

export async function uploadFileToFtp(buffer: Buffer, remoteRelativePath: string): Promise<string> {
  await withFtpClient(async (client) => {
    const fullPath = `${FTP_BASE_PATH}/${remoteRelativePath}`.replace(/\/+/g, '/')
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
    await client.ensureDir(dir)
    await client.uploadFrom(Readable.from(buffer), fullPath)
  })

  return `${FILES_BASE_URL}/${remoteRelativePath}`.replace(/([^:])\/+/g, '$1/')
}

export async function deleteFileFromFtp(remoteRelativePath: string): Promise<void> {
  await withFtpClient(async (client) => {
    const fullPath = `${FTP_BASE_PATH}/${remoteRelativePath}`.replace(/\/+/g, '/')
    try {
      await client.remove(fullPath)
    } catch {
      // file may not exist, ignore
    }
  })
}

export function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
}
