/**
 * YouTube URL validation and video ID extraction
 * Supports multiple YouTube URL formats
 */

const YOUTUBE_REGEX_PATTERNS = [
  // youtube.com/watch?v=VIDEO_ID
  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  // youtu.be/VIDEO_ID
  /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  // youtube.com/embed/VIDEO_ID
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  // m.youtube.com/watch?v=VIDEO_ID
  /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  // youtube.com/v/VIDEO_ID
  /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  // youtube.com/shorts/VIDEO_ID
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
]

export function extractVideoId(url: string): string | null {
  const trimmedUrl = url.trim()

  // Try each regex pattern
  for (const pattern of YOUTUBE_REGEX_PATTERNS) {
    const match = trimmedUrl.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  // Check if it's already a video ID (11 characters)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmedUrl)) {
    return trimmedUrl
  }

  return null
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}
