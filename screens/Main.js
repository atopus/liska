import React from 'react';
import { connect } from 'react-redux';
import { Text, View, ScrollView, FlatList, Button } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import SliderComponent from './Slider';
import Styles, * as StyleVariables from '../Styles';
import {
  setDate
} from '../actions/main.js';
import {
  getStorageAvailability,
  getNetworkAvailability,
  getDate,
  getDimensions
} from '../reducers';
import {
  checkNetworkAvaibility,
  checkStorageAvailability
} from '../actions/app';

import moment from 'moment/min/moment-with-locales';
moment.locale('fr');

const mapStateToProps = state => {
  let dimensions = getDimensions(state)
  dimensions = dimensions && dimensions.length > 0 ?
    dimensions.map(d => ({ ...d, key: d.uid })) : []
  return {
    storage : getStorageAvailability(state),
    internet : getNetworkAvailability(state),
    date : getDate(state),
    dimensions
  }
}

const mapDispatchToProps = {
  setDate : setDate,
  checkNetworkAvaibility : checkNetworkAvaibility,
  checkStorageAvailability : checkStorageAvailability
};

class Main extends React.Component {

  static navigationOptions = {
    title: 'Home',
    headerStyle : {
      backgroundColor: StyleVariables.PRIMARY.neutral
    },
    headerTintColor : '#fff',
  };


  _resetDate() {
    this.setState({ date : moment().format('YYYYMMDD') });
  }

  _previousDate() {
    const newDate = moment(this.props.date, 'YYYYMMDD').subtract(1, 'days');
    this.props.setDate(newDate.format('YYYYMMDD'));
  }

  _nextDate() {
    const newDate = moment(this.props.date, 'YYYYMMDD').add(1, 'days');
    this.props.setDate(newDate.format('YYYYMMDD'));
  }

  _renderHeader() {
    return (
      <View style={Styles.header}>
        <FAIcon.Button size={12} backgroundColor='#ddd'
          name="chevron-left"
          onPress={() => this._previousDate()}
        />
        <Text style={ Styles.h1 }>
          {moment(this.props.date, 'YYYYMMDD').format('Do MMMM YYYY')}
        </Text>
        <FAIcon.Button size={12} backgroundColor='#ddd'
          name="chevron-right"
          onPress={() => this._nextDate()}
        />
      </View>
    )
  }

  _renderList() {
    return (
      <View style={Styles.list}>
        <ScrollView>
          <FlatList 
            ItemSeparatorComponent={({highlighted}) => (
                <View style={Styles.separator} />
            )}
            data={this.props.dimensions}
            renderItem={({item}) => {
              return (
                <SliderComponent
                  uid={item.uid}
                  date={this.props.date}
                  navigation={this.props.navigation}
              />) 
          }}/>
          <View style={{ alignItems : 'center', paddingBottom: 5 }}>
            <FAIcon.Button
              name='plus'
              backgroundColor={StyleVariables.primary}
              onPress={() => this.props.navigation.navigate('Dimension', {
                new: true
              })}>
                Create dimension
              </FAIcon.Button>
          </View>
        </ScrollView>
      </View>
    )
  }

  render() {

    return (
      <View style={Styles.container}>
        {this._renderHeader()}
        {this._renderList()}
      </View>
    )}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)