'use client'

import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import MusicPlayer from './music-player'
import PlaylistDialog from './playlist-dialog'

interface MusicContextType {
  currentSong: Song | null
  isPlaying: boolean
  isDialogOpen: boolean
  musicRef: MutableRefObject<HTMLAudioElement | null>
  setIsDialogOpen: (isOpen: boolean) => void
  togglePlay: () => void
  nextSong: () => void
  prevSong: () => void
  playSong: (song: Song, playlistId: number) => void
  currentPlaylistId: number | null
  setCurrentPlaylistId: (id: number) => void
  playlistsQuery: {
    data: Playlist[] | undefined
    isLoading: boolean
    isError: boolean
    error: Error | null
  }
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPlaylistId, setCurrentPlaylistId] = useState<number | null>(
    null,
  )
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const pathname = usePathname()

  const playlistsQuery = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const res = await api.get('/playlists/find')
      return res.data as Playlist[]
    },
  })

  const currentPlaylistSongsQuery = useQuery({
    queryKey: ['playlist-songs', currentPlaylistId],
    queryFn: async () => {
      const res = await api.get(`/playlists/${currentPlaylistId}/musics`)
      return res.data as Song[]
    },
    enabled: !!currentPlaylistId,
  })

  const playSong = (song: Song, playlistId: number) => {
    setCurrentSong(song)
    setCurrentPlaylistId(playlistId)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextSong = () => {
    if (!currentSong || !currentPlaylistId || !currentPlaylistSongsQuery.data)
      return

    const songs = currentPlaylistSongsQuery.data

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)

    if (currentIndex < songs.length - 1) {
      setCurrentSong(songs[currentIndex + 1])
    } else {
      setCurrentSong(songs[0])
    }

    setIsPlaying(true)
  }

  const prevSong = () => {
    if (!currentSong || !currentPlaylistId || !currentPlaylistSongsQuery.data)
      return

    const songs = currentPlaylistSongsQuery.data

    const currentIndex = songs.findIndex((song) => song.id === currentSong.id)

    if (currentIndex > 0) {
      setCurrentSong(songs[currentIndex - 1])
    } else {
      setCurrentSong(songs[songs.length - 1])
    }
  }

  useEffect(() => {
    if (musicRef.current) {
      if (isPlaying) {
        musicRef.current.play()
      } else {
        musicRef.current.pause()
      }
    }
  }, [isPlaying, currentSong])

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        isDialogOpen,
        setIsDialogOpen,
        togglePlay,
        nextSong,
        prevSong,
        playSong,
        currentPlaylistId,
        setCurrentPlaylistId,
        musicRef,
        playlistsQuery: {
          data: playlistsQuery.data,
          isLoading: playlistsQuery.isLoading,
          isError: playlistsQuery.isError,
          error: playlistsQuery.error as Error | null,
        },
      }}
    >
      {children}
      {allowedRoutes.includes(pathname)
        ? (!ruledRoutes.includes(pathname) ||
            (ruledRoutes.includes(pathname) && currentSong && isPlaying)) && (
            <>
              <MusicPlayer />
              <PlaylistDialog />
              {currentSong && (
                <audio
                  ref={musicRef}
                  src={env.NEXT_PUBLIC_PROD_URL + currentSong.url}
                />
              )}
            </>
          )
        : ''}
    </MusicContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider')
  }
  return context
}

const allowedRoutes = ['/flow-produtividade', '/dashboard']
const ruledRoutes = ['/dashboard']
