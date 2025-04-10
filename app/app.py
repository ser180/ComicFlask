from flask import Flask, render_template, request, session, redirect, flash, url_for, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import os

# Instancia de Flask
app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'clave_secreta_segura')


class ComicsAPI:
    BASE_URL = "https://comics2.onrender.com"
    TIMEOUT = 10  # segundos

    @classmethod
    def _get_session(cls):
        session = requests.Session()
        retries = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[500, 502, 503, 504]
        )
        session.mount('https://', HTTPAdapter(max_retries=retries))
        return session

    # Métodos para categorías
    @classmethod
    def get_categorias(cls):
        session = cls._get_session()
        try:
            response = session.get(
                f"{cls.BASE_URL}/categorias/",
                timeout=cls.TIMEOUT
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener categorías: {str(e)}")
            raise

    @classmethod
    def crear_categoria(cls, categoria_data):
        session = cls._get_session()
        try:
            response = session.post(
                f"{cls.BASE_URL}/categorias/",
                json=categoria_data,
                timeout=cls.TIMEOUT
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error al crear categoría: {str(e)}")
            raise

    @classmethod
    def actualizar_categoria(cls, categoria_id, categoria_data):
        session = cls._get_session()
        try:
            response = session.put(
                f"{cls.BASE_URL}/categorias/{categoria_id}",
                json=categoria_data,
                timeout=cls.TIMEOUT
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error al actualizar categoría: {str(e)}")
            raise

    @classmethod
    def eliminar_categoria(cls, categoria_id):
        session = cls._get_session()
        try:
            response = session.delete(
                f"{cls.BASE_URL}/categorias/{categoria_id}",
                timeout=cls.TIMEOUT
            )
            response.raise_for_status()
            return response.status_code == 204
        except requests.exceptions.RequestException as e:
            print(f"Error al eliminar categoría: {str(e)}")
            raise

    # Métodos para productos
    @classmethod
    def get_productos(cls):
        session = cls._get_session()
        try:
            response = session.get(
                f"{cls.BASE_URL}/productos/",
                timeout=cls.TIMEOUT
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener productos: {str(e)}")
            raise

    # Métodos para clientes
    @classmethod
    def get_clientes(cls):
        session = cls._get_session()
        try:
            response = session.get(
                f"{cls.BASE_URL}/clientes/",
                timeout=cls.TIMEOUT
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener clientes: {str(e)}")
            raise

    # Métodos para autenticación
    @classmethod
    def login_admin(cls, email, password):
        session = cls._get_session()
        try:
            response = session.post(
                f"{cls.BASE_URL}/admin/login",
                json={"email": email, "password": password},
                timeout=cls.TIMEOUT
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error en login: {str(e)}")
            raise

    @classmethod
    def login_cliente(cls, email, password):
        session = cls._get_session()
        try:
            response = session.post(
                f"{cls.BASE_URL}/cliente/login",
                json={"email": email, "password": password},
                timeout=cls.TIMEOUT
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error en login cliente: {str(e)}")
            raise


# Rutas principales
@app.route('/')
def index():
    return render_template('index.html')


# Rutas de administración
@app.route('/admin/dashboard')
def admin_dashboard():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))
    return render_template('admin/dashboard.html')


@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        try:
            user_data = ComicsAPI.login_admin(
                request.form['email'],
                request.form['password']
            )

            session['admin_id'] = user_data['id_usuario']
            session['admin_name'] = user_data['nombre']
            session['admin_logged_in'] = True

            if 'remember' in request.form:
                session.permanent = True

            flash('Inicio de sesión exitoso', 'success')
            return redirect(url_for('admin_dashboard'))

        except requests.exceptions.HTTPError as err:
            if err.response.status_code == 401:
                flash('Credenciales incorrectas', 'danger')
            else:
                flash('Error en el servidor', 'danger')
        except requests.exceptions.RequestException as err:
            flash('Error de conexión', 'danger')

    return render_template('admin/login.html')


@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_id', None)
    session.pop('admin_name', None)
    session.pop('admin_logged_in', None)
    flash('Has cerrado sesión exitosamente', 'success')
    return redirect(url_for('admin_login'))


# Rutas para categorías
@app.route('/admin/categories', methods=['GET'])
def admin_categories():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))

    try:
        categorias = ComicsAPI.get_categorias()
        estatus = requests.get(f"{ComicsAPI.BASE_URL}/estatus/").json()
        return render_template('admin/categories.html',
                               categories=categorias,
                               statuses=estatus)
    except requests.exceptions.RequestException as err:
        flash(f'Error al obtener las categorías: {err}', 'danger')
        return render_template('admin/categories.html',
                               categories=[],
                               statuses=[])


@app.route('/admin/categories/add', methods=['GET', 'POST'])
def admin_categories_add():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))

    if request.method == 'POST':
        categoria_data = {
            "nombre": request.form.get('name'),
            "descripcion": request.form.get('description'),
            "icono": request.form.get('icon'),
            "estatus": int(request.form.get('status', 1))
        }

        try:
            ComicsAPI.crear_categoria(categoria_data)
            flash('Categoría añadida exitosamente', 'success')
            return redirect(url_for('admin_categories'))
        except requests.exceptions.RequestException as err:
            flash(f'Error al añadir categoría: {err}', 'danger')

    try:
        estatus = requests.get(f"{ComicsAPI.BASE_URL}/estatus/").json()
        return render_template('admin/categories/add-categories.html',
                               statuses=estatus)
    except requests.exceptions.RequestException as err:
        flash(f'Error al cargar el formulario: {err}', 'danger')
        return redirect(url_for('admin_categories'))


@app.route('/admin/categories/edit/<int:id>', methods=['GET', 'POST'])
def admin_categories_edit(id):
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))

    if request.method == 'POST':
        categoria_data = {
            "nombre": request.form.get('name'),
            "descripcion": request.form.get('description'),
            "icono": request.form.get('icon'),
            "estatus": int(request.form.get('status'))
        }

        try:
            ComicsAPI.actualizar_categoria(id, categoria_data)
            flash('Categoría actualizada exitosamente', 'success')
            return redirect(url_for('admin_categories'))
        except requests.exceptions.RequestException as err:
            flash(f'Error al actualizar categoría: {err}', 'danger')

    try:
        categoria = requests.get(f"{ComicsAPI.BASE_URL}/categorias/{id}").json()
        estatus = requests.get(f"{ComicsAPI.BASE_URL}/estatus/").json()
        return render_template('admin/categories/edit-categories.html',
                               category=categoria,
                               statuses=estatus)
    except requests.exceptions.RequestException as err:
        flash(f'Error al cargar la categoría: {err}', 'danger')
        return redirect(url_for('admin_categories'))


@app.route('/admin/categories/delete/<int:id>', methods=['POST'])
def admin_categories_delete(id):
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))

    try:
        success = ComicsAPI.eliminar_categoria(id)
        if success:
            flash('Categoría eliminada exitosamente', 'success')
        else:
            flash('No se pudo eliminar la categoría', 'danger')
    except requests.exceptions.RequestException as err:
        flash(f'Error al eliminar categoría: {err}', 'danger')

    return redirect(url_for('admin_categories'))


@app.route('/admin/categories/search', methods=['GET'])
def admin_categories_search():
    if 'admin_logged_in' not in session:
        return jsonify({'error': 'No autorizado'}), 401

    search_term = request.args.get('q', '')
    try:
        response = requests.get(
            f"{ComicsAPI.BASE_URL}/categorias/search",
            params={"q": search_term}
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as err:
        return jsonify({'error': str(err)}), 500


# Rutas para productos
@app.route('/admin/products')
def admin_products():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))

    try:
        productos = ComicsAPI.get_productos()
        return render_template('admin/products.html', productos=productos)
    except requests.exceptions.RequestException as err:
        flash(f'Error al obtener productos: {err}', 'danger')
        return render_template('admin/products.html', productos=[])


# Rutas para clientes (admin)
@app.route('/admin/customers')
def admin_customers():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))

    try:
        clientes = ComicsAPI.get_clientes()
        return render_template('admin/customers.html', clientes=clientes)
    except requests.exceptions.RequestException as err:
        flash(f'Error al obtener clientes: {err}', 'danger')
        return render_template('admin/customers.html', clientes=[])


# Rutas para cliente (frontend)
@app.route('/cliente/login', methods=['GET', 'POST'])
def cliente_login():
    if request.method == 'POST':
        try:
            user_data = ComicsAPI.login_cliente(
                request.form['email'],
                request.form['password']
            )

            session['cliente_id'] = user_data['id_cliente']
            session['cliente_name'] = user_data['nombre']
            session['cliente_logged_in'] = True

            if 'remember' in request.form:
                session.permanent = True

            flash('Inicio de sesión exitoso', 'success')
            return redirect(url_for('cliente_index'))

        except requests.exceptions.HTTPError as err:
            if err.response.status_code == 401:
                flash('Credenciales incorrectas', 'danger')
            else:
                flash('Error en el servidor', 'danger')
        except requests.exceptions.RequestException as err:
            flash('Error de conexión', 'danger')

    return render_template('cliente/login.html')


@app.route('/cliente/logout')
def cliente_logout():
    session.pop('cliente_id', None)
    session.pop('cliente_name', None)
    session.pop('cliente_logged_in', None)
    flash('Has cerrado sesión exitosamente', 'success')
    return redirect(url_for('cliente_login'))


@app.route('/cliente/index')
def cliente_index():
    if 'cliente_logged_in' not in session:
        return redirect(url_for('cliente_login'))
    return render_template('cliente/index.html')


@app.route('/cliente/comics')
def cliente_comics():
    if 'cliente_logged_in' not in session:
        return redirect(url_for('cliente_login'))

    try:
        productos = ComicsAPI.get_productos()
        return render_template('cliente/comics.html', productos=productos)
    except requests.exceptions.RequestException as err:
        flash(f'Error al obtener cómics: {err}', 'danger')
        return render_template('cliente/comics.html', productos=[])


# Otras rutas estáticas (sin lógica compleja)
@app.route('/admin/profile')
def admin_profile():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))
    return render_template('admin/profile.html')


@app.route('/admin/settings')
def admin_settings():
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))
    return render_template('admin/settings.html')


@app.route('/cliente/account')
def cliente_account():
    if 'cliente_logged_in' not in session:
        return redirect(url_for('cliente_login'))
    return render_template('cliente/account.html')


# Manejo de errores
@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html', error='Página no encontrada'), 404


@app.errorhandler(500)
def internal_server_error(e):
    return render_template('error.html', error='Error interno del servidor'), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)