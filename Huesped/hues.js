// Propiedades disponibles (mismas que en anfitrión)
const properties = [
    {
        id: 1,
        name: 'Casa en la Playa',
        type: 'Casa completa',
        location: 'Miami, FL',
        price: 120,
        rating: 4.8,
        reviews: 142,
        imageUrl: 'https://images.unsplash.com/photo-1517541866997-ea18e32ea9e9?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FzYSUyMGRlJTIwbGElMjBwbGF5YXxlbnwwfHwwfHx8MA%3D%3D',
        description: 'Hermosa casa frente al mar con acceso privado a la playa, piscina y todas las comodidades para una estancia perfecta.',
        available: true
    },
    {
        id: 2,
        name: 'Apartamento Moderno',
        type: 'Apartamento',
        location: 'Nueva York, NY',
        price: 95,
        rating: 4.6,
        reviews: 89,
        imageUrl: 'https://st.depositphotos.com/1407231/54920/i/450/depositphotos_549207960-stock-photo-modern-loft-style-apartment-interior.jpg',
        description: 'Apartamento céntrico con vistas espectaculares a la ciudad, totalmente equipado y cerca de todas las atracciones.',
        available: true
    },
    {
        id: 3,
        name: 'Cabaña Montaña',
        type: 'Cabaña',
        location: 'Aspen, CO',
        price: 150,
        rating: 4.9,
        reviews: 76,
        imageUrl: 'https://www.shutterstock.com/image-photo/old-wooden-hut-cabin-mountain-600nw-241091683.jpg',
        description: 'Acogedora cabaña en las montañas con chimenea, perfecta para escapadas románticas y amantes de la naturaleza.',
        available: true
    }
];

// Reservas del huésped (iniciales para demo)
let reservations = [
    {
        id: 1,
        propertyId: 1,
        propertyName: 'Casa en la Playa',
        checkIn: '2024-01-15',
        checkOut: '2024-01-20',
        guests: 4,
        totalPrice: 600,
        status: 'Confirmada',
        specialRequests: ''
    },
    {
        id: 2,
        propertyId: 2,
        propertyName: 'Apartamento Moderno',
        checkIn: '2024-02-10',
        checkOut: '2024-02-14',
        guests: 2,
        totalPrice: 380,
        status: 'Pendiente',
        specialRequests: ''
    }
];

// Elementos del DOM
const propertiesGrid = document.getElementById('propertiesGrid');
const reservationsSection = document.getElementById('reservationsSection');
const reservationsList = document.getElementById('reservationsList');
const modal = document.getElementById('propertyModal');
const modalTitle = document.getElementById('modalTitle');
const propertyDetails = document.getElementById('propertyDetails');
const propertyForm = document.getElementById('reservationForm');
const myReservationsBtn = document.getElementById('myReservationsBtn');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelReservationBtn = document.getElementById('cancelReservationBtn');
const submitBtnText = document.getElementById('submitBtnText');

let selectedProperty = null;
let editingReservationId = null;

// Cargar propiedades iniciales
function loadProperties(filteredProperties = properties) {
    propertiesGrid.innerHTML = '';
    filteredProperties.forEach(property => {
        if (property.available) {
            const propertyCard = createPropertyCard(property);
            propertiesGrid.appendChild(propertyCard);
        }
    });
}

// Crear tarjeta de propiedad
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow property-card cursor-pointer';
    
    // Estructura interna
    card.innerHTML = `
        <div class="relative overflow-hidden">
            <img 
                src="${property.imageUrl}" 
                alt="${property.name}"
                class="w-full h-48 object-cover property-image"
            />
            <div class="absolute top-2 right-2 bg-white rounded-full p-1">
                <div class="flex items-center bg-blue-50 rounded-full px-2 py-1">
                    <i class="fas fa-star text-yellow-500 mr-1 text-xs"></i>
                    <span class="text-sm font-medium">${property.rating}</span>
                    <span class="text-xs text-gray-500 ml-1">(${property.reviews})</span>
                </div>
            </div>
        </div>
        <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800">${property.name}</h3>
            <p class="text-gray-600 text-sm mt-1">${property.type}</p>
            <p class="text-gray-600 text-sm flex items-center mt-1">
                <i class="fas fa-map-marker-alt mr-1"></i>
                ${property.location}
            </p>
            <p class="text-xl font-bold text-gray-900 mt-2">$${property.price} <span class="text-sm font-normal text-gray-600">/ noche</span></p>
            <p class="text-gray-600 text-sm mt-2 line-clamp-2">${property.description}</p>
            <button class="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 btn-effect reserve-btn">
                <i class="fas fa-calendar mr-2"></i>Reservar
            </button>
        </div>
    `;

    // Solo el botón "Reservar" debe abrir el modal, no toda la tarjeta
    const reserveBtn = card.querySelector('.reserve-btn');
    reserveBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el click se propague al card
        openPropertyModal(property);
    });

    return card;
}

// Abrir modal de propiedad para reservar o editar reserva
function openPropertyModal(property) {
    selectedProperty = property;
    editingReservationId = null;
    modalTitle.textContent = `Reservar ${property.name}`;
    submitBtnText.textContent = 'Reservar Ahora';
    cancelReservationBtn.classList.add('hidden');
    
    propertyDetails.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <img src="${property.imageUrl}" alt="${property.name}" class="w-full h-64 object-cover rounded-lg" />
            <div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">${property.name}</h3>
                <p class="text-gray-600 mb-2">${property.type} • ${property.location}</p>
                <div class="flex items-center mb-4">
                    <i class="fas fa-star text-yellow-500 mr-1"></i>
                    <span class="font-medium">${property.rating}</span>
                    <span class="text-gray-500 ml-1">(${property.reviews} reseñas)</span>
                </div>
                <p class="text-gray-700 mb-4">${property.description}</p>
                <p class="text-xl font-bold text-gray-900">$${property.price} por noche</p>
            </div>
        </div>
    `;
    
    // Limpiar formulario
    propertyForm.reset();
    
    openModal();
}

// Abrir modal
function openModal() {
    modal.classList.add('open');
}

// Cerrar modal
function closeModal() {
    modal.classList.remove('open');
    selectedProperty = null;
    editingReservationId = null;
    propertyForm.reset();
}

// Mostrar lista de reservas
function loadReservations() {
    reservationsList.innerHTML = '';
    if (reservations.length === 0) {
        reservationsList.innerHTML = '<p class="text-gray-600">No tienes reservas aún.</p>';
        return;
    }
    reservations.forEach(res => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-xl shadow-md reservation-card flex flex-col md:flex-row justify-between items-start md:items-center';
        card.innerHTML = `
            <div>
                <h3 class="text-lg font-semibold">${res.propertyName}</h3>
                <p class="text-gray-600">Desde: <strong>${res.checkIn}</strong> Hasta: <strong>${res.checkOut}</strong></p>
                <p class="text-gray-600">Huéspedes: ${res.guests}</p>
                <p class="text-gray-600">Total: $${res.totalPrice.toFixed(2)}</p>
                <p class="text-gray-600">Estado: <span class="font-semibold">${res.status}</span></p>
                ${res.specialRequests ? `<p class="text-gray-600 italic">Solicitudes: ${res.specialRequests}</p>` : ''}
            </div>
            <div class="mt-4 md:mt-0 flex space-x-2">
                <button class="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 rounded-md text-white btn-effect" onclick="editReservation(${res.id})">
                    <i class="fas fa-edit"></i> Modificar
                </button>
                <button class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white btn-effect" onclick="deleteReservation(${res.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        reservationsList.appendChild(card);
    });
}

// Editar reserva
function editReservation(id) {
    const res = reservations.find(r => r.id === id);
    if (!res) return;

    selectedProperty = properties.find(p => p.id === res.propertyId);
    editingReservationId = id;
    modalTitle.textContent = `Modificar Reserva - ${selectedProperty.name}`;
    submitBtnText.textContent = 'Guardar Cambios';
    cancelReservationBtn.classList.remove('hidden');

    propertyDetails.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <img src="${selectedProperty.imageUrl}" alt="${selectedProperty.name}" class="w-full h-64 object-cover rounded-lg" />
            <div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">${selectedProperty.name}</h3>
                <p class="text-gray-600 mb-2">${selectedProperty.type} • ${selectedProperty.location}</p>
                <div class="flex items-center mb-4">
                    <i class="fas fa-star text-yellow-500 mr-1"></i>
                    <span class="font-medium">${selectedProperty.rating}</span>
                    <span class="text-gray-500 ml-1">(${selectedProperty.reviews} reseñas)</span>
                </div>
                <p class="text-gray-700 mb-4">${selectedProperty.description}</p>
                <p class="text-xl font-bold text-gray-900">$${selectedProperty.price} por noche</p>
            </div>
        </div>
    `;

    // Rellenar formulario con datos de reserva
    document.getElementById('modalCheckIn').value = res.checkIn;
    document.getElementById('modalCheckOut').value = res.checkOut;
    document.getElementById('guests').value = res.guests;
    document.getElementById('specialRequests').value = res.specialRequests || '';

    openModal();
}

// Eliminar reserva
function deleteReservation(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
        reservations = reservations.filter(r => r.id !== id);
        loadReservations();
        alert('Reserva eliminada.');
    }
}

// Manejar envío del formulario de reserva/modificación
propertyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!selectedProperty) {
        alert('No se ha seleccionado ninguna propiedad.');
        return;
    }

    const checkIn = document.getElementById('modalCheckIn').value;
    const checkOut = document.getElementById('modalCheckOut').value;
    const guests = parseInt(document.getElementById('guests').value);
    const specialRequests = document.getElementById('specialRequests').value.trim();

    if (!checkIn || !checkOut) {
        alert('Por favor, selecciona fechas válidas.');
        return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
        alert('La fecha de salida debe ser posterior a la de entrada.');
        return;
    }
    if (guests < 1) {
        alert('El número de huéspedes debe ser al menos 1.');
        return;
    }

    // Calcular noches
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalPrice = diffDays * selectedProperty.price;

    if (editingReservationId) {
        // Modificar reserva existente
        const index = reservations.findIndex(r => r.id === editingReservationId);
        if (index !== -1) {
            reservations[index] = {
                ...reservations[index],
                checkIn,
                checkOut,
                guests,
                totalPrice,
                specialRequests
            };
            alert('Reserva modificada correctamente.');
        }
    } else {
        // Crear nueva reserva
        const newReservation = {
            id: Date.now(),
            propertyId: selectedProperty.id,
            propertyName: selectedProperty.name,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            status: 'Pendiente',
            specialRequests
        };
        reservations.push(newReservation);
        alert('Reserva creada correctamente.');
    }

    closeModal();
    loadReservations();
    showReservationsSection();
});

// Mostrar/ocultar sección de reservas
myReservationsBtn.addEventListener('click', () => {
    if (reservationsSection.classList.contains('hidden')) {
        showReservationsSection();
    } else {
        reservationsSection.classList.add('hidden');
    }
});

function showReservationsSection() {
    reservationsSection.classList.remove('hidden');
    loadReservations();
    // Scroll a sección reservas
    reservationsSection.scrollIntoView({ behavior: 'smooth' });
}

// Cerrar modal
closeModalBtn.addEventListener('click', closeModal);
cancelReservationBtn.addEventListener('click', () => {
    closeModal();
});

// Cerrar modal al hacer clic fuera del contenido
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Aplicar filtros y mostrar propiedades filtradas
applyFiltersBtn.addEventListener('click', () => {
    const location = document.getElementById('locationFilter').value.toLowerCase();
    const type = document.getElementById('typeFilter').value;
    const maxPrice = parseFloat(document.getElementById('priceFilter').value) || Infinity;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    let filtered = properties.filter(property => {
        const matchesLocation = !location || property.location.toLowerCase().includes(location);
        const matchesType = !type || property.type === type;
        const matchesPrice = property.price <= maxPrice;
        // Para demo, no filtramos por fechas reales
        const matchesDates = true;
        return matchesLocation && matchesType && matchesPrice && matchesDates && property.available;
    });

    loadProperties(filtered);
    // Ocultar sección reservas si visible
    reservationsSection.classList.add('hidden');
});

// Cargar propiedades al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadProperties();
});