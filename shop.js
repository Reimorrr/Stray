console.log('shop.js cargado');

const supabaseUrl = 'https://zguzzimocdjgmjfvirvz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndXp6aW1vY2RqZ21qZnZpcnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5Njc3ODUsImV4cCI6MjA4NTU0Mzc4NX0.TM6XCxux5w2Gi8YFpIv5mUzov3WKURotQHloH0LQYbw';

const client = window.supabase.createClient(supabaseUrl, supabaseKey);

const catalog = document.getElementById('catalog');

/* ------------------ LOAD PRODUCTS ------------------ */
async function loadProducts(category = null) {
  catalog.innerHTML = ''; // limpiar grid

  let query = client.from('products').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return;
  }

  data.forEach(product => {
  let images = [];
  try {
    images = product.image ? JSON.parse(product.image) : [];
  } catch {
    images = product.image ? [product.image] : [];
  }

  const firstImage = images[0] || '';
  const secondImage = images[1] || images[0] || '';

  const link = document.createElement('a');
  link.className = 'product';
  link.href = `product.html?id=${product.id}`;

  // si NO hay stock, lo desactivamos
  if (product.in_stock === false) {
    link.style.opacity = '0.5';
  }

  link.innerHTML = `
    <div class="image">
      <img src="${firstImage}" alt="${product.name}" class="first">
      <img src="${secondImage}" alt="${product.name}" class="second">
    </div>
    <h2>${product.name}</h2>
    <p>${product.price}</p>
    <span class="stock ${product.in_stock ? 'in' : 'out'}">
      ${product.in_stock ? ' ' : 'SIN STOCK'}
    </span>
  `;

  catalog.appendChild(link);
});

}

/* ------------------ MENU HAMBURGUESA ------------------ */
const menuIcon = document.getElementById('menuIcon');
const menu = document.getElementById('menu');
const closeMenu = document.getElementById('closeMenu');
const menuOverlay = document.getElementById('menuOverlay');

function openMenu() {
  menu.classList.add('active');
  menuOverlay.classList.add('active');
}

function closeMenuFunc() {
  menu.classList.remove('active');
  menuOverlay.classList.remove('active');
}

menuIcon.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeMenuFunc);
menuOverlay.addEventListener('click', closeMenuFunc);

/* ------------------ CATEGORY FILTER ------------------ */
document.querySelectorAll('.category').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const category = link.dataset.category;

    if (category === 'all') {
      loadProducts(); // todos
    } else {
      loadProducts(category);
    }

    closeMenuFunc();
  });
});
const headerTitle = document.querySelector("header h1");

let t = 0;

function animateHeader() {
  t += 0.01;

  const rotateX = Math.sin(t) * 6;
  const rotateY = Math.cos(t) * 8;

  headerTitle.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
  `;

  requestAnimationFrame(animateHeader);
}

animateHeader();


/* ------------------ INIT ------------------ */
loadProducts();
