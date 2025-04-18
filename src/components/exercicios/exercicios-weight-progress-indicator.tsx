export function WeightProgressIndicator({
  currentWeight,
  targetWeight,
}: {
  currentWeight: number
  targetWeight: number
}) {
  const totalBars = 40
  const weightDiff = currentWeight - targetWeight
  const progressPercentage = Math.round((weightDiff / currentWeight) * 100)
  const filledBars = Math.round((progressPercentage / 100) * totalBars)

  return (
    <div className="mt-8 bg-zinc-800/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex flex-col h-16 justify-between border-l-4 border-yellow-500 pl-4">
          <p className="text-zinc-400 text-sm">Faltam</p>
          <p className="text-2xl font-medium">{weightDiff}kg</p>
        </div>

        <div className="flex-1 mx-12">
          <div className="flex w-full gap-2">
            {Array.from({ length: totalBars }).map((_, i) => (
              <div
                key={i}
                className={`h-16 w-full rounded-full ${
                  i >= totalBars - filledBars ? 'bg-zinc-700' : 'bg-yellow-500'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col h-16 justify-between ">
          <p className="text-zinc-400 text-sm">Objetivo</p>
          <p className="text-2xl font-medium">{targetWeight}kg</p>
        </div>
      </div>
    </div>
  )
}
