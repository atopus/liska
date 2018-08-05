import React from 'react'
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import Styles, * as StyleVariables from '../Styles'
import { connect } from 'react-redux'
import { 
  updateDimensionOption,
  createDimensionOption,
  deleteDimensionOption,
  editOption
} from '../actions/dimensions'
import {
  getOption,
  getOptionFrequency
} from '../reducers'
import FAIcon from 'react-native-vector-icons/FontAwesome';

const mapStateToProps = (state, props) => ({
  dimensionId: props.dimensionId,
  option: getOption(state, props.dimensionId, props.index),
  frequency: getOptionFrequency(state, props.dimensionId, props.index)
});

const mapDispatchToProps = ({
  updateDimensionOption,
  createDimensionOption,
  deleteDimensionOption,
  editOption
});

class DimensionOption extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      edit : props.new || false,
      text: props.option ? props.option.text : '',
      new : props.new || false,
      index: props.index
    }
  }

  _onSubmit() {

    if(this.state.new) {
      this.props.createDimensionOption(
        this.props.dimensionId, 
        parseInt(this.props.index), 
        this.state.text
      )
      this.setState({ edit: false, text: '' })
    } else {
      this.props.updateDimensionOption(
        this.props.dimensionId, 
        parseInt(this.props.index), 
        this.state.text
      )
      this.props.editOption(this.props.dimensionId, this.props.index, false)
    }
  }

  _onDelete() {
    this.props.deleteDimensionOption(this.props.dimensionId, this.props.index)
  }

  _renderText() {

    const canDelete = this.props.frequency === 0

    const text = !this.props.option || this.props.option.edit ? (

      // Text Input
      <View style={ styles.textWrapper } >
        <View style={{ width: '70%'}}>
          <TextInput
            underlineColorAndroid={StyleVariables.lightgrey}
            onChangeText={text => this.setState({ text })}
            style={ Styles.textInput }
            multiline={true}
            numberOfLines={4}
          >
            {this.state.text}
          </TextInput>
        </View>
        <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'space-around'}}>
          <FAIcon.Button 
            name="check"
            backgroundColor={StyleVariables.success}
            onPress={() => this._onSubmit()}
            disabled={!this.state.text || !this.state.text.trim()} 
          />
          <FAIcon.Button
            name="minus"
            backgroundColor={StyleVariables.warning}
            onPress={() => this.props.editOption(this.props.dimensionId, this.props.index, false)}
          />
        </View>
      </View>
    ) : (

      // Label
      
      <TouchableWithoutFeedback
        onPress={() => this.props.editOption(this.props.dimensionId, this.props.index, true)}
      >
        <View style={ styles.textWrapper }>
        
          <Text style={[ Styles.p , { width: canDelete ? '90%'  : '100%' } ]}>
            {this.state.text}
          </Text>

          {canDelete && (
            <View style={{ width: '10%' }}>
              <FAIcon
                name='trash'
                style={ Styles.p }
                size={10}
                onPress={() => this._onDelete()}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    
    )

    return (
      <View style={ styles.text }>
        {text}
      </View>
    )
  }

  _renderIndex() {
    return (
      <View style={ styles.index }>
        <Text style={ Styles.p }>{this.props.index}.</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={ styles.row }>
        {this.props.option && this._renderIndex()}
        {this._renderText()}
      </View>
    )
  }
}

const left = 5;
const right = 100 - left;

const styles = StyleSheet.create({
  row : {
    flex: 1, 
    flexDirection: 'row',
    paddingVertical: 5
  },
  index : {
    width: `${left}%`,
    justifyContent: 'center',
  },
  textWrapper : {
    flex: 1, 
    flexDirection: 'row', 
    alignItems:'center', 
    minHeight: 35
  },
  text : {
    width: `${right}%`
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DimensionOption)