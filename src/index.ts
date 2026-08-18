/* * JSON TYPES and UTILS * */
import { dateUtils, dayjs, numeric } from '@snailicid3/utils'
export type HelloWorld = number | string
export const helloThere: string = 'i am new'
export const sampleFunc = (value: HelloWorld): HelloWorld => {
    const __firs = dayjs('10-31-2004').isValid()
    /** Tg.isNotNilOrEmpty('') */
    const _result = dateUtils.isValidDate('10-31-2004', 'MM-DD-YYYY')
    const semver = numeric.isNumeric('1')
    console.log('sampleFunc:: ', value, semver, _result, __firs)
    return value
}

sampleFunc('herp derp')

export * from './build-the-order-log-writer/index.js'
export * from './build-the-ordered-script/index.js'
export * from './cache-clearing-preamble/index.js'
export * from './clean-room-single-run-proof/index.js'
export * from './failure-halt-behavior-design/index.js'
export * from './failure-halt-proof/index.js'
export * from './implement-pass-1-shape-validation/index.js'
export * from './implement-pass-2-relational-integrity/index.js'
export * from './implement-the-relational-index-builder/index.js'
export * from './per-field-negative-fixture-tests/index.js'
export * from './performance-benchmark/index.js'
export * from './positive-fixture-test/index.js'
export * from './relational-field-inventory/index.js'
export * from './retirement-awareness-logic/index.js'
export * from './schema-definition-pass/index.js'
export * from './sequence-specification/index.js'
export * from './ten-run-determinism-proof/index.js'
