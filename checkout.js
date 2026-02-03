// ---------- Obtener parámetros de URL ----------
const params = new URLSearchParams(window.location.search);
const encodedProduct = params.get('product') || '';
const productId = params.get('id');

// ---------- Configurar botón Back ----------
const backBtn = document.getElementById('backBtn');

backBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.history.back();
});


// ---------- Selección de tipo de envío ----------
const deliverySelect = document.getElementById('deliveryType');
const formContainer = document.getElementById('checkoutForm');

// Función para crear un input
function createInput({ label, id, type = 'text', placeholder = '' }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-group';

  const lab = document.createElement('label');
  lab.htmlFor = id;
  lab.textContent = label;

  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  input.placeholder = placeholder;
  input.required = true;

  wrapper.appendChild(lab);
  wrapper.appendChild(input);

  return wrapper;
}

// Función para renderizar el formulario según tipo
function renderForm(type) {
  formContainer.innerHTML = ''; // limpiar contenido anterior

  if (type === 'domicilio') {
    const fields = [
      { label: 'Nombre y Apellido', id: 'name' },
      { label: 'Provincia', id: 'province' },
      { label: 'Localidad', id: 'city' },
      { label: 'Dirección', id: 'address' },
      { label: 'Código Postal', id: 'zip' },
      { label: 'Correo Electrónico', id: 'email', type: 'email' },
      { label: 'Código de Área', id: 'area' },
      { label: 'Celular', id: 'phone' },
    ];
    fields.forEach(f => formContainer.appendChild(createInput(f)));
  } else if (type === 'sucursal') {
    const fields = [
      { label: 'Nombre y Apellido', id: 'name' },
      { label: 'Provincia', id: 'province' },
      { label: 'Sucursal de Destino', id: 'branch' },
      { label: 'Correo Electrónico', id: 'email', type: 'email' },
      { label: 'Código de Área', id: 'area' },
      { label: 'Celular', id: 'phone' },
    ];
    fields.forEach(f => formContainer.appendChild(createInput(f)));
  }

  // Agregar botón enviar dentro del form
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Comprar Via WhatsApp';
  submitBtn.className = 'cta';
  formContainer.appendChild(submitBtn);
}

// Renderizar formulario si ya hay valor
if (deliverySelect.value) renderForm(deliverySelect.value);

// Cambiar formulario al cambiar selector
deliverySelect.addEventListener('change', () => renderForm(deliverySelect.value));

// ---------- Manejar envío ----------
formContainer.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = {};
  formContainer.querySelectorAll('input').forEach(input => {
    formData[input.id] = input.value.trim();
  });

  // Validar campos
  for (const key in formData) {
    if (!formData[key]) {
      alert('Por favor completa todos los campos.');
      return;
    }
  }

  // Construir mensaje
  let message = `Hola! Quiero comprar: ${encodedProduct}%0A`;
  message += `Tipo de envío: ${deliverySelect.value}%0A`;
  for (const key in formData) {
    message += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${formData[key]}%0A`;
  }

  // Abrir WhatsApp
  const whatsappNumber = '5492284540990';
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.location.href = whatsappURL;
});
