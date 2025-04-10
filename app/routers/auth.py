from tokenGen import createToken
from modelsPydantic import modelAuth
from fastapi.responses import JSONResponse
from fastapi import APIRouter

routerAuth= APIRouter()

@routerAuth.post('/auth', tags=['Autentificacion'])
def login(autorizado:modelAuth):
    if autorizado.correo == "123@example.com" and autorizado.passw == "123456789":
        token:str = createToken(autorizado.model_dump())
        print(token)
        return JSONResponse(content=token)
    else:
        return{"Aviso": "Usario no Autorizado"}