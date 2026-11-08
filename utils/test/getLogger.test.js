const assert = require('assert')
const { getLogger, VERBOSITY } = require('../js/getLogger')

describe('getLogger()', () => {
    it('returns an object with expected logger methods', () => {
        const logger = getLogger('test logger')
        const expectedFields = ['log', 'info', 'animate', 'debug', 'warn', 'error']
        expectedFields.forEach(field => {
            assert(logger.hasOwnProperty(field))
            assert.strictEqual(typeof logger[field], 'function')
        })
    })

    describe('animate()', () => {
        it('requires frames to be an array of strings', () => {
            const logger = getLogger('animate test logger', VERBOSITY.INFO)
            assert.throws(() => {
                logger.animate('🐍')
            })
            assert.throws(() => {
                logger.animate([{}])
            })
        })
        it('will not attempt to animate anything at verbosity above INFO', () => {
            const logger = getLogger('non-verbose animate test logger', VERBOSITY.ERROR)
            assert.doesNotThrow(() => {
                logger.animate('🐍')
                logger.animate([{}])
            })
        })
    })
})
