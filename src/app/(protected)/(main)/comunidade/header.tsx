import { Header, HeaderClose, HeaderTitle } from '@/components/header'

export function CommunityHeader() {
  return (
    <Header containerClassName="max-w-7xl">
      <HeaderTitle title="Comunidade Alcateia" />
      <HeaderClose to="cursos-e-conhecimentos" />
    </Header>
  )
}
