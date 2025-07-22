import { Header, HeaderClose, HeaderTitle } from '@/components/header'
import { StartTourButton } from '@/components/start-tour-button'

export function CommunityHeader() {
  return (
    <Header containerClassName="max-w-7xl">
      <HeaderTitle title="Comunidade Alcateia" />
      <div className="flex gap-2">
        <StartTourButton origin="/comunidade" />
        <HeaderClose to="cursos-e-conhecimentos" />
      </div>
    </Header>
  )
}
