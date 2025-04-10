from flask import Flask, render_template, request, session, redirect, flash, url_for, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

# Instancia de Flask
flask_app = Flask(__name__)

@flask_app.route('/')
def index():
    return render_template('index.html')

# Configuración de la conexión a la base de datos
db_config = {
    'user': 'root',
    'password': '',  # Cambia esto si tienes una contraseña
    'host': '127.0.0.1',
    'port': 3306,
    'database': 'comicstore'  # Cambia esto por el nombre de tu base de datos
}

# Crear una conexión a la base de datos
try:
    db_connection = mysql.connector.connect(**db_config)
    print("Conexión exitosa a la base de datos")
except mysql.connector.Error as err:
    print(f"Error al conectar a la base de datos: {err}")

# Configuración de la clave secreta para las sesiones
flask_app.secret_key = 'clave_secreta_segura'

# Ejemplo de ruta que usa la base de datos
@flask_app.route('/admin/example-db')
def example_db():
    try:
        cursor = db_connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM clientes")  # Cambia esto por tu consulta
        results = cursor.fetchall()
        return render_template('admin/example-db.html', data=results)
    except mysql.connector.Error as err:
        return f"Error al ejecutar la consulta: {err}"
    finally:
        cursor.close()

# Rutas para las vistas de administración
# Rutas para la gestión de categorías
@flask_app.route('/admin/categories', methods=['GET'])
def admin_categories():
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        # Obtener todas las categorías con conteo de productos
        cursor.execute("""
            SELECT c.*, COUNT(pc.id_producto) as cantidad_productos 
            FROM categorias c
            LEFT JOIN productos_categorias pc ON c.id_categoria = pc.id_categoria
            GROUP BY c.id_categoria
            ORDER BY c.nombre
        """)
        categories = cursor.fetchall()
        
        # Obtener todos los estatus para el filtrado
        cursor.execute("SELECT * FROM estatus")
        statuses = cursor.fetchall()
        
        return render_template('admin/categories.html', 
                             categories=categories, 
                             statuses=statuses)
        
    except mysql.connector.Error as err:
        flash(f'Error al obtener las categorías: {err}', 'danger')
        return render_template('admin/categories.html', 
                             categories=[], 
                             statuses=[])
    finally:
        cursor.close()

@flask_app.route('/admin/categories/add', methods=['GET', 'POST'])
def admin_categories_add():
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        icon = request.form.get('icon')
        status = request.form.get('status', 1)  # Default a Activo
        
        try:
            cursor = db_connection.cursor()
            cursor.execute(
                "INSERT INTO categorias (nombre, descripcion, icono, estatus) VALUES (%s, %s, %s, %s)",
                (name, description, icon, status)
            )
            db_connection.commit()
            flash('Categoría añadida exitosamente', 'success')
            return redirect(url_for('admin_categories'))
        except mysql.connector.Error as err:
            db_connection.rollback()
            flash(f'Error al añadir categoría: {err}', 'danger')
        finally:
            cursor.close()
    
    # GET request - mostrar formulario
    try:
        cursor = db_connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM estatus")
        statuses = cursor.fetchall()
        return render_template('admin/categories/add-categories.html', 
                             statuses=statuses)
    except mysql.connector.Error as err:
        flash(f'Error al cargar el formulario: {err}', 'danger')
        return redirect(url_for('admin_categories'))
    finally:
        cursor.close()

@flask_app.route('/admin/categories/edit/<int:id>', methods=['GET', 'POST'])
def admin_categories_edit(id):
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        icon = request.form.get('icon')
        status = request.form.get('status')
        
        try:
            cursor = db_connection.cursor()
            cursor.execute(
                "UPDATE categorias SET nombre = %s, descripcion = %s, icono = %s, estatus = %s WHERE id_categoria = %s",
                (name, description, icon, status, id)
            )
            db_connection.commit()
            flash('Categoría actualizada exitosamente', 'success')
            return redirect(url_for('admin_categories'))
        except mysql.connector.Error as err:
            db_connection.rollback()
            flash(f'Error al actualizar categoría: {err}', 'danger')
        finally:
            cursor.close()
    
    # GET request - mostrar formulario con datos actuales
    try:
        cursor = db_connection.cursor(dictionary=True)
        
        # Obtener la categoría a editar
        cursor.execute("SELECT * FROM categorias WHERE id_categoria = %s", (id,))
        category = cursor.fetchone()
        
        if not category:
            flash('Categoría no encontrada', 'danger')
            return redirect(url_for('admin_categories'))
        
        # Obtener todos los estatus
        cursor.execute("SELECT * FROM estatus")
        statuses = cursor.fetchall()
        
        return render_template('admin/categories/edit-categories.html', 
                             category=category, 
                             statuses=statuses)
        
    except mysql.connector.Error as err:
        flash(f'Error al cargar la categoría: {err}', 'danger')
        return redirect(url_for('admin_categories'))
    finally:
        cursor.close()

@flask_app.route('/admin/categories/delete/<int:id>', methods=['POST'])
def admin_categories_delete(id):
    try:
        cursor = db_connection.cursor()
        
        # Verificar si la categoría tiene productos asociados
        cursor.execute("SELECT COUNT(*) FROM productos_categorias WHERE id_categoria = %s", (id,))
        count = cursor.fetchone()[0]
        
        if count > 0:
            flash('No se puede eliminar la categoría porque tiene productos asociados', 'danger')
            return redirect(url_for('admin_categories'))
        
        # Eliminar la categoría
        cursor.execute("DELETE FROM categorias WHERE id_categoria = %s", (id,))
        db_connection.commit()
        flash('Categoría eliminada exitosamente', 'success')
        
    except mysql.connector.Error as err:
        db_connection.rollback()
        flash(f'Error al eliminar categoría: {err}', 'danger')
    finally:
        cursor.close()
    
    return redirect(url_for('admin_categories'))

@flask_app.route('/admin/categories/search', methods=['GET'])
def admin_categories_search():
    search_term = request.args.get('q', '')
    
    try:
        cursor = db_connection.cursor(dictionary=True)
        query = """
            SELECT c.*, COUNT(pc.id_producto) as cantidad_productos 
            FROM categorias c
            LEFT JOIN productos_categorias pc ON c.id_categoria = pc.id_categoria
            WHERE c.nombre LIKE %s OR c.descripcion LIKE %s
            GROUP BY c.id_categoria
            ORDER BY c.nombre
        """
        cursor.execute(query, (f'%{search_term}%', f'%{search_term}%'))
        categories = cursor.fetchall()
        
        return jsonify(categories)
        
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()

@flask_app.route('/admin/customers')
def admin_customers():
    return render_template('admin/customers.html')

@flask_app.route('/admin/dashboard')
def admin_dashboard():
    return render_template('admin/dashboard.html')

@flask_app.route('/admin/forgotpsw')
def admin_forgotpsw():
    return render_template('admin/forgotpsw.html')

@flask_app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        correo = request.form['email']
        password = request.form['password']
        remember = 'remember' in request.form  # Cambio en cómo se verifica el remember
        
        try:
            cursor = db_connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM usuarios WHERE correo = %s AND tipo_usuario = 'Administrador'", (correo,))
            user = cursor.fetchone()
            
            if user:
                # Verificar contraseña (asumiendo que no está hasheada en la BD)
                if user['password'] == password:  # Cambiar esto si hasheas las contraseñas
                    session['admin_id'] = user['id_usuario']
                    session['admin_name'] = user['nombre']
                    session['admin_logged_in'] = True
                    
                    if remember:
                        session.permanent = True
                    flash('Inicio de sesión exitoso', 'success')
                    return redirect('/admin/dashboard')
                else:
                    flash('Contraseña incorrecta', 'danger')
            else:
                flash('Usuario no encontrado o no tienes permisos de administrador', 'danger')
        except mysql.connector.Error as err:
            flash('Error al conectar con la base de datos. Por favor, inténtalo más tarde.', 'danger')
        finally:
            cursor.close()

    return render_template('admin/login.html')

@flask_app.route('/admin/logout')
def admin_logout():
    session.pop('admin_id', None)
    session.pop('admin_name', None)
    flash('Has cerrado sesión exitosamente', 'success')
    return redirect('/admin/login')

@flask_app.route('/admin/orders')
def admin_orders():
    return render_template('admin/orders.html')



@flask_app.route('/admin/profile')
def admin_profile():
    return render_template('admin/profile.html')

@flask_app.route('/admin/publishers')
def admin_publishers():
    return render_template('admin/publishers.html')

@flask_app.route('/admin/settings')
def admin_settings():
    return render_template('admin/settings.html')

@flask_app.route('/admin/suppliers')
def admin_suppliers():
    return render_template('admin/suppliers.html')

@flask_app.route('/admin/supply-orders')
def admin_supply_orders():
    return render_template('admin/supply-orders.html')

@flask_app.route('/admin/users')
def admin_users():
    return render_template('admin/users.html')

# si 
@flask_app.route('/admin/categories/add-categories')
def admin_categories_add_categories():
    return render_template('admin/categories/add-categories.html')

@flask_app.route('/admin/categories/edit-categories')
def admin_categories_edit_categories():
    return render_template('admin/categories/edit-categories.html')

@flask_app.route('/admin/customers/add-customers')
def admin_customers_add_customers():
    return render_template('admin/customers/add-customers.html')

@flask_app.route('/admin/customers/edit-customers')
def admin_customers_edit_customers():
    return render_template('admin/customers/edit-customers.html')

@flask_app.route('/admin/orders/add-orders')
def admin_orders_add_orders():
    return render_template('admin/orders/add-orders.html')

@flask_app.route('/admin/orders/edit-orders')
def admin_orders_edit_orders():
    return render_template('admin/orders/edit-orders.html')

@flask_app.route('/admin/products/add-products')
def admin_products_add_products():
    return render_template('admin/products/add-products.html')

@flask_app.route('/admin/products/edit-products')
def admin_products_edit_products():
    return render_template('admin/products/edit-products.html')

@flask_app.route('/admin/products/detail-products')
def admin_products_detail_products():
    return render_template('admin/products/detail-products.html')


# Rutas para las vistas de cliente
@flask_app.route('/cliente/account')
def cliente_account():
    return render_template('cliente/account.html')

@flask_app.route('/cliente/address')
def cliente_address():
    return render_template('cliente/address.html')

@flask_app.route('/cliente/cart')
def cliente_cart():
    return render_template('cliente/cart.html')

@flask_app.route('/cliente/comics')
def cliente_comics():
    return render_template('cliente/comics.html')

@flask_app.route('/cliente/details')
def cliente_details():
    return render_template('cliente/details.html')

@flask_app.route('/cliente/forgotpsw')
def cliente_forgotpsw():
    return render_template('cliente/forgotpsw.html')

@flask_app.route('/cliente/grafic-novels')
def cliente_grafic_novels():
    return render_template('cliente/grafic-novels.html')

@flask_app.route('/cliente/index')
def cliente_index():
    return render_template('cliente/index.html')

@flask_app.route('/cliente/login')
def cliente_login():
    return render_template('cliente/login.html')

@flask_app.route('/cliente/membership')
def cliente_membership():
    return render_template('cliente/membership.html')

@flask_app.route('/cliente/order-confirmation')
def cliente_order_confirmation():
    return render_template('cliente/order-confirmation.html')

@flask_app.route('/cliente/order')
def cliente_order():
    return render_template('cliente/order.html')

@flask_app.route('/cliente/product-details')
def cliente_product_details():
    return render_template('cliente/product-details.html')

@flask_app.route('/cliente/register')
def cliente_register():
    return render_template('cliente/register.html')

@flask_app.route('/cliente/wishlist')
def cliente_wishlist():
    return render_template('cliente/wishlist.html')

if __name__ == '__main__':
    flask_app.run(host="127.0.0.1", port=5001)