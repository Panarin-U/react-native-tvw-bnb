const TOAST_DELAYED_MILLISECOND = 2000

class ToastCountingUtil {
  constructor() {
    this.timer = null
    this.count = 0
  }

  withInterval() {
    this.count++
    if (this.timer !== null) {
      clearTimeout(this.timer)
    }

    return new Promise((resolve) => {
      this.timer = setTimeout(() => {
        const c = this.count
        this.count = 0
        resolve(c)
      }, TOAST_DELAYED_MILLISECOND)
      // _.throttle(
      //   () => {
      // const c = this.count
      // this.count = 0
      // resolve(c)
      //   },
      //   TOAST_DELAYED_MILLISECOND,
      //   {
      //     // leading: true,
      //     trailing: true,
      //   },
      // )()
      // _.debounce(() => {
      //   const c = this.count
      //   this.count = 0
      //   resolve(c)
      // }, TOAST_DELAYED_MILLISECOND)()
    })
  }
}

export default ToastCountingUtil
