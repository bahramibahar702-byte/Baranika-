import { useParams } from 'react-router-dom'
import Shop from './Shop.jsx'

export default function CategoryPage() {
  const { slug } = useParams()
  return <Shop key={slug} presetCategory={slug} />
}
