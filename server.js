const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.set('port',3000);

let autores = [];

app.listen(app.get('port'),()=>{
    console.log('Server is working');
});

function validarSiExiste(req,res,next){
    const{nombre,apellido} = req.body;
    const autorRepetido = autores.findIndex(elem =>{
        if(elem.nombre==nombre && elem.apellido==apellido){
            return elem;
        }
    });

    if(autorRepetido>=0){
        return res.status(409).json('El contacto ya existe');
    }

    return next();
}

app.get('/',(req,res)=>{
    //res.send('Estamos trabajando');
    res.json('Estamos trabajando');
});

app.get('/autores',(req,res)=>{
    if(autores.length>0){
        res.json(autores);
    }else{
        res.status(404).json('No hay datos');
    }
});

app.post('/autores',validarSiExiste,(req,res)=>{
    const{nombre,apellido,fechaDeNacimiento,libros} = req.body;
    if(nombre && apellido && fechaDeNacimiento && libros){
        let id = autores.length+1;
        if(autores.length>0){
            const last= autores.slice(-1)[0].id;
            if(id<=last){
                id=(last+1);
            }
        }
        const newAutor = {id,...req.body};
        autores.push(newAutor);
        res.json(newAutor);
    }else{
        res.status(400).json({error :'Faltan Datos'});
    }
});

app.get('/autores/:id',(req,res)=>{
    const {id} = req.params;
    autores.filter(elem =>{
        if(elem.id == Number(id)){
            res.json(elem);
        }
    });
});

app.delete('/autores/:id',(req,res)=>{
    const {id} = req.params;
    autores.filter((elem,index)=>{
        if(elem.id == Number(id)){
            autores.splice(index,1);
            res.json(autores);
        }else{
            res.status(404).json(`No existe un autor con el id ${id}`);
        }
    });
});

app.put('/autores/:id',(req,res)=>{
    const {id} = req.params;
    const{nombre,apellido,fechaDeNacimiento,libros} = req.body;
    let autor = autores.find((element)=>{
        if(element.id == Number(id)){
            return element;
        }
    });

    autor.id=id;
    autor.nombre=nombre;
    autor.apellido=apellido;
    autor.fechaDeNacimiento=fechaDeNacimiento;
    autor.libros=libros;
    const i = autores.indexOf(autor);
    if(i>-1){
        autores.splice(i,1,autor); 
    }
    res.json(autores);
});

app.get('/autores/:id/libros',(req,res)=>{
    const {id} = req.params;
    let autor = autores.find(elem =>{
        if(elem.id == Number(id)){
            return elem;
        }
    });
    res.json(autor.libros);
});