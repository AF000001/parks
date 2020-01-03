import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, Alert } from 'react-native'
import {TextInput,Snackbar, Button} from 'react-native-paper'
import {COVER, LOGOB} from '../../images/index'
import auth from '@react-native-firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';
import ActivityIndicator from '../../components/ActivityIndicator/ActivityIndicator'
import database from '@react-native-firebase/database';

export default class EmailAuthScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Sign In',
            headerStyle: {
                backgroundColor: '#0b6623',
            },
            headerTintColor: '#fff',
        }
    }

    constructor(props) {
        super(props)
        this.state={
            password: '',
            email: '',
            confirmPassword: '',
            usernamePattern:/^[a-zA-Z]+ [a-zA-Z]+$/,
            username: '',
            emailPattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            passwordPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@_#\$%\^&\*])(?=.{8,})/,
            activityIndicator: false,
            usernameErrMessage: 'Username is invalid!',
            usernameErr: false,
            passwordErrMessage: 'Password is invalid',
            passwordErr: false,
            emailErrMessage: 'Email is invalid',
            emailErr: false,
            confirmErrMessage: 'Passwords does not match',
            confirmErr: false,
        }
    }

    checkSignUpValidity(){
        let valid = true
        if(!this.state.username.match(this.state.usernamePattern)){
            this.setState({
                usernameErr: true
            })
            valid = false
        }
        if(!this.state.password.match(this.state.passwordPattern)){
            this.setState({
                passwordErr: true
            })
            valid = false
        }
        if(!this.state.email.match(this.state.emailPattern)){
            this.setState({
                emailErr: true
            })
            valid = false
        }
        if(!this.state.confirmPassword.match(this.state.password)){
            this.setState({
                confirmErr: true
            })
            valid = false
        }
        if(!valid){
            return false
        }else{
            return true
        }
        
       
    }

    signUpBtnHandler = async () => {
        this.setState({activityIndicator: true})
        console.log(this.checkSignUpValidity())
        if(this.checkSignUpValidity()){
            await auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => { 
                console.log(JSON.stringify(user.user.toJSON().uid))
                const uid = user.user.toJSON().uid
                // alert('Successfully Registered!')
                const ref = database().ref('/users/').child(uid);
            
                ref.set({
                    name: this.state.username,
                    email: this.state.email,
                    photo: '',
                    profile: 'user'
                });

                this.setState({activityIndicator: false})
            })  
            .catch((err) => {
                console.log(err.message)
                this.setState({activityIndicator: false})
                alert("SignUp Failed")
                
        });

        }else{
            this.setState({activityIndicator: false})
        } 
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator title={"Processing"} showIndicator={this.state.activityIndicator} />
                <ImageBackground
                    source={COVER}
                    style={styles.imgConatiner}
                >
                    <ScrollView 
                        contentContainerStyle={{flexGrow: 1}} 
                        style={{marginTop: 60,marginBottom: 60,flex:1,height: Dimensions.get('window').height}}
                        showsVerticalScrollIndicator={false}
                    >
                    <View style={styles.logoBtnCntner}>
                        <View style={styles.logoIconContainer}>
                            <View style={{padding: 20, backgroundColor: 'black', borderRadius: 100}}>
                                <Image source={LOGOB} style={styles.logo} />
                            </View>
                            <Text style={styles.logoText}>SIGN UP</Text>
                        </View>
                        
                        <View style={styles.btnContainer}>
                            <TextInput
                                value={this.state.username}
                                onChangeText={text => this.setState({ username: text })}
                                placeholder={'Eg. Nimal Perera'}
                                mode='outlined'
                                style={{borderRadius: 0}}
                                inlineImageLeft={'account'}
                                inlineImagePadding={20}
                                autoCompleteType={'username'}
                            />
                             <Snackbar
                                visible={this.state.usernameErr}
                                onDismiss={() => this.setState({ usernameErr: false })}
                                style={styles.snackbar}
                                action={{
                                    label: 'OK',
                                    onPress: () => {
                                        this.setState({ usernameErr: false })
                                    },
                                    color: 'white'
                                  }}
                                >
                                {this.state.usernameErrMessage}
                            </Snackbar>
                        </View>

                        <View style={styles.btnContainer}>
                            <TextInput
                                value={this.state.email}
                                onChangeText={text => this.setState({ email: text })}
                                placeholder={'Eg. abc@gmail.com'}
                                mode='outlined'
                                style={{borderRadius: 0}}
                                inlineImageLeft={'email'}
                                inlineImagePadding={20}
                                autoCompleteType={'email'}
                            />
                            <Snackbar
                                visible={this.state.emailErr}
                                onDismiss={() => console.log("On dismiss")}
                                style={styles.snackbar}
                                action={{
                                    label: 'OK',
                                    onPress: () => {
                                        this.setState({ emailErr: false })
                                    },
                                    color: 'white'
                                  }}
                                >
                                {this.state.emailErrMessage}
                            </Snackbar>
                        </View>

                        <View style={styles.btnContainer}>
                            <TextInput
                                value={this.state.password}
                                onChangeText={text => this.setState({ password: text })}
                                placeholder={'Password'}
                                mode='outlined'
                                inlineImageLeft={'lock'}
                                secureTextEntry={true}
                                inlineImagePadding={20}
                                style={{borderRadius: 0}}
                                autoCompleteType={'password'}
                            />
                            <Snackbar
                                visible={this.state.passwordErr}
                                onDismiss={() => console.log("On dismiss")}
                                style={styles.snackbar}
                                action={{
                                    label: 'OK',
                                    onPress: () => {
                                        this.setState({ passwordErr: false })
                                    },
                                    color: 'white'
                                  }}
                                >
                                {this.state.passwordErrMessage}
                            </Snackbar>
                        </View>

                        <View style={styles.btnContainer}>
                            <TextInput
                                value={this.state.confirmPassword}
                                onChangeText={text => this.setState({ confirmPassword: text })}
                                placeholder={'Confirm Password'}
                                mode='outlined'
                                style={{borderRadius: 0}}
                                inlineImageLeft={'lock'}
                                secureTextEntry={true}
                                inlineImagePadding={20}
                                autoCompleteType={'password'}
                            />
                            <Snackbar
                                visible={this.state.confirmErr}
                                onDismiss={() => console.log("On dismiss")}
                                style={styles.snackbar}
                                action={{
                                    label: 'OK',
                                    onPress: () => {
                                        this.setState({ confirmErr: false })
                                    },
                                    color: 'white'
                                  }}
                                >
                                {this.state.confirmErrMessage}
                            </Snackbar>
                        </View>

                        <View style={styles.btnContainer}>
                            <Button
                                style={[styles.btn, {marginTop: 20, backgroundColor: '#014421'}]}
                                onPress={()=>this.signUpBtnHandler()}
                                mode='outlined'
                            >
                                SignUp
                            </Button>
                        </View>
                    </View>
                
                    </ScrollView>
                </ImageBackground>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch',
        width: Dimensions.get('window').width
    },
    btnContainer: {
        borderRadius: 10,
        justifyContent: 'center',
    },
    btn: {
        width: "100%",
        height: 60,
        justifyContent:'center',
        borderRadius: 50
    },
    logoIconContainer: {
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 25
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'stretch'
    },
    logoText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'ProximaNova-Regular'
    },
    imgConatiner: {
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%",
    },
    logoBtnCntner: {
        flex:1,
        height: "100%",
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        width: Dimensions.get('window').width - 40,
    },
    snackbar: {
        backgroundColor: 'red',
        marginBottom: -30
    }
})

