import TopBar from '../components/layout/TopBar'
import Footer from '../components/layout/Footer'
import NewProductIntro from '../components/newproduct/NewProductIntro'
import NewProductForm from '../components/newproduct/NewProductForm'
import '../styles/new_product.css'

export default function NewProductPage() {
  return (
    <>
      <TopBar backTo="/coleccion" backLabel="[VOLVER A LA COLECCIÓN]" />
      <main className="layout new-product-page">
        <NewProductIntro />
        <NewProductForm />
      </main>
      <Footer />
    </>
  )
}
