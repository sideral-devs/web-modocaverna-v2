// import React, { useState } from 'react'
// import { Checkbox } from '@/components/ui/checkbox'
// import dayjs from 'dayjs'
// import { Pencil } from 'lucide-react'

// export default function EditableObjectiveItem({
//   item,
//   index,
//   handleCheckGoal,
//   selectedYear,
//   onSave,
// }: {
//   item: { valor: string; checked: boolean }
//   index: number
//   handleCheckGoal: (index: number, checked: boolean) => void
//   selectedYear: string
//   onSave: (index: number, newValue: string) => void
// }) {
//   const [isEditing, setIsEditing] = useState(false)
//   const [editedValue, setEditedValue] = useState(item.valor)

//   const handleSave = () => {
//     if (editedValue.trim()) {
//       onSave(index, editedValue)
//     }
//     setIsEditing(false)
//   }

//   return (
//     <div className="flex items-center gap-2">
//       <Checkbox
//         defaultChecked={item.checked}
//         onCheckedChange={(val) => {
//           const checked = val.valueOf() === true || false
//           handleCheckGoal(index, checked)
//         }}
//         disabled={Number(selectedYear) < dayjs().year()}
//       />
//       {isEditing ? (
//         <>
//           <div className="flex bg-zinc-700 p-[2px] rounded-lg">
//             <input
//               type="text"
//               className="bg-transparent text-sm  "
//               value={editedValue}
//               onChange={(e) => setEditedValue(e.target.value)}
//               onBlur={handleSave}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   handleSave()
//                 }
//               }}
//               autoFocus
//             />
//           </div>
//           <p> &quot;Enter&quot;</p>
//         </>
//       ) : (
//         <>
//           <div className="w-[70%] bg-zinc-700 p-[2px] rounded-lg truncate">
//             <span className="p-2">{item.valor}</span>
//           </div>
//           <div className="cursor-pointer">
//             <Pencil
//               className={`relative bottom-1 right-1`}
//               size={12}
//               onClick={() => setIsEditing(true)}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   )
// }
import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import dayjs from 'dayjs'

export default function EditableObjectiveItem({
  item,
  index,
  handleCheckGoal,
  selectedYear,
  onSave,
}: {
  item: { valor: string; checked: boolean }
  index: number
  handleCheckGoal: (index: number, checked: boolean) => void
  selectedYear: string
  onSave: (index: number, newValue: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(item.valor)

  const handleSave = () => {
    if (editedValue.trim()) {
      onSave(index, editedValue)
    }
    setIsEditing(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        defaultChecked={item.checked}
        onCheckedChange={(val) => {
          const checked = val.valueOf() === true || false
          handleCheckGoal(index, checked)
        }}
        disabled={Number(selectedYear) < dayjs().year()}
      />
      {isEditing ? (
        <>
          <div className="flex bg-zinc-700 p-[2px] rounded-lg">
            <input
              type="text"
              className="bg-transparent text-sm  "
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave()
                }
              }}
              autoFocus
            />
          </div>
          <p> &quot;Enter&quot;</p>
        </>
      ) : (
        <div className="w-[70%] bg-zinc-700 p-[2px] rounded-lg truncate">
          <span className="p-2">{item.valor}</span>
        </div>
      )}
    </div>
  )
}
