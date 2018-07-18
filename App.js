import React, { Component } from 'react';
import Usuarios from './componentes/usuarios';
import Lugares from './componentes/lugares';

//const dismissKeyboard = require('dismissKeyboard');


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ventana:1
        };
        this.handler = this.handler.bind(this);
        this.handler2 = this.handler2.bind(this);
    }

    handler(e) {
        e.preventDefault()
        this.setState({
            ventana:1
        });
    }
    handler2(e) {
        e.preventDefault()
        this.setState({
            ventana:2
        });
    }

    render() {
        if(this.state.ventana===1)
            return (<Usuarios handler={this.handler2} />);
        else
            return (<Lugares handler={this.handler}/>)
    }

}
