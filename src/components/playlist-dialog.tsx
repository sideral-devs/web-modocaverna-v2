'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/lib/api'
import { env } from '@/lib/env'
import { useQuery } from '@tanstack/react-query'
import {
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useMusicPlayer } from './music-player-provider'

export default function PlaylistDialog() {
  const {
    isDialogOpen,
    setIsDialogOpen,
    playSong,
    togglePlay,
    nextSong,
    prevSong,
    currentSong,
    musicRef,
    isPlaying,
    playlistsQuery,
  } = useMusicPlayer()

  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [volume, setVolume] = useState(1)

  if (playlistsQuery.data && playlistsQuery.data.length > 0 && !activeTab) {
    setActiveTab(playlistsQuery.data[0].title)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="flex flex-col max-w-4xl h-[80vh] p-0 overflow-auto">
        {playlistsQuery.isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Carregando playlists...</span>
          </div>
        )}
        {playlistsQuery.isError && (
          <div className="flex items-center justify-center h-full p-6">
            <Alert variant="destructive" className="max-w-md">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                {playlistsQuery.error?.message ||
                  'Não foi possível carregar as playlists'}
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => window.location.reload()}
                >
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {playlistsQuery.data && activeTab && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
            }}
            className="w-full h-full flex flex-col"
          >
            <TabsList className="w-full justify-start px-4 pt-4 bg-card border-b rounded-none overflow-x-auto no-scrollbar">
              {playlistsQuery.data.map((playlist) => (
                <TabsTrigger
                  key={playlist.id}
                  value={playlist.title}
                  className="p-4 relative data-[state=active]:bg-transparent group"
                >
                  {playlist.title}
                  <div className="absolute w-0 h-[1px] bottom-0 bg-primary group-data-[state=active]:w-10 transition-all duration-200" />
                </TabsTrigger>
              ))}
            </TabsList>

            {playlistsQuery.data.map((playlist) => (
              <TabsContent
                key={playlist.id}
                value={playlist.title}
                className="flex-1 overflow-auto p-0 m-0"
              >
                <PlaylistView
                  playlist={playlist}
                  onPlaySong={playSong}
                  currentSong={currentSong}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
        <DialogFooter className="!justify-between bg-zinc-900 border-t">
          <div className="flex items-center justify-between w-full px-4 py-3">
            {/* Esquerda: Música atual */}
            <div className="flex items-center gap-4 min-w-0">
              {currentSong?.banner ? (
                <div className="w-12 h-12 relative shrink-0">
                  <Image
                    src={env.NEXT_PUBLIC_PROD_URL + currentSong.banner}
                    alt={currentSong.title}
                    className="rounded-md object-cover"
                    fill
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-zinc-700 rounded-md" />
              )}
              <div className="truncate">
                <p className="text-sm font-medium truncate">
                  {currentSong?.title || 'Nenhuma música'}
                </p>
              </div>
            </div>

            {/* Centro: Controles */}
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="ghost"
                onClick={prevSong}
                disabled={!currentSong}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={togglePlay}
                disabled={!currentSong}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={nextSong}
                disabled={!currentSong}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Direita: Volume */}
            <div className="flex items-center gap-2 w-32">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newVolume = volume === 0 ? 1 : 0
                  setVolume(newVolume)
                  if (musicRef.current) {
                    musicRef.current.volume = newVolume
                  }
                }}
              >
                {volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                )}
              </Button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  setVolume(val)
                  if (musicRef.current) {
                    musicRef.current.volume = val
                  }
                }}
                className="h-1.5 w-full accent-white hover:accent-primary bg-zinc-700 cursor-pointer rounded"
              />
            </div>
          </div>
        </DialogFooter>
        <DialogTitle className="absolute h-[0] overflow-hidden">
          Ver playlists
        </DialogTitle>
      </DialogContent>
    </Dialog>
  )
}

function PlaylistView({
  playlist,
  onPlaySong,
  currentSong,
}: {
  playlist: Playlist
  onPlaySong: (song: Song, playlistId: number) => void
  currentSong: Song | null
}) {
  // Fetch songs for this playlist
  const {
    data: songs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['playlist-songs', playlist.id],
    queryFn: async () => {
      const res = await api.get(`/playlists/${playlist.id}/musics`)
      return res.data as Song[]
    },
  })

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gradient-to-b from-primary/20 to-background p-6 flex items-end gap-6">
        {playlist.banner ? (
          <Image
            src={env.NEXT_PUBLIC_PROD_URL + playlist.banner}
            alt={playlist.title}
            className="object-cover shadow-lg rounded-md"
            width={160}
            height={160}
          />
        ) : (
          <div className="w-40 h-40 bg-zinc-700 rounded-lg" />
        )}
        <div>
          <p className="text-zinc-400 mb-2.5">{playlist.numMusics} músicas</p>
          <h2 className="text-2xl mb-4">{playlist.title}</h2>
          <p className="text-muted-foreground">{playlist.description}</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Carregando músicas...</span>
          </div>
        )}

        {isError && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error?.message ||
                `Erro ao carregar músicas para ${playlist.title}`}
            </AlertDescription>
          </Alert>
        )}

        {songs && songs.length > 0 && (
          <>
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 text-sm text-muted-foreground border-b pb-2 mb-2">
              <div className="w-8 text-center"></div>
              <div>Título</div>
              <div className="flex items-center gap-2">Duração</div>
            </div>

            {songs.map((song, index) => {
              const isCurrentSong = currentSong?.id === song.id

              return (
                <div
                  key={song.id}
                  className={`grid grid-cols-[auto_1fr_auto] gap-2 py-2 px-1 rounded-lg hover:bg-muted/50 cursor-pointer ${
                    isCurrentSong ? 'border border-primary' : ''
                  }`}
                  onClick={() => onPlaySong(song, playlist.id)}
                >
                  <div className="w-8 flex items-center justify-center">
                    <span className="text-muted-foreground">{index + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {song.banner ? (
                      <div className="w-11 h-11 min-h-11 min-w-11 relative">
                        <Image
                          src={env.NEXT_PUBLIC_PROD_URL + song.banner}
                          alt={playlist.title}
                          className="object-cover shadow-lg rounded-md"
                          fill
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 bg-white rounded-lg" />
                    )}
                    <p
                      className={`font-medium ${isCurrentSong ? 'text-primary' : ''}`}
                    >
                      {song.title}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground my-auto">
                    {song.duration}
                  </div>
                </div>
              )
            })}
          </>
        )}

        {songs && songs.length === 0 && !isLoading && !isError && (
          <div className="text-center py-10 text-muted-foreground">
            Nenhuma música nessa playlist.
          </div>
        )}
      </div>
    </div>
  )
}
