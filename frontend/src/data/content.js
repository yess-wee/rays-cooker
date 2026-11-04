// Home banner slides — photos are free Unsplash images in /public/assets/photos (see manifest.txt there).
export const BANNERS = [
  { photo: 'festive-diya-tray', p: 'trinity', vi: 3, ey: 'Diwali Festive Edit', to: '/shop/all', cta: 'Shop the festive edit',
    h: 'Light up every<br /><i>kitchen</i> this Diwali.', l: 'Flat 40% off MRP across the RAYS range — and a free spare safety valve & gasket with every pressure cooker.' },
  { photo: 'kitchen-stove-steel', p: 'handi', vi: 1, ey: 'Triply Stainless Steel', to: '/shop/triply', cta: 'Shop Triply',
    h: 'Three layers.<br /><i>Zero</i> hotspots.', l: 'SS 304 inside, an Aluminium 19000 core, SS 430 outside — even heat on gas and induction, with a 5-year warranty.' },
  { photo: 'kitchen-tawa', p: 'tawa', vi: 0, ey: 'Pride Concave Tawa', to: '/p/tawa', cta: 'Shop the tawa',
    h: 'Softer phulkas,<br /><i>every</i> morning.', l: 'Hard-anodised and concave, in 225 mm and 250 mm, 3 mm or 4 mm thick. 2-year warranty.' },
];

// Round category tiles under the banner: [link, label, product image]
export const CATEGORY_TILES = [
  ['/shop/cookers', 'Pressure Cookers', '00s_6451_5_3ltr'],
  ['/shop/triply', 'Triply', '00s_6454_6_3ltr'],
  ['/shop/tasra-top', 'Tasra & Top', '22_cm_top'],
  ['/shop/combos', 'Combos', '00s_8092_2_coocker_combo'],
  ['/shop/anodised', 'Hard Anodised', '00t_2216_3-5_ltr'],
  ['/shop/aluminium', 'Aluminium', '00t_2263_2-5_ltr'],
  ['/shop/tawa', 'Roti Tawa', 'pride_concave_tawa_-_225_mm_-_24_piece'],
];

// Deal of the week rotates four of these each Monday.
export const DEAL_POOL = ['trinity', 'tasra', 'black', 'tawa', 'handi', 'top', 'aura', 'combo2', 'pan', 'combo3', 'brass', 'classic'];

export const CATS=[["all","All"],["cookers","Pressure Cookers"],["triply","Triply"],["tasra-top","Tasra & Top"],["combos","Combos"],["anodised","Hard Anodised"],["aluminium","Aluminium"],["tawa","Tawa"]];
