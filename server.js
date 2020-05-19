const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.set('port',3000);

let autores = [];

app.listen(app.get('port'),()=>{
    console.log('Server is working');
});

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

app.post('/autores',(req,res)=>{
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
    let posicionAutor = autores.filter((elem,index)=>{
        if(elem.id == Number(id)){
            return index;
        }
    });
});

app.put('/autores/:id',(req,res)=>{
    const {id} = req.params;
})