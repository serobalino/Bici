import React, { Component } from 'react';
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
            x:{latitude:0,longitude:0},
        };
        this.cambiarVista = this.cambiarVista.bind(this);
        this.setUsuario = this.setUsuario.bind(this);
        this.poseActual = this.poseActual.bind(this);
    }

    poseActual(){
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    x:{
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                });
            },
            (error) => this.setState({ x:{
                latitude:-0.2083443,longitude:-78.4927813
            }}),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
        );

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

    componentDidMount() {
        this.poseActual();
    }


    render() {
        if(this.state.usuario===null && this.state.ventana===1)
            return (<Login cambiarVista={this.cambiarVista} setUsuario={this.setUsuario}/>);
        else
            if(this.state.usuario!==null && this.state.ventana===3)
                return (<Lugares cambiarVista={this.cambiarVista} usuario={this.state.usuario} setUsuario={this.setUsuario} pose={this.state.x}/>);
            else
                return (<Registro cambiarVista={this.cambiarVista}/>);

    }

}
