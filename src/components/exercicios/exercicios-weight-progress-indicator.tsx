// import { useShape } from '@/hooks/queries/use-shape'

// Types
// type WeightData = {
//   currentWeight: number
//   targetWeight: number
//   lastWeight?: number
// }

type ProgressBarProps = {
  currentWeight: number
  targetWeight: number
  totalBars: number
}

type WeightDisplayProps = {
  label: string
  value: number
  unit: string
}

// Helper functions
const calculateProgress = (currentWeight: number, targetWeight: number) => {
  const totalBars = 50
  const startWeight = Math.max(currentWeight, targetWeight)
  const weightDifference = Math.abs(currentWeight - targetWeight)
  const progressPercentage = (weightDifference / startWeight) * 100
  const completedBars = Math.floor((progressPercentage / 100) * totalBars)

  return {
    totalBars,
    completedBars: totalBars - completedBars, // Invert the completed bars since we want more yellow as we get closer
  }
}

// Components
const ProgressBar = ({
  currentWeight,
  targetWeight,
  totalBars,
}: ProgressBarProps) => {
  const { completedBars } = calculateProgress(currentWeight, targetWeight)

  return (
    <div className="flex w-full gap-2 flex-row">
      {Array.from({ length: totalBars }).map((_, i) => (
        <div
          key={i}
          className={`h-16 w-full rounded-full ${
            i < completedBars ? 'bg-yellow-500' : 'bg-zinc-700'
          }`}
        />
      ))}
    </div>
  )
}

const WeightDisplay = ({ label, value, unit }: WeightDisplayProps) => (
  <div className="flex flex-col h-16 justify-between">
    <p className="text-zinc-400 text-sm">{label}</p>
    <p className="text-2xl font-medium">
      {value}
      {unit}
    </p>
  </div>
)

const CurrentWeightDisplay = ({
  value,
  unit,
}: Omit<WeightDisplayProps, 'label'>) => (
  <div className="flex flex-col h-16 justify-between border-l-4 border-yellow-500 pl-4">
    <p className="text-zinc-400 text-sm">Peso atual</p>
    <p className="text-2xl font-medium">
      {value}
      {unit}
    </p>
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
  // const { shapeRegistrations } = useShape()
  // const lastShapeRegistration =
  //   shapeRegistrations?.[shapeRegistrations.length - 1]

  return (
    <div className="mt-8 bg-zinc-800/50 rounded-lg">
      <div className="flex items-center justify-between">
        <CurrentWeightDisplay value={currentWeight || 0} unit="kg" />

        <div className="flex-1 mx-12">
          <ProgressBar
            currentWeight={currentWeight}
            targetWeight={targetWeight}
            totalBars={50}
          />
        </div>

        <WeightDisplay label="Meta" value={targetWeight || 0} unit="kg" />
      </div>
    </div>
  )
}
