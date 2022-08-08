import { createNavigationContainerRef, StackActions, CommonActions } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()

export const navigate = (name, params) => {
  const isReady = navigationRef.isReady()
  if (isReady) {
    navigationRef.navigate(name, params)
  }
}

export const navigateReplace = (name, param) => {
  const isReady = navigationRef.isReady()
  if (isReady) {
    navigationRef.dispatch(
      StackActions.replace(name, {
        param,
      }),
    )
  }
}

export const navigateReset = (name, params) => {
  const isReady = navigationRef.isReady()
  if (isReady) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      }),
    )
  }
}
