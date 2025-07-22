'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { CategoryText } from './category-text'
import { RulesDialog } from './rules-dialog'

export function TrendingSidebar() {
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false)

  const pathname = usePathname()
  const isProfilePage = pathname.startsWith('/comunidade/profile')

  const { data: trendingTopics } = useQuery({
    queryKey: ['trending-topics'],
    queryFn: async () => {
      const res = await api.get('/posts/top-trending')
      return res.data as Post[]
    },
  })

  if (isProfilePage) {
    return null
  }

  return (
    <div className="w-96 hidden xl:block sticky top-0 h-screen overflow-y-auto">
      <div className="space-y-4">
        {/* <div className="relative">
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-full border border-input bg-background px-4 py-2 text-sm"
        />
      </div> */}

        <Card className="bg-transparent border">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Top 5 trending da semana</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {trendingTopics ? (
              <div className="divide-y">
                {trendingTopics.map((topic) => (
                  <div className="flex py-3 px-4  gap-[10px]" key={topic.id}>
                    <div className="min-w-5 min-h-5">
                      <Image
                        width={20}
                        height={20}
                        src={'/icons/chat-icon.svg'}
                        alt="Ícone de Post"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-3.5 cursor-pointer">
                      <Link
                        href={'/comunidade/post/' + topic.id}
                        className="line-clamp-3 text-sm"
                      >
                        {topic.content}
                      </Link>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {topic.views.toLocaleString()} views
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {topic.likes.toLocaleString()} likes
                          </p>
                        </div>
                        {topic.category && (
                          <CategoryText category={topic.category} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col flex-1 p-4 gap-8">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="flex w-full gap-3">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <div className="flex flex-1 w-full flex-col py-2 gap-3">
                      <Skeleton className="w-1/2 h-2" />
                      <Skeleton className="w-full h-2.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div
          className="flex w-full justify-center"
          data-tutorial-id="codigo-conduta"
        >
          <Button variant="link" onClick={() => setRulesDialogOpen(true)}>
            Regras de Uso
          </Button>
          <RulesDialog open={rulesDialogOpen} setOpen={setRulesDialogOpen} />
        </div>
      </div>
    </div>
  )
}
