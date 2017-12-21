/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeModules } from 'react-native'
const { InAppUtils } = NativeModules

const PRODUCT_ID = 'com.sujanvaidya.PurchaseDemo.spd3'

export default class App extends Component {

  constructor() {
    super()

    this.state = {
      products: [],
      isBuying: false,
    }
  }

  componentDidMount() {
    this._ipaSetup();
  }

  _ipaSetup = () => {
    var products = [
      PRODUCT_ID,
    ];
    InAppUtils.loadProducts(products, (error, products) => {
        //update store here.
        if (error) {
          Alert.alert(
            'Error',
            'Error Occured',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
          )
        }
        this.setState({products: products})
    });
  }

  _cellOnClick = (data) => {
    InAppUtils.canMakePayments((canMakePayments) => {
      if(!canMakePayments) {
         Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
      } else {
        console.log('xxxxxxx')
        this.setState({isBuying: true})
        InAppUtils.purchaseProduct(PRODUCT_ID, (error, response) => {
          // NOTE for v3.0: User can cancel the payment which will be available as error object here.
          this.setState({isBuying: false})
          if(response && response.productIdentifier) {
             Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
             //unlock store here.
          } else {
            console.log('yyyyy', error.userInfo.NSLocalizedDescription)
            Alert.alert('Purchase UnSuccessful', error.userInfo.NSLocalizedDescription);
          }
        });
      }
   });
  }
  
  _renderCell = (item) => {
    return (
      <View style={style= styles.cell}>
        <TouchableOpacity onPress={() => this._cellOnClick(item)} style={styles.cell}>
          <Text>{item.item.title}</Text>
          <Text style={{justifyContent: 'flex-end'}}> - {item.item.price}</Text>
        </TouchableOpacity>
        <View style={styles.lineSeparator}/>
      </View>
    )
  }

  _renderTable = () => {
    return (
      <View style={styles.table}>
        <FlatList
          data={this.state.products}
          renderItem={(item) => this._renderCell(item)}  
          keyExtractor={(item, index) => index}
        />
      </View>
    )
  }

  _renderActivityIndicator = () => {
    return (
      <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size='large' color='gray'/>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.isBuying ? 
            this._renderActivityIndicator()
            :
            (this.state.products.length > 0) ? this._renderTable() : this._renderActivityIndicator()
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 16,
  },
  table: {
    flex: 1,
    paddingTop: 20,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44, 
  },
  lineSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'gray'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
});
