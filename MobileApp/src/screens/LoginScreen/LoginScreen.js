import * as React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native'
import { facebookLogin } from '../../components/FaceBookLogin/FaceBookLogin'
import { googleLogin } from '../../components/GoogleLogin/GoogleLogin'
import Icon from 'react-native-vector-icons/FontAwesome';
import {COVER, LOGOB} from '../../images/index'

class LoginScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Sign In',
            headerStyle: {
                backgroundColor: '#4b8b3b',
            },
            headerTintColor: 'white',
        }
    }

    constructor(props) {
        super(props)
    }

    facebookLoginBtnHandler = (navigate) => {
        facebookLogin(navigate)
    }

    GoogleLoginBtnHandler = (navigate) => {
        googleLogin(navigate)
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={COVER}
                    style={styles.imgConatiner}
                >
                    <View style={styles.logoBtnCntner}>
                        <View style={styles.logoIconContainer}>
                            <Image source={LOGOB} style={styles.logo} />
                            <Text style={styles.logoText}>Sri Lankan National Parks</Text>
                        </View>
                        <View style={styles.btnContainer}>
                            <Icon.Button
                                style={styles.btn}
                                name="facebook"
                                backgroundColor="#3b5998"
                                onPress={() => this.facebookLoginBtnHandler(navigate)}
                            >
                                Login with Facebook
                            </Icon.Button>
                        </View>
                        <View style={styles.btnContainer}>
                            <Icon.Button
                                style={styles.btn}
                                name="google"
                                backgroundColor="#DD4B39"
                                onPress={() => this.GoogleLoginBtnHandler(navigate)}
                            >
                                Login with Google
                            </Icon.Button>
                        </View>

                    </View>

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
        marginBottom: 8,
    },
    btn: {
        width: Dimensions.get('window').width - 80,
        height: 60,
    },
    logoIconContainer: {
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 25
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'stretch',
    },
    logoText: {
        color: 'white',
        fontSize: 40,
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: 'ProximaNova-Regular'
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: 'stretch',
        alignItems: 'center',
        marginBottom: 20
    },
    imgConatiner: {
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height,

        resizeMode: 'stretch',
    },
    logoBtnCntner: {
        height: 400,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
        width: Dimensions.get('window').width - 40
    }
})
export default LoginScreen;

