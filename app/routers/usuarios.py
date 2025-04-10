from fastapi import HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from middlewares import BaererJWT
from DB.conexion import Session
from modelsPydantic import modelUsuario
from fastapi import APIRouter
from models.modelsDB import User

routerUsuario= APIRouter()

#dependencies=[Depends(BaererJWT())] se encarga de verificar si el token es valido

#endpoint Consultar todos
@routerUsuario.get('/usuarios', tags=['Operaciones CRUD'])
def ConsultarTodos():
    db= Session()
    try:
        consulta= db.query(User).all()
        return JSONResponse(content=jsonable_encoder(consulta))
    except Exception as x:
        return JSONResponse(status_code=500, content={"mensaje": "No fue posible conectar" , "Excepcion": str(x)})
    finally:
        db.close()

#endpoint Consultar por id
@routerUsuario.get('/usuario/{id}', tags=['Operaciones CRUD'])
def ConsultaUno(id:int):
    db= Session()
    try:
        consulta= db.query(User).filter(User.id == id).first()
        if not consulta:
            return JSONResponse(status_code=404, content={"Mensaje":"Usuario no encontrado"})
        
        return JSONResponse(content=jsonable_encoder(consulta))
    except Exception as x:
        return JSONResponse(status_code=500, content={"mensaje": "No fue posible conectar" , "Excepcion": str(x)})
    finally:
        db.close()

#endpoint Para agregar usuarios
@routerUsuario.post('/usuario/', response_model=modelUsuario, tags=['Operaciones CRUD'])
def AgregarUsuario(usuarionuevo: modelUsuario):
    db= Session()
    try:
        db.add(User(**usuarionuevo.model_dump()))
        db.commit()
        return JSONResponse(status_code=201, content={"mensaje": "Usuario Guardado", "usuario": usuarionuevo.model_dump()})
    except:
        db.rollback()
        return JSONResponse(status_code=500, content={"mensaje": "No se Guardo" , "Excepcion": str(e)})
    finally:
        db.close()
    

#endpoint Para modificar usuarios
@routerUsuario.put('/usuario/{id}', response_model=modelUsuario, tags=['Operaciones CRUD'])
def Actualizar(id: int, usuarioActualizado: modelUsuario):
    db = Session()
    try:
        consulta = db.query(User).filter(User.id == id).first()
        if not consulta:
            return JSONResponse(status_code=404, content={"mensaje": "Usuario no encontrado"})
        
        for key, value in usuarioActualizado.model_dump().items():
            setattr(consulta, key, value)
        
        db.commit()
        return JSONResponse(status_code=200, content={"mensaje": "Usuario actualizado correctamente", "usuario": usuarioActualizado.model_dump()})
    except Exception as e:
        db.rollback()
        return JSONResponse(status_code=500, content={"mensaje": "No se pudo actualizar el usuario", "Excepcion": str(e)})
    finally:
        db.close()

#endpoint Para eliminar usuarios
@routerUsuario.delete('/usuario/{id}', tags=['Operaciones CRUD'])
def Eliminar(id: int):
    db = Session()
    try:
        consulta = db.query(User).filter(User.id == id).first()
        if not consulta:
            return JSONResponse(status_code=404, content={"mensaje": "Usuario no encontrado"})
        
        db.delete(consulta)
        db.commit()
        return JSONResponse(status_code=200, content={"mensaje": "Usuario eliminado correctamente"})
    except Exception as e:
        db.rollback()
        return JSONResponse(status_code=500, content={"mensaje": "No se pudo eliminar el usuario", "Excepcion": str(e)})
    finally:
        db.close()