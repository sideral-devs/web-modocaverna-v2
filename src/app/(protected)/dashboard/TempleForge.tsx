import { Card } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'

export function TempleForge({ value }: { value: string }) {
  return (
    <TabsContent value={value} className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full min-h-[676px] gap-2">
        <Card
          className="flex flex-col w-full h-full md:min-h-80 p-6 gap-6 relative overflow-hidden"
          // style={{
          //   backgroundImage: "url('/images/card-frames/frame_esquerda.png')",
          //   backgroundPosition: 'center',
          //   backgroundRepeat: 'no-repeat',
          //   backgroundSize: 'FIT',
          // }}
        >
          <div
            className="absolute  right-1 bottom-5 w-full h-full"
            style={{
              backgroundImage:
                "url('/images/cursos-indique-e-ganhe/frame_esquerda.png')",
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'FIT',
            }}
          ></div>
          {/* <Image
            src={'/images/card-frames/frame_esquerda.png'}
            alt="Treinos"
            width={800}
            height={676}
          /> */}
        </Card>

        <Card
          className="flex flex-col w-full h-full md:min-h-80 p-6 gap-6 relative overflow-hidden"
          // style={{
          //   backgroundImage: "url('/images/card-frames/frame_esquerda.png')",
          //   backgroundPosition: 'center',
          //   backgroundRepeat: 'no-repeat',
          //   backgroundSize: 'FIT',
          // }}
        >
          <div
            className="absolute right-1 bottom-5 w-full h-full"
            style={{
              backgroundImage: "url('/images/card-frames/frame_direita.png')",
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'FIT',
            }}
          ></div>
          {/* <Image
            src={'/images/card-frames/frame_esquerda.png'}
            alt="Treinos"
            width={800}
            height={676}
          /> */}
        </Card>
      </div>
    </TabsContent>
  )
}
