'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/perfil-comunidade/user')
      return response.data as UserProfile
    },
  })

  if (user) {
    return redirect('/comunidade/profile/' + user.id)
  }

  return (
    <div>
      <div className="grid grid-cols-1 xl:flex gap-6">
        <div className="h-fit xl:min-w-[390px] rounded-lg border overflow-hidden">
          <div className="h-32 bg-muted"></div>

          <div className="flex flex-col xl:items-center relative px-4 pb-4">
            <div className="absolute -top-12 left-4 xl:left-1/2 xl:-translate-x-1/2">
              <div className="rounded-full relative border-4 border-background overflow-hidden h-20 w-20">
                <Skeleton className="absolute inset-0 rounded-full" />
              </div>
            </div>

            <div className="flex flex-col w-full xl: items-center pt-10 gap-4"></div>
          </div>
        </div>

        <div className="w-full flex-1 border rounded-lg overflow-hidden">
          <div className="flex flex-col flex-1 p-4 gap-8">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex w-full gap-3">
                <Skeleton className="w-[60px] h-[60px] rounded-full" />
                <div className="flex flex-1 w-full flex-col py-2 gap-3">
                  <Skeleton className="w-1/2 h-2" />
                  <Skeleton className="w-full h-2.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
