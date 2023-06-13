import pupa from 'pupa'

export class WcmfFormatter {
  private messages: Record<string, string> = {}

  constructor(options: { messages: Record<string, string> }) {
    const {
      messages = {},
    } = options
    this.messages = options.messages
  }

  //
  // interpolate
  //
  // @param {string} message
  //   string of list or named format.
  //   e.g.
  //   - named formatting: 'Hi %name%'
  //   - list formatting: 'Hi %0%'
  //
  // @param {Object | Array} values
  //   values of `message` interpolation.
  //   passed values with `$t`, `$tc` and `i18n` functional component.
  //   e.g.
  //   - $t('hello', { name: 'kazupon' }) -> passed values: Object `{ name: 'kazupon' }`
  //   - $t('hello', ['kazupon']) -> passed values: Array `['kazupon']`
  //   - `i18n` functional component (component interpolation)
  //     <i18n path="hello">
  //       <p>kazupon</p>
  //       <p>how are you?</p>
  //     </i18n>
  //     -> passed values: Array (included VNode):
  //        `[VNode{ tag: 'p', text: 'kazupon', ...}, VNode{ tag: 'p', text: 'how are you?', ...}]`
  //
  // @return {Array<any>}
  //   interpolated values. you need to return the following:
  //   - array of string, when is using `$t` or `$tc`.
  //   - array included VNode object, when is using `i18n` functional component.
  //
  interpolate (message: string, values: Record<string, string>|string[]) {
    var translation: string = !this.messages[message] ? message : String(this.messages[message])
    return pupa(translation, values)
  }
}