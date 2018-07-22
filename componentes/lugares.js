import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert
} from 'react-native';

import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionButton from 'react-native-action-button';
import MapView,{Marker} from 'react-native-maps';


const dismissKeyboard = require('dismissKeyboard');
const APIUrl = 'http://www.puceing.edu.ec:15000/proyectobici/api';


export default class lugares extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usuario: [],
            lugares:[],
            x:this.props.pose
        };
        this.nuevoLugar = this.nuevoLugar.bind(this);
        this.consultarLugares = this.consultarLugares.bind(this);
        this.poseActual = this.poseActual.bind(this);
        this.logOut = this.logOut.bind(this);
        this.consultarUsuarios = this.consultarUsuarios.bind(this);
        this.cambiarUsuarios = this.cambiarUsuarios.bind(this);
    }


    logOut(){
        this.props.cambiarVista(1);
        this.props.setUsuario(null);
    }

    nuevoLugar() {
        if(this.state.x.latitude && this.state.x.longitude){
            axios.post(APIUrl + '/location',{
                ID_USER: this.props.usuario,
                LATITUD:this.state.x.latitude,
                LONGITUD:this.state.x.longitude,
            }).then((response) => {
                this.consultarLugares();
            }).catch((error) => {
                console.log(error);
                Alert.alert('Error',error);
            });
        }
    }

    cambiarUsuarios(){
        let usuario = this.state.usuario;

        let estado='';
        if(usuario.ESTADO_USO==='SI')
            estado='NO';
        else
            estado='SI';
        axios.put(APIUrl + '/user',{
            ID_USER: usuario.ID_USER,
            ESTADO_USO:estado,
            NOMBRE: usuario.NOMBRE,
            APELLIDO:usuario.APELLIDO,
            PASSWORD:usuario.PASSWORD,
            TELEFONO:usuario.TELEFONO,
        }).then((response) => {
            this.consultarUsuarios();
        }).catch((error) => {
            console.log(error, error.response);
            Alert.alert('Error',error);
        });
    }

    consultarUsuarios(){
        axios.get(APIUrl + '/user/'+this.props.usuario)
            .then((response) => {
                this.setState({ usuario: response.data });
            })
            .catch((error) => {
                console.log(error, error.response);
            });
    }

    consultarLugares(){
        axios.get(APIUrl + '/location/'+this.props.usuario)
            .then((response) => {
                this.setState({ lugares: response.data });
            })
            .catch((error) => {
                console.log(error, error.response);
            });
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
        if(this.state.usuario.ESTADO_USO==="SI"){
            this.nuevoLugar();
        }
    }

    componentDidMount() {
        this.consultarUsuarios();
        this._interval = setInterval(() => {
            this.poseActual()
        }, 30000);
        //30000 mitad de un minuto
    }
    componentWillUnmount() {
        clearInterval(this._interval);
    }

    render() {
        let boton   =   null;
        if(this.state.usuario.ESTADO_USO==="SI")
            boton   =   <ActionButton.Item buttonColor='#ff0000' title="Desactivar Tracking" onPress={this.cambiarUsuarios}>
                            <Icon name="md-close-circle" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
        else
            boton   =   <ActionButton.Item buttonColor='#00ff00' title="Activar Tracking" onPress={this.cambiarUsuarios}>
                            <Icon name="md-done-all" style={styles.actionButtonIcon} />
                        </ActionButton.Item>;
        const lista = this.state.lugares.map((elem) => {
            return (
                <Marker
                    key={elem.ID}
                    coordinate={{latitude:elem.LATITUD,longitude:elem.LONGITUD}}/>
            );
        });

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.center}>
                        <Text style={styles.pageTitle}>Lugares</Text>
                    </View>
                </View>
                <View style={styles.content}>
                        <MapView
                            initialRegion={{
                                latitude:this.state.x.latitude,
                                longitude:this.state.x.longitude,
                                latitudeDelta:0.1,
                                longitudeDelta:0.1
                            }}


                            style={{height: "100%",width:"100%"}}>

                            {lista}
                            <Marker coordinate={this.state.x} pinColor="green"/>
                        </MapView>
                        <ActionButton buttonColor="#1aa8b5" >
                            {boton}
                            <ActionButton.Item buttonColor='#4C544F' title="Cerrar sesión" onPress={this.logOut}>
                                <Icon name="md-log-out" style={styles.actionButtonIcon} />
                            </ActionButton.Item>
                        </ActionButton>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#1aa8b5',
        // padding: 20,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    left: {
        width: 40,
        alignItems: 'center',
    },
    center: {
        padding: 10,
        flex: 1,
        alignItems: 'center',
    },
    right: {
        width: 40,
    },
    backBtn: {
        padding: 10,
    },
    pageTitle: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputContainer: {
        padding: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ddd',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
    },
    todos: {
        // padding: 20,
    },
    btnWrapper: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    todoText: {
        flex: 1
    }
});
