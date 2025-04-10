document.addEventListener('DOMContentLoaded', function() {
    // Cargar categorías al iniciar
    loadCategories();

    // Manejar formulario de búsqueda
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = document.getElementById('search-input').value;
            searchCategories(searchTerm);
        });
    }
});

async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const data = await response.json();

        if (response.ok) {
            renderCategories(data);
        } else {
            showAlert('Error al cargar categorías', 'danger');
        }
    } catch (error) {
        showAlert('Error de conexión', 'danger');
    }
}

function renderCategories(categories) {
    const tbody = document.querySelector('#categories-table tbody');
    tbody.innerHTML = '';

    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.nombre}</td>
            <td>${category.descripcion || '-'}</td>
            <td>${category.cantidad_productos || 0}</td>
            <td>
                <span class="badge ${category.estatus ? 'badge-success' : 'badge-secondary'}">
                    ${category.estatus ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <a href="/admin/categories/edit/${category.id_categoria}" class="btn btn-sm btn-info">
                    <i class="fas fa-edit"></i>
                </a>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${category.id_categoria}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Agregar event listeners a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoryId = this.getAttribute('data-id');
            deleteCategory(categoryId);
        });
    });
}

async function deleteCategory(id) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showAlert('Categoría eliminada correctamente', 'success');
                loadCategories(); // Recargar la lista
            } else {
                const error = await response.json();
                showAlert(error.message || 'Error al eliminar', 'danger');
            }
        } catch (error) {
            showAlert('Error de conexión', 'danger');
        }
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert">
            <span>&times;</span>
        </button>
    `;

    const container = document.querySelector('.content');
    container.prepend(alertDiv);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}