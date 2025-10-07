// Datos iniciales
let properties = [
    {
        id: 1,
        name: 'Casa en la Playa',
        type: 'Casa completa',
        location: 'Miami, FL',
        price: 120,
        rating: 4.8,
        reviews: 142,
        imageUrl: 'https://images.unsplash.com/photo-1517541866997-ea18e32ea9e9?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FzYSUyMGRlJTIwbGElMjBwbGF5YXxlbnwwfHwwfHx8MA%3D%3D',
        description: 'Hermosa casa frente al mar con acceso privado a la playa, piscina y todas las comodidades para una estancia perfecta.'
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
        description: 'Apartamento céntrico con vistas espectaculares a la ciudad, totalmente equipado y cerca de todas las atracciones.'
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
        description: 'Acogedora cabaña en las montañas con chimenea, perfecta para escapadas románticas y amantes de la naturaleza.'
    }
];

let editingPropertyId = null;

// Elementos del DOM
const propertiesGrid = document.getElementById('propertiesGrid');
const modal = document.getElementById('propertyModal');
const modalTitle = document.getElementById('modalTitle');
const propertyForm = document.getElementById('propertyForm');
const addPropertyBtn = document.getElementById('addPropertyBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Cargar propiedades al iniciar
function loadProperties() {
    propertiesGrid.innerHTML = '';
    properties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertiesGrid.appendChild(propertyCard);
    });
}

// Crear tarjeta de propiedad
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow property-card';
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
            
            ${property.description ? `<p class="text-gray-600 text-sm mt-2 line-clamp-2">${property.description}</p>` : ''}
            
            <div class="flex justify-between mt-4">
                <button 
                    onclick="editProperty(${property.id})"
                    class="text-blue-600 hover:text-blue-800 font-medium flex items-center btn-effect"
                >
                    <i class="fas fa-edit mr-1"></i>
                    Editar
                </button>
                
                <button 
                    onclick="deleteProperty(${property.id})"
                    class="text-red-600 hover:text-red-800 font-medium flex items-center btn-effect"
                >
                    <i class="fas fa-trash mr-1"></i>
                    Eliminar
                </button>
            </div>
        </div>
    `;
    return card;
}

// Abrir modal para agregar
addPropertyBtn.addEventListener('click', () => {
    editingPropertyId = null;
    modalTitle.textContent = 'Agregar Nueva Propiedad';
    propertyForm.reset();
    openModal();
});

// Cancelar y cerrar modal
cancelBtn.addEventListener('click', closeModal);

// Enviar formulario
propertyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(propertyForm);
    const propertyData = {
        name: formData.get('name'),
        type: formData.get('type'),
        location: formData.get('location'),
        price: parseFloat(formData.get('price')),
        description: formData.get('description')
    };

    if (editingPropertyId) {
        // Editar propiedad existente
        const propertyIndex = properties.findIndex(p => p.id === editingPropertyId);
        if (propertyIndex !== -1) {
            properties[propertyIndex] = {
                ...properties[propertyIndex],
                ...propertyData
            };
        }
    } else {
        // Agregar nueva propiedad
        const newProperty = {
            id: Date.now(),
            ...propertyData,
            rating: Math.round((Math.random() * 1 + 4) * 10) / 10, // Rating aleatorio entre 4.0 y 5.0
            reviews: Math.floor(Math.random() * 100) + 1, // Reviews aleatorias entre 1 y 100
            imageUrl: 'https://placeholder-image-service.onrender.com/image/600x400?prompt=Beautiful property interior with modern furnishings and stylish decor&id=property-' + Date.now()
        };
        properties.push(newProperty);
    }

    loadProperties();
    closeModal();
});

// Editar propiedad
window.editProperty = function(id) {
    const property = properties.find(p => p.id === id);
    if (property) {
        editingPropertyId = id;
        modalTitle.textContent = 'Editar Propiedad';
        
        document.getElementById('propertyName').value = property.name;
        document.getElementById('propertyType').value = property.type;
        document.getElementById('propertyLocation').value = property.location;
        document.getElementById('propertyPrice').value = property.price;
        document.getElementById('propertyDescription').value = property.description || '';
        
        openModal();
    }
};

// Eliminar propiedad
window.deleteProperty = function(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
        properties = properties.filter(property => property.id !== id);
        loadProperties();
    }
};

// Abrir modal
function openModal() {
    modal.classList.add('open');
}

// Cerrar modal
function closeModal() {
    modal.classList.remove('open');
    editingPropertyId = null;
    setTimeout(() => propertyForm.reset(), 300);
}

// Cerrar modal al hacer clic fuera
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Cargar propiedades al iniciar
document.addEventListener('DOMContentLoaded', loadProperties);