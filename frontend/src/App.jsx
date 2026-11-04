import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { WhatsApp } from './components/ui.jsx';
import Loader from './components/Loader.jsx';
import { CartDrawer, RecipeModal, Scrim, Toast } from './components/Overlays.jsx';
import { useStore } from './context/StoreContext.jsx';
import Checkout from './pages/Checkout.jsx';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Shop from './pages/Shop.jsx';
import Success from './pages/Success.jsx';

export default function App() {
  const { pathname } = useLocation();
  const { closeCart, closeRecipe } = useStore();
  const [order, setOrder] = useState(null);

  useEffect(() => { scrollTo(0, 0); closeCart(); closeRecipe(); }, [pathname]); // eslint-disable-line

  return (
    <>
      <Loader />
      <Header />
      <main id="app" key={pathname.split('/')[1]} className="enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:cat" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/p/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout onOrder={setOrder} />} />
          <Route path="/order/:id" element={<Success order={order} />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Scrim />
      <CartDrawer />
      <RecipeModal />
      <Toast />
      <WhatsApp />
    </>
  );
}
