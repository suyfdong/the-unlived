import DetailPage from '@/components/DetailPage'
import Navigation from '@/components/Navigation'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <Navigation />
      <DetailPage id={params.id} />
    </>
  )
}
