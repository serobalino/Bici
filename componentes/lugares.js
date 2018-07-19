import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AppRegistry,
    Alert,
    Button,
    ScrollView,
    Picker
} from 'react-native';

import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView,{Marker} from 'react-native-maps';

const dismissKeyboard = require('dismissKeyboard');
const APIUrl = 'http://www.puceing.edu.ec:15000/proyectobici/api';


export default class lugares extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usuarios: [],
            lugares:[],
            usuario:-1,
            x:{latitude:-0.2083443,longitude:-78.4927813}
        };
        this.nuevoLugar = this.nuevoLugar.bind(this);
        this.consultarLugares = this.consultarLugares.bind(this);
        this.poseActual = this.poseActual.bind(this);
    }

    nuevoLugar() {
        dismissKeyboard();
        if(this.state.usuario>=0){
            const lId=this.state.lugares.length+1;
            axios.post(APIUrl + '/location',{
                ID_USER: this.state.usuario,
                LATITUD:this.state.x.latitude,
                LONGITUD:this.state.x.longitude,
                ID:lId
            }).then((response) => {
                this.consultarLugares();
                let nombre = this.state.usuarios.find(x => x.ID_USER === this.state.usuario).NOMBRE;
                Alert.alert('Éxito','Se ha agregado la ubicación de '+nombre);
            }).catch((error) => {
                console.log(error);
                Alert.alert('Error',error);
            });
        }else{
            Alert.alert('Error','Elija un usuario válido');
        }
    }
    consultarUsuarios(){
        axios.get(APIUrl + '/user')
            .then((response) => {
                this.setState({ usuarios: response.data });
            })
            .catch((error) => {
                console.log(error, error.response);
            });
    }

    consultarLugares(){
        axios.get(APIUrl + '/location')
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
    }


    componentDidMount() {
        this.poseActual();
        this.consultarUsuarios();
        this.consultarLugares();
    }

    render() {
        const pUsuarios = this.state.usuarios.map((elem) => {
            return (
                <Picker.Item key={elem.ID_USER} label={elem.NOMBRE + ' ' + elem.APELLIDO} value={elem.ID_USER} />
            );
        });

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.center}>
                        <Text style={styles.pageTitle}>Lugares</Text>
                    </View>
                    <View style={styles.right} />
                </View>
                <View style={styles.content}>
                        <Picker
                            selectedValue={this.state.usuario}
                            style={{ height:50, width:"100%", paddingTop:-20}}
                            onValueChange={(itemValue, itemIndex) => this.setState({usuario: itemValue})}
                            itemStyle={{height: 50}}
                        >
                            <Picker.Item key={'unselectable'} label="Elija un usuario" value={-1} />
                            {pUsuarios}
                        </Picker>
                    <ScrollView>
                        <MapView
                            initialRegion={{
                                latitude:this.state.x.latitude,
                                longitude:this.state.x.longitude,
                                latitudeDelta:0.1,
                                longitudeDelta:0.1
                            }}

                            onPress={(e) => this.setState({ x: e.nativeEvent.coordinate })}

                            style={{height: 500,width:"100%"}}>

                            <Marker draggable
                                    coordinate={this.state.x}
                                    onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
                            />
                        </MapView>
                    </ScrollView>
                    <View >
                        <Button
                            onPress={this.nuevoLugar}
                            title="Agregar Lugar"
                            color="#1aa8b5"
                            style={{height: 60}}
                            icon={
                                <Icon
                                    name="md-add"
                                    size={20}
                                    color="#000"
                                />
                            }
                        />
                        <Button
                            onPress={this.props.handler}
                            title="Usuarios"
                            color="#ff0000"
                            style={{height: 60}}
                            icon={
                                <Icon
                                    name='ios-people'
                                    size={20}
                                    color="#000"
                                />
                            }
                        />
                    </View>
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
        flex: 1,
    }
});
