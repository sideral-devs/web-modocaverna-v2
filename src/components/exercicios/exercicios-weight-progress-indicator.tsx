export function WeightProgressIndicator({
  currentWeight,
  targetWeight,
}: {
  currentWeight: number
  targetWeight: number
}) {
  const totalBars = 40
  const isGainingWeight = targetWeight > currentWeight
  const weightDiff = Math.abs(currentWeight - targetWeight)
  const progressPercentage = Math.round(
    (weightDiff / Math.max(currentWeight, targetWeight)) * 100,
  )
  const filledBars = Math.round((progressPercentage / 100) * totalBars)

  return (
    <div className="mt-8 bg-zinc-800/50 rounded-lg p-0">
      <div className="flex items-center justify-between gap-8">
        <div className="flex flex-col justify-between h-16 border-l-4 border-yellow-500 pl-4">
          <p className="text-zinc-400 text-sm">
            {isGainingWeight ? 'Faltam' : 'Excesso'}
          </p>
          <p className="text-2xl font-medium">{weightDiff}kg</p>
        </div>

        <div className="flex-1">
          <div className="flex w-full gap-1">
            {Array.from({ length: totalBars }).map((_, i) => (
              <div
                key={i}
                className={`h-16 flex-1 rounded-[6px] ${
                  i >= totalBars - filledBars ? 'bg-zinc-700' : 'bg-yellow-500'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between h-16">
          <p className="text-zinc-400 text-sm">Objetivo</p>
          <p className="text-2xl font-medium">{targetWeight}kg</p>
        </div>
      </div>
    </div>
  )
}
