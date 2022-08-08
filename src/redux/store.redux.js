import thunkMiddleware from 'redux-thunk'
import { applyMiddleware, createStore, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { loggerMiddleware, monitorReducersEnhancer } from '../uitls/redux.utils'
import rootReducer from './reducer.redux'
import MiddlewareRegistry from './middleware.redux'

const configureStore = preloadedState => {
  // const middlewares = [loggerMiddleware, thunkMiddleware]
  const middlewares = [thunkMiddleware]
  // const middlewareEnhancer = applyMiddleware(...middlewares)
  const middlewareEnhancer = MiddlewareRegistry.applyMiddleware(middlewares)

  // const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const enhancers = [middlewareEnhancer]
  // const composedEnhancers = compose(...enhancers)
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  return store
}

export default configureStore
