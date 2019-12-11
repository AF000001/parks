import * as React from 'react';
import { View, StyleSheet, ScrollView,FlatList,Text, RefreshControl,SafeAreaView, TouchableOpacity } from 'react-native'
import { Avatar} from 'react-native-paper';
import ActivityIndicator from '../../components/ActivityIndicator/ActivityIndicator'
import { CardComponent } from '../../components/CardComponent/CardComponent'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class FeedScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params = [] } = navigation.state
        return {
            headerTitle: 'Home',
            headerStyle: {
                backgroundColor: '#4b8b3b',
            },
            headerTintColor: '#fff',

            headerLeft: () => <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
            >
                <Avatar.Image
                    style={{ marginLeft: 5, marginRight: 0, padding: 0 }}
                    size={35} source={{ uri: params.userPhoto }}
                />
            </TouchableOpacity>,
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            observations: [],
            activityIndicator: true,
            refreshing: false,
        }
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this.getObservations().then(() => {
            this.setState({ refreshing: false });
        });
    }

    componentDidMount() {
        this.getUserData()
        // database().ref('/users/').on("value", snapshot=>{
        //     this.getObservations()
        // })
        this.getObservations()
    }

    getUserData = async function () {
        // Fetch the data snapshot
        const uid = auth().currentUser.uid;
        const refUser = database().ref(`/users/${uid}`);
        const snapshot = await refUser.once('value');
        await this.props.navigation.setParams({
            userPhoto: snapshot.val().photo
        })
    }

    getObservations = async() =>{
        // Fetch the data snapshot
        const data = await database().ref(`/usersObservations/`).orderByKey().limitToLast(3).once('value')
        
        const val = data.val()

        let observations = []
        let lastVisible = ''
        for (let i in val) {
            let name = val[i].uname
            let photo = val[i].uimg
            let userNick = name.toLowerCase().replace(/ /g, '')
            let time = new Date(val[i].time)
            let crntTime = new Date().getTime()
            let dif = crntTime - time
            // if (dif <= 604800000) { continue }
            let photUrl = val[i].photoURL
            let location = val[i].location
            time = time.toString().split(" ")
            time = time.splice(0, time.length - 1)
            time = time.toString().replace(/,/g, ' ')
            let result = [[]]
            let address = val[i].address
            
            observations.push([name, photo, photUrl, location, time, userNick, result, address])
            this.setState({
                observations: observations,
                activityIndicator: false
            })
            
            lastVisible = i
        }
        observations.pop()
        await this.setState({
            activityIndicator: false,
            lastVisible: lastVisible
        })
        console.log("Get "+lastVisible)
    }

    getMoreObservation= async () => {
        console.log("hello")
        let lastVisible = this.state.lastVisible
        
        const data = await database().ref(`/usersObservations/`).orderByKey().endAt(lastVisible).limitToLast(3).once('value')
        
        const val = data.val()
        // console.log(val)
        let observations = []
        for (let i in val) {
            console.log(i)
            let name = val[i].uname
            let photo = val[i].uimg
            let userNick = name.toLowerCase().replace(/ /g, '')
            let time = new Date(val[i].time)
            let crntTime = new Date().getTime()
            let dif = crntTime - time
            // if (dif <= 604800000) { continue }
            let photUrl = val[i].photoURL
            let location = val[i].location
            time = time.toString().split(" ")
            time = time.splice(0, time.length - 1)
            time = time.toString().replace(/,/g, ' ')
            let result = [[]]
            let address = val[i].address
            
            observations.push([name, photo, photUrl, location, time, userNick, result, address])
            lastVisible = i
        }
        observations.pop()
        await this.setState({
            observations: [...this.state.observations,...observations],
            activityIndicator: false,
            lastVisible: lastVisible
        })
        console.log("Get more"+lastVisible)
    }
    renderHeader = () => {
        try {
          return (
            <Text style={styles.headerText}>Items</Text>
          )
        }
        catch (error) {
          console.log(error);
        }
      };  // Render Footer
      renderFooter = () => {
        try {
          // Check If Loading
          if (this.state.activityIndicator) {
            return (
                <ActivityIndicator title={"Loading"} showIndicator={this.state.activityIndicator} />
            )
          }
          else {
            return null;
          }
        }
        catch (error) {
          console.log(error);
        }
      };

    render() {
        return (

            <View style={styles.container}>
                {this.state.activityIndicator ?
                    <View style={{ width: "100%", backgroundColor: 'grey' }}>
                        <ActivityIndicator title={"Loading"} showIndicator={this.state.activityIndicator} />
                    </View>
                    :
                    <View>

                        <View>
                            {this.state.observations.length > 0?
                            <SafeAreaView style={styles.container}>
                                <FlatList
                                    // Data
                                    data={this.state.observations}
                                    // Render Items
                                    renderItem={({ item }) => (
                                        <CardComponent 
                                            isNavigate={true} 
                                            result={item[6]} 
                                            showPhoto={this.props.navigation} 
                                            title={item[7]} 
                                            subtitle={item[5]} 
                                            user={item[1]} 
                                            image={item[2]} 
                                            content={[['calendar-clock', "On " + item[4].toString()], ['map-marker', item[3].toString()]]} 
                                        />
                                    )}
                                    // Item Key
                                    keyExtractor={(item, index) => String(index)}
                                    // Header (Title)
                                    // On End Reached (Takes a function)

                                    // ListHeaderComponent={this.renderHeader}
                                    // Footer (Activity Indicator)
                                    ListFooterComponent={()=><ActivityIndicator title={"Loading"} showIndicator={this.state.activityIndicator} />}
                                    onEndReached={this.getMoreObservation}
                                    // How Close To The End Of List Until Next Data Request Is Made
                                    onEndReachedThreshold={0.1}
                                    // Refreshing (Set To True When End Reached)
                                    refreshing={this.state.activityIndicator}
                                />
                            </SafeAreaView>
                            :
                            <View></View>
                            }
                        </View>

                    </View>
                }


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
    },
    welcome: {
        fontSize: 25
    }
})
export default FeedScreen;

