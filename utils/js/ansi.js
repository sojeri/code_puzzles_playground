/** props to https://en.wikipedia.org/wiki/ANSI_escape_code */
const ANSI = {
    /** must use before other commands to have them do anything */
    BEGIN_INSTRUCTION: '\u001b[',
    /** give # arg first if wanting to move multiple lines back */
    GO_TO_PREVIOUS_LINE: 'F',
}

module.exports = {
    ANSI,
}
