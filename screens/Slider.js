import React from 'react';
import { connect } from 'react-redux';
import { getData } from '../services/Provider';
import { Text, View, Slider, Alert, TouchableHighlight } from 'react-native';
import styles from '../Styles';

import {
  getDate,
  getValue
} from '../reducers';
import {
  saveValue
} from '../actions/dimensions';

import moment from 'moment/min/moment-with-locales';
moment.locale('fr');

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.id,
  value: getValue(state, ownProps.id, getDate(state)),
  date: ownProps.date
});

const mapDispatchToProps = {
  setValue: saveValue
}

class SliderComponent extends React.Component {

  onValueChange(value) {
    return this.props.setValue(this.props.id, this.props.date, value)
  }

  getColor(value, thresholds) {

    const COLORS = [
      '#A10800', // red.
      'orange',  // orange
      '#FFE700', // yellow
      '#D5F800'  // light green
    ]

    const thr = thresholds || [3, 4, 7];

    let i = thr.findIndex(v => v > value);
    i = i > -1 ? i : COLORS.length - 1;
    return COLORS[i];
  }

  render() {
    const data = getData(this.props.id);
    if(!data) throw new Error("Could not fetch dimension data of "+this.props.id);
    const { label, scale, dataMin, dataMax, unit } = data;
    const { step, min, max } = this.props.renderOptions || { step : 1, min :0, max : 10 };
    const sliderMin = dataMin || scale && Math.min.apply(1, Object.keys(scale)) || min || 0;
    const sliderMax = dataMax || scale && Math.max.apply(0, Object.keys(scale)) || max ;

    let value = this.props.value;
    let valueLabel;
    let color;
    valueLabel = scale ? scale[value] : ''+value;
    if(value === false) {
      color = 'lightgrey';
      value = 0;
    } else {
      color = this.getColor(value, data.thresholds);
    }

    return (
      <TouchableHighlight 
        onPress={() => Alert.alert("You tapped me !")}
        underlayColor='yellow'
      >
        <View style={[ styles.item, { borderLeftColor: color } ]}>
          <View style={{ flex: 1, paddingHorizontal : 10 }}>
            <Text style={{ flex: 1, fontSize: 24 }}>{label} :</Text>
          </View>
          <View style={{ flex: 2, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontSize: 16, minHeight: 35, color: 'grey' }}>
              {valueLabel} {unit && ' '+unit}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
          
            <Slider 
              style={{ flex: 1, width:'100%' }} 
              minimumValue={sliderMin} 
              maximumValue={sliderMax} 
              value={value} onValueChange={value => this.onValueChange(value)} 
              step={step}
              thumbTintColor={color}
              minimumTrackTintColor={color}
            />

          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderComponent)