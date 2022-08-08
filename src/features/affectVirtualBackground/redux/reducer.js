import { SET_ALREADY_INIT_VIRTUAL_BACKGROUND } from './actionType'

const initialState = {
  initVirtualBackground: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ALREADY_INIT_VIRTUAL_BACKGROUND:
      return {
        initVirtualBackground: true,
      }

    default:
      return state
  }
}