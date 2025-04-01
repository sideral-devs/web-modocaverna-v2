import { Header, HeaderClose, HeaderTitle } from '@/components/header'

export function NotesHeader() {
  return (
    <Header className="max-w-none">
      <HeaderTitle
        title="ANOTAÇÕES"
        className="border-zinc-500"
        spanClassName="text-white"
      />
      <HeaderClose />
    </Header>
  )
}
