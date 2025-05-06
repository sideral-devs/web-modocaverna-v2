import { Header, HeaderClose, HeaderTitle } from '@/components/header'

export function AffiliatesHeader() {
  return (
    <Header>
      {/* <h1 className="hidden md:block text-xl font-semibold">
        Indique e Ganhe{' '}
      </h1> */}
      <HeaderTitle className="relative left-4" title="Indique e ganhe" />
      <HeaderClose to="area-de-beneficios" />
    </Header>
  )
}
