import React, { Component } from 'react';
import Usuarios from './componentes/usuarios';
import Lugares from './componentes/lugares';
import Login from './componentes/login';
import Registro from './componentes/registro';

//const dismissKeyboard = require('dismissKeyboard');


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ventana:1,
            usuario:null,
        };
        this.cambiarVista = this.cambiarVista.bind(this);
        this.setUsuario = this.setUsuario.bind(this);
    }

    setUsuario(usuario){
        this.setState({
            usuario:usuario
        });
    }

    cambiarVista(ventana){
        this.setState({
            ventana:ventana
        });
    }


    render() {
        if(this.state.usuario===null && this.state.ventana===1)
            return (<Login cambiarVista={this.cambiarVista} setUsuario={this.setUsuario}/>);
        else
            if(this.state.usuario!==null && this.state.ventana===3)
                return (<Lugares cambiarVista={this.cambiarVista} usuario={this.state.usuario} setUsuario={this.setUsuario}/>);
            else
                return (<Registro cambiarVista={this.cambiarVista}/>);

    }

}
