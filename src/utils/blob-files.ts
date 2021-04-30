import axios from 'axios'
import { BlobFileResult } from '@/types'

async function getFile(id: number, fileName: string, endpointUrl: string): Promise<BlobFileResult> {
  try {
    endpointUrl =
      endpointUrl.slice(endpointUrl.length - 1) !== '/' ? `${endpointUrl}/` : endpointUrl
    const response = await axios.get(endpointUrl + id, {
      responseType: 'blob'
    })
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    })

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob)
      return { msSaveOrOpenBlob: true, error: false, anchorElement: null }
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.setAttribute('download', fileName)
    document.body.appendChild(a)
    return { msSaveOrOpenBlob: false, error: false, anchorElement: a }
  } catch {
    return { msSaveOrOpenBlob: false, error: true, anchorElement: null }
  }
}

export async function previewBlobFile(id: number, fileName: string, url: string) {
  const result = await getFile(id, fileName, url)
  if (result.error) {
    return false
  } else if (result.msSaveOrOpenBlob) {
    return true
  } else if (result.anchorElement) {
    window.open(result.anchorElement.href, '_blank')
    URL.revokeObjectURL(result.anchorElement.href)
    return true
  } else {
    return false
  }
}

export async function downloadBlobFile(id: number, fileName: string, url: string) {
  const result = await getFile(id, fileName, url)
  if (result.error) {
    return false
  } else if (result.msSaveOrOpenBlob) {
    return true
  } else if (result.anchorElement) {
    result.anchorElement.click()
    URL.revokeObjectURL(result.anchorElement.href)
    return true
  } else {
    return false
  }
}
