import { useShape } from '@/hooks/queries/use-shape'

// Types
type WeightData = {
  currentWeight: number
  targetWeight: number
  lastWeight?: number
}

type ProgressBarProps = {
  totalBars: number
  completedBars: number
}

type WeightDisplayProps = {
  label: string
  value: number
  unit: string
}

// Helper functions
const calculateProgress = (firstRegistrationWeight: number, currentWeight: number, targetWeight: number, lastWeight?: number) => {
  const totalBars = 50
  const completedWeight = Math.abs(currentWeight - firstRegistrationWeight)
  const totalWeightToGoal = Math.abs(targetWeight - firstRegistrationWeight)
  const progressPercentage = (completedWeight / totalWeightToGoal) * 100
  const completedBars = Math.floor((progressPercentage / 100) * totalBars)

  return {
    totalBars,
    completedBars,
    progressPercentage
  }
}

// Components
const ProgressBar = ({ totalBars, completedBars }: ProgressBarProps) => (
  <div className="flex w-full gap-2 flex-row">
    {Array.from({ length: totalBars }).map((_, i) => {
      const progressPercent = (200 - 120) / (200 - 70) * 100 // Calculate progress from 200 to 70
      const completedBars = Math.floor((progressPercent / 100) * totalBars)
      return (
        <div
          key={i}
          className={`h-16 w-full rounded-full ${
            i < completedBars ? 'bg-yellow-500' : 'bg-zinc-700'
          }`}
        />
      )
    })}
  </div>
)

const WeightDisplay = ({ label, value, unit }: WeightDisplayProps) => (
  <div className="flex flex-col h-16 justify-between">
    <p className="text-zinc-400 text-sm">{label}</p>
    <p className="text-2xl font-medium">{value}{unit}</p>
  </div>
)

const CurrentWeightDisplay = ({ value, unit }: Omit<WeightDisplayProps, 'label'>) => (
  <div className="flex flex-col h-16 justify-between border-l-4 border-yellow-500 pl-4">
    <p className="text-zinc-400 text-sm">Peso atual</p>
    <p className="text-2xl font-medium">{value}{unit}</p>
  </div>
)

// Main Component
export function WeightProgressIndicator({
  currentWeight,
  targetWeight,
}: {
  currentWeight: number
  targetWeight: number
}) {
  const { shapeRegistrations } = useShape()
  const firstShapeRegistration = shapeRegistrations?.[0]
  const lastShapeRegistration = shapeRegistrations?.[shapeRegistrations.length - 1]
  const penultimateShapeRegistration = shapeRegistrations?.[shapeRegistrations.length - 2]

  const { totalBars, completedBars } = calculateProgress(
    currentWeight,
    targetWeight,
    penultimateShapeRegistration?.peso
  )

  return (
    <div className="mt-8 bg-zinc-800/50 rounded-lg">
      <div className="flex items-center justify-between">
        <CurrentWeightDisplay 
          value={currentWeight || 0} 
          unit="kg" 
        />

        <div className="flex-1 mx-12">
          <ProgressBar 
            totalBars={totalBars} 
            completedBars={completedBars} 
          />
        </div>

        <WeightDisplay 
          label="Meta" 
          value={lastShapeRegistration?.peso_meta || 0} 
          unit="kg" 
        />
      </div>
    </div>
  )
}
