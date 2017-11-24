// NOTE: this is added to monkey patch a `dataset` attribute onto HTMLDIVElement so that jest can mount the component onto the fake dom
Object.assign(
  HTMLDivElement.prototype,
  {
    get dataset() {
      this.__dataset = this.__dataset || {}
      return this.__dataset
    }
  }
)
