import { combineReducers } from 'redux'
import {
  LOAD_DIMENSIONS_SUCCESS,
  ADD_DIMENSION_SUCCESS,
  SET_VALUE_SUCCESS,
  UPDATE_DIMENSION_OPTION,
  ADD_DIMENSION_OPTION_SUCCESS,
  UPDATE_DIMENSION_OPTION_SUCCESS,
  REMOVE_DIMENSION_OPTION_SUCCESS,
  REMOVE_DIMENSION_OPTION,
  REMOVE_DIMENSION_SUCCESS,
  UPDATE_DIMENSION_SUCCESS,
  SORT_DIMENSION_OPTION,
  REMOVE_VALUE_SUCCESS,
  LOAD_VALUES_SUCCESS,
  EDIT_DIMENSION_OPTION
} from '../constants/actions';

const option = (state={}, action) => {

  const { text, index } = action.payload

  switch(action.type) {

    case UPDATE_DIMENSION_OPTION_SUCCESS:
      if(action.payload.index !== state.index) return state
      return { ...state, text }     

    case ADD_DIMENSION_OPTION_SUCCESS:
      return { text, index, edit : false }

    case EDIT_DIMENSION_OPTION:
      if(state.index !== index) return state
      const { edit } = action.payload
      return { ...state, edit }

    default:
      return state
  }
}

const options = (state = [], action) => {
  switch(action.type) {

    case ADD_DIMENSION_OPTION_SUCCESS:
      return [
        ...state,
        option(undefined, action)
      ]
    case UPDATE_DIMENSION_OPTION_SUCCESS:
    case EDIT_DIMENSION_OPTION:
      return state.map(o => option(o, action))

    case REMOVE_DIMENSION_OPTION_SUCCESS:
      return state.filter(o => o.index !== action.payload.index)

    case SORT_DIMENSION_OPTION :
      console.warn("SORT_DIMENSION_OPTION not implemented.")
      return state

    case UPDATE_DIMENSION_OPTION:
      return state.map(o => option(o, action))

    case REMOVE_DIMENSION_OPTION:
      return state.filter(o => o.index !== action.payload)

    default: 
      return state
  }
}

const value = (state = {}, action) => {

  switch(action.type) {

    case SET_VALUE_SUCCESS:
      return action.payload

    default:
      return state
  }
}

const values = (state = {}, action) => {

  const date = Object.keys(action.payload)[0]
  
  switch(action.type) {
    case SET_VALUE_SUCCESS:
      return {
      ...state,
      ...value(state[date], action)
    }
    case REMOVE_VALUE_SUCCESS:
      const newState = {}
      const delId = Object.keys(action.payload)[0]
      const newIds = Object.keys(state).filter(v => v !== delId)
      newIds.forEach(n => newState[n] = newState[n])
      return newState

    case LOAD_VALUES_SUCCESS:
      return action.payload

    default:
      return state
  }
}

const thresholds = (state = [], action) => {
  switch(action.type) {
    default:
      return state
  }
}

const dimension = (state = {}, action) => {

  const { uid, label } = action.payload
  switch(action.type) {

    case ADD_DIMENSION_SUCCESS:
      if(!uid || !label) throw new Error("Missing argument.")
      return { 
        uid, 
        label, 
        options : options(undefined, action), 
        values : values(undefined, action)
      }
    
    case UPDATE_DIMENSION_SUCCESS:
      if(!uid || !label) throw new Error("Missing argument.")
      if(uid !== state.uid) return state
      return { ...state, label }

    case SET_VALUE_SUCCESS :
    case REMOVE_VALUE_SUCCESS:
      if(state.uid !== action.payload.uid) return state
      const valueOption = {
        type: action.type,
        payload : action.payload.value
      }
      return {
        ...state,
        values: values(state.values, valueOption)
      }

    case LOAD_VALUES_SUCCESS:
      if(state.uid !== action.payload.uid) return state
      const valuesOption = {
        type: action.type,
        payload: action.payload.values
      }
      return {
        ...state,
        values: values(state.values, valuesOption)
      }
    case LOAD_DIMENSIONS_SUCCESS:
    case UPDATE_DIMENSION_OPTION:
    case ADD_DIMENSION_OPTION_SUCCESS:
    case REMOVE_DIMENSION_OPTION_SUCCESS:
    case UPDATE_DIMENSION_OPTION_SUCCESS:
    case EDIT_DIMENSION_OPTION:
      if(state.uid !== action.payload.uid) return state
      const optionAction = {
        type: action.type,
        payload: action.payload.option
      }  
      return {
        ...state,
        options: options(state.options, optionAction)
      }

    default:
      return state
  }
}

export const dimensions = (state = [], action) => {
  
  switch(action.type) {

    case SET_VALUE_SUCCESS:
    case LOAD_VALUES_SUCCESS:
    case REMOVE_VALUE_SUCCESS:
    case ADD_DIMENSION_OPTION_SUCCESS:
    case UPDATE_DIMENSION_OPTION_SUCCESS:
    case REMOVE_DIMENSION_OPTION_SUCCESS:
    case EDIT_DIMENSION_OPTION:
    case UPDATE_DIMENSION_SUCCESS:
    case SORT_DIMENSION_OPTION:
      return state.map(d =>  
        dimension(d, action)
      )

    case ADD_DIMENSION_SUCCESS:
      return [
        ...state,
        dimension(undefined, action)
      ]

    case REMOVE_DIMENSION_SUCCESS:
      return state.filter(dimension => dimension.uid !== action.payload.uid)

    case LOAD_DIMENSIONS_SUCCESS:
      return action.payload

    default:
      return state;
  }
}

export const getDimensions = state => state.dimensions

export const getDimension = (state, uid) => {
  if(!uid) throw new Error("Missing argument uid")
  const dimensions = getDimensions(state)
  return dimensions ? dimensions.find(d => d.uid === uid) : false
}

export const getValues = (state, uid) => {
  const dimension = getDimension(state, uid)  
  return dimension ? dimension.values : []
}
export const getValue = (state, uid, date) => {
  const values = getValues(state, uid)
  return values ? values[date] : false
}

export const getOptions = (state, uid) => {
  const dimension = getDimension(state, uid)
  return dimension ? dimension.options : []
}

export const getOption = (state, uid, index) => {
  const options = getOptions(state, uid)
  return options ? options.find(o => o.index === index) : false
}

export const getThresholds = (state, uid) => {
  const dimension = getDimension(state, uid)
  return dimension ? dimension.thresholds : []
}

export default combineReducers({
  dimensions
})