import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import { TrophyIcon } from 'lucide-react'

export function ChallengePoints({ challenge }: { challenge: Challenge }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="flex items-end gap-4">
            <div className="hidden md:flex flex-col gap-2 relative">
              <span className="text-xs text-emerald-500">Pontos</span>
              <div className="w-64 h-4 bg-emerald-900 rounded-full">
                <div
                  className="bg-emerald-400 rounded-full"
                  style={{
                    width: challenge.meta
                      ? challenge.meta.feitos_percent + '%'
                      : '0%',
                    height: '100%',
                  }}
                />
                {challenge.meta && (
                  <div
                    className="absolute top-0 flex flex-col items-center gap-2"
                    style={{
                      left: `${challenge.meta.target_percent.toFixed(0)}%`,
                    }}
                  >
                    <span className="text-xs">{challenge.meta.target}</span>
                    <div className="w-1 h-[18px] bg-white rounded-full" />
                    <span className="text-[8px] text-emerald-400">Meta</span>
                  </div>
                )}
              </div>
            </div>
            <TrophyIcon
              size={16}
              className="text-emerald-300 fill-emerald-300"
            />
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="TooltipContent bg-white text-emerald-500 text-xs p-3 rounded-sm "
            align="center"
            side="bottom"
            sideOffset={10}
          >
            <p>{challenge.meta ? `${challenge.meta.dias_feitos}` : '0'}</p>
            <TooltipArrow
              width={34}
              height={10}
              color="white"
              className="fill-white TooltipArrow margin-top-4 -translate-y-[2px]"
            />
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}
