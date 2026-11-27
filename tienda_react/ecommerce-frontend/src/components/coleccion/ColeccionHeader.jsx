import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartSummary from './CartSummary'
import UsuarioEstado from '../layout/UsuarioEstado'
import logo from '../../assets/logokult.png'

export default function ColeccionHeader({ search, onSearchChange, cart, cartOpen, onCartToggle }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const contador = String(cart.length).padStart(2, '0')

  return (
    <>
      <div className="ticker mono">
        <div className="wrap">
          <span><b>■</b> System // Online</span>
          <span className="mid">Drop 04 / Catálogo oficial • Envíos a todo el país • Unidades numeradas</span>
          <span className="loc">Loc: BOG // Colombia &nbsp; <b>V.4.02</b></span>
        </div>
      </div>

      <header className="site">
        <div className="wrap">
          <Link className="brand" to="/coleccion">
            <img src={logo} alt="Logo KULT Studio" height="35px" />
            <span><b>KULT</b><small>Studio // Lab</small></span>
          </Link>

          <nav className={`main ${menuOpen ? 'open' : ''}`} id="nav" aria-label="Navegación principal">
            <Link to="/coleccion" className="on" aria-current="page">Colección</Link>
            <a href="#catalogo">Novedades</a>
            <Link to="/coleccion">Gráficas</Link>
            <Link to="/coleccion">Oversized</Link>
            <Link to="/login">Acceso Clientes</Link>
            <Link to="/registro">Registro</Link>
            <Link to="/new_product">Nuevo producto</Link>
          </nav>

          <div className="tools">
            <label className="search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" />
              </svg>
              <input
                type="search"
                placeholder="Buscar prendas..."
                aria-label="Buscar"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              <kbd>⌘K</kbd>
            </label>

            <span className="cur">COP</span>

            <button className="icon-btn" aria-label="Favoritos" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s-8-5-8-11a5 5 0 019-3 5 5 0 019 3c0 6-8 11-8 11z" />
              </svg>
              <i>0</i>
            </button>

            <div className="cart-container">
              <button
                type="button"
                className="cart"
                id="cart-btn"
                aria-label="Carrito de compras"
                aria-expanded={cartOpen}
                onClick={onCartToggle}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 7h14l-1 14H6zM9 7a3 3 0 016 0" />
                </svg>
                <span className="mono">Carrito</span>
                <b>{contador}</b>
              </button>

              <CartSummary items={cart} open={cartOpen} />
            </div>

            <button
              className="burger"
              type="button"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="nav"
              onClick={() => setMenuOpen((valor) => !valor)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="usuario-estado-dock">
        <UsuarioEstado />
      </div>
    </>
  )
}
