const { ANSI } = require('./ansi')

/** enum for setting/controlling which log messages to log. default: WARN */
const VERBOSITY = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
}

const animate = (frames, interval = 600) => {
    try {
        frames.length > 0
        if (!Array.isArray(frames)) throw new Error('frames must be an array')
        if (typeof frames[0] !== 'string')
            throw new Error('individual frame must be a string')
    } catch (e) {
        throw new Error(
            'frames passed to logger.animate were not compatible with animation',
            e
        )
    }

    const animationHeight = Array.from(frames[0].matchAll(/\n/g)).length
    const prevLineMarker = `${ANSI.BEGIN_INSTRUCTION}${animationHeight}${ANSI.GO_TO_PREVIOUS_LINE}`
    let currentFrame = 0
    let finalFrame = frames.length - 1
    const animation = setInterval(() => {
        process.stdout.write(`${prevLineMarker}${frames[currentFrame]}`)
        if (currentFrame === finalFrame) {
            clearInterval(animation)
            process.stdout.write('\n')
        }
        currentFrame++
    }, interval)
}

const createLogger = (loggerName, verbosity) => {
    return {
        /** requires @see VERBOSITY.INFO or lower */
        animate: (frames, frameDisplayMs) => {
            if (verbosity <= VERBOSITY.INFO) {
                animate(frames, frameDisplayMs)
            }
        },
        info: (...args) => {
            if (verbosity <= VERBOSITY.INFO) {
                console.log(loggerName, ...args)
            }
        },
        log: (...args) => {
            if (verbosity <= VERBOSITY.INFO) {
                console.log(loggerName, ...args)
            }
        },
        warn: (...args) => {
            if (verbosity <= VERBOSITY.WARN) {
                console.warn(loggerName, ...args)
            }
        },
        error: (...args) => {
            if (verbosity <= VERBOSITY.ERROR) {
                console.error(loggerName, ...args)
            }
        },
        debug: (...args) => {
            if (verbosity <= VERBOSITY.DEBUG) {
                console.debug(loggerName, ...args)
            }
        },
    }
}

/** internal dict where all the loggers live */
const loggers = {
    default: createLogger('default'),
}

const getLogger = (loggerName, verbosity = VERBOSITY.WARN) => {
    if (loggers[loggerName] === undefined) {
        const logger = createLogger(loggerName, verbosity)
        loggers[loggerName] = logger
    }

    return loggers[loggerName]
}

module.exports = {
    VERBOSITY,
    getLogger,
}
