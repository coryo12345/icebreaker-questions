
export default async function GamePage({ params }: { params: { id: string } }) {
  return <main>game page: {params.id}</main>;
}
