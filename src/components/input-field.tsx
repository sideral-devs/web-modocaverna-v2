// import { cn } from '@/lib/utils'
// import { Eye, EyeOff } from 'lucide-react'
// import { useState } from 'react'
// import {
//   Controller,
//   FieldError,
//   FieldValues,
//   UseControllerProps,
// } from 'react-hook-form'
// import { Input } from './ui/input'

// interface InputFieldProps extends HTMLInputElement {
//   label: string
//   labelStyle?: string
//   secureTextEntry?: boolean
//   containerStyle?: string
//   customLabel?: React.ReactNode
//   inputStyle?: string
//   errors?: FieldError | undefined
// }

// export function InputField<FormType extends FieldValues>({
//   control,
//   name,
//   rules,
//   label,
//   labelStyle,
//   secureTextEntry = false,
//   containerStyle,
//   inputStyle,
//   customLabel,
//   errors,
//   type,
//   className,
//   ...props
// }: UseControllerProps<FormType> & InputFieldProps) {
//   const [showPassword, setShowPassword] = useState(false)

//   return (
//     <Controller
//       control={control}
//       name={name}
//       rules={rules}
//       render={({ field: { onChange, value } }) => (
//         <div className="my-2 w-full gap-1">
//           {customLabel || (
//             <span className={`font-Roboto text-xl text-text ${labelStyle}`}>
//               {label}
//             </span>
//           )}
//           <div
//             className={`flex flex-row w-full h-12 justify-start items-center relative ${containerStyle}`}
//           >
//             <Input
//               className={cn(
//                 'font-Roboto px-2 flex-1 h-full text-left text-text rounded-lg border border-border focus:border-primary',
//                 className,
//               )}
//               type={type}
//               onChange={onChange}
//               autoCapitalize="none"
//               // {...props}
//             />
//             {secureTextEntry && (
//               <div
//                 className="absolute"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <Eye /> : <EyeOff />}
//               </div>
//             )}
//           </div>
//           {errors && (
//             <span className="text-error font-Roboto text-sm">
//               {errors.message}
//             </span>
//           )}
//         </div>
//       )}
//     ></Controller>
//   )
// }
