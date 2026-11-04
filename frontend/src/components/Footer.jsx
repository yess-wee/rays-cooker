import { Logo } from './ui.jsx';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="g">
          <div>
            <Logo light />
            <p className="tag">A kitchen is built on love — and its foundation is <i>quality cookware</i> that lasts a lifetime.</p>
            <div className="news"><input placeholder="Your email for recipes & offers" /><button style={{ color: '#fff' }}>→</button></div>
          </div>
          <div><h4>Shop</h4><ul><li>Triply Pressure Cookers</li><li>Fusion Handi</li><li>Tasra &amp; Top</li><li>Hard Anodised</li><li>Roti Tawa</li></ul></div>
          <div><h4>Help</h4><ul><li>Track Order</li><li>Warranty Registration</li><li>Spare Parts</li><li>Shipping &amp; Returns</li><li>Contact Us</li></ul></div>
          <div><h4>RAYS Makers</h4><ul><li>Our Story</li><li>Triply Technology</li><li>Recipes</li><li>care@raysmakers.com</li><li>www.raysmakers.com</li></ul></div>
        </div>
        <div className="huge">RΛYS</div>
        <div className="copy"><span>© 2026 Rays Makers Pvt. Ltd. · Rajkot, Gujarat</span><span>Concept store — payments are simulated · Food photos: Wikimedia Commons contributors (CC BY / BY-SA)</span></div>
      </div>
    </footer>
  );
}
