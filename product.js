const supabaseUrl = 'https://zguzzimocdjgmjfvirvz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndXp6aW1vY2RqZ21qZnZpcnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5Njc3ODUsImV4cCI6MjA4NTU0Mzc4NX0.TM6XCxux5w2Gi8YFpIv5mUzov3WKURotQHloH0LQYbw'; // tu key real

const client = window.supabase.createClient(supabaseUrl, supabaseKey);

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

async function loadProduct() {
  if (!productId) return console.error('No product id');

  const { data, error } = await client
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  const container = document.getElementById('product');
  const sizes = data.sizes ? data.sizes.split(',') : [];

  // ---- imágenes ----
  let images = [];
  try {
    images = data.image ? JSON.parse(data.image) : [data.image];
  } catch {
    images = [data.image];
  }

  container.innerHTML = `
    <div class="image-gallery">
      <div class="slides">
        ${images.map(img => `<img src="${img}" alt="${data.name}">`).join('')}
      </div>
      <div class="arrow arrow-left">&#10094;</div>
      <div class="arrow arrow-right">&#10095;</div>
    </div>

    <div class="info">
      <h2>${data.name}</h2>
      <p class="price">${data.price}</p>
      <p class="stock ${data.in_stock ? 'in' : 'out'}">
      ${data.in_stock ? 'IN STOCK' : 'OUT OF STOCK'}</p>
      <p class="description">${data.description}</p>

      ${sizes.length > 0 ? `
  <div class="sizes">
    ${sizes.map(size => `
      <button class="size-btn" data-size="${size}">
        ${size}
      </button>
    `).join('')}
  </div>
  <div class="size-error" id="sizeError">
    Selecciona un talle
  </div>
` : ''}


      <a href="#" class="cta" id="buyBtn">COMPRAR VIA WHATSAPP</a>
      <div class="stock-error" id="stockError">SIN STOCK</div>
    </div>
  `;

  // ---- slider ----
  const slides = container.querySelector('.slides');
  const left = container.querySelector('.arrow-left');
  const right = container.querySelector('.arrow-right');
  let currentIndex = 0;

  function updateSlider() {
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  left.addEventListener('click', () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    updateSlider();
  });

  right.addEventListener('click', () => {
    currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    updateSlider();
  });

  // ---- talles ----
  let selectedSize = '';

  const sizeButtons = container.querySelectorAll('.size-btn');
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
  sizeButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = btn.dataset.size;

  const error = document.getElementById('sizeError');
  if (error) error.classList.remove('visible');
});

  });

  // ---- botón comprar ----
  const buyBtn = document.getElementById('buyBtn');
  buyBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (!data.in_stock) {
    const error = document.getElementById('stockError');
    if (error) error.classList.add('visible');
    return;
  }

  if (sizes.length > 0 && !selectedSize) {
    const error = document.getElementById('sizeError');
    if (error) error.classList.add('visible');
    return;
  }

  const productText =
    `${data.name} — ${data.price} ARS` +
    (selectedSize ? ` — Talle: ${selectedSize}` : '');

  const encodedProduct = encodeURIComponent(productText);

  window.location.href = `checkout.html?product=${encodedProduct}&id=${productId}`;
});
if (!data.in_stock) {
  buyBtn.style.opacity = '0.4';
}

}

loadProduct();
