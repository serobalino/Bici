import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AppRegistry,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
    TextInput,
    ScrollView,
    Button,
    Platform,
    Alert
} from 'react-native';

import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const dismissKeyboard = require('dismissKeyboard');
const APIUrl = 'http://www.puceing.edu.ec:15000/proyectobici/api';


export default class usuarios extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            apellido:'',
            telefono:'',
            uso:'SI',
            usuarios: [],
        };
        this.nuevoUsuario = this.nuevoUsuario.bind(this);
        this.consultarUsuarios = this.consultarUsuarios.bind(this);
    }

    nuevoUsuario() {
        dismissKeyboard();
        if(this.state.nombre!=='' && this.state.apellido!=='' && this.state.telefono!==''){
            const uId=this.state.usuarios.length+1;
            axios.post(APIUrl + '/user',{
                NOMBRE: this.state.nombre,
                APELLIDO:this.state.apellido,
                TELEFONO:this.state.telefono,
                ESTADO_USO:this.state.uso,
                ID_USER: uId,
            }).then((response) => {
                this.consultarUsuarios();
                Alert.alert('Éxito','Se ha agregado a '+this.state.nombre);
                this.setState({ nombre:'',apellido:'',telefono:''});
            }).catch((error) => {
                console.log(error);
                Alert.alert('Error',error);
            });
        }else{
            Alert.alert('Error','Complete el formulario para agregar un nuevo usuario');
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
    cambiarUsuarios(usuario){
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
            TELEFONO:usuario.TELEFONO,
        }).then((response) => {
            this.consultarUsuarios();
        }).catch((error) => {
            console.log(error, error.response);
            Alert.alert('Error',error);
        });
    }
    eliminarUsuario(usuario){
        axios.delete(APIUrl + '/user/' + usuario.ID_USER)
            .then((response) => {
                this.consultarUsuarios();
                Alert.alert('Éxito','Se ha eliminado '+usuario.NOMBRE);
            })
            .catch((error) => {
                console.log(error);
                Alert.alert('Error',error);
            });
    }


    componentDidMount() {
        this.consultarUsuarios();
    }

    render() {
        const pUsuarios = this.state.usuarios.map((elem) => {
            const textDecorationLine = elem.ESTADO_USO==='SI' ? 'underline' : 'none';
            if (Platform.OS === 'android') {
                return (
                    <TouchableNativeFeedback
                        key={elem.ID_USER}
                        onPress={() => this.cambiarUsuarios(elem)}>
                        <View style={styles.btnWrapper}>
                            <Text style={[styles.todoText, { textDecorationLine }]}>{elem.NOMBRE} {elem.APELLIDO}</Text>
                            <TouchableOpacity onPress={() => this.eliminarUsuario(elem)}>
                                <Icon name="md-close" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    </TouchableNativeFeedback>
                );
            } else {
                return (
                    <TouchableHighlight
                        key={elem.ID_USER}
                        onPress={() => this.cambiarUsuarios(elem)}>
                        <View style={styles.btnWrapper}>
                            <Text style={[styles.todoText, { textDecorationLine }]}>{elem.NOMBRE} {elem.APELLIDO}</Text>
                            <TouchableOpacity onPress={() => this.eliminarUsuario(elem)}>
                                <Icon name="md-close" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                    </TouchableHighlight>
                );
            }
        });

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.center}>
                        <Text style={styles.pageTitle}>Usuarios</Text>
                    </View>
                    <View style={styles.right} />
                </View>
                <View style={styles.content}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder={'Nombre'}
                                onChangeText={(nombre) => this.setState({ nombre })}
                                underlineColorAndroid={'transparent'}
                                value={this.state.nombre}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder={'Apellido'}
                                onChangeText={(apellido) => this.setState({ apellido })}
                                underlineColorAndroid={'transparent'}
                                value={this.state.apellido}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder={'Teléfono'}
                                onChangeText={(telefono) => this.setState({ telefono })}
                                underlineColorAndroid={'transparent'}
                                value={this.state.telefono}
                                textContentType="telephoneNumber"
                            />
                            <TouchableOpacity
                                onPress={this.nuevoUsuario}>
                                <Icon name="md-send" size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView>
                        {pUsuarios}
                    </ScrollView>
                    <View >
                        <Button
                            onPress={this.props.handler}
                            title="Lugares"
                            color="#ff0000"
                            style={{height: 60}}
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
