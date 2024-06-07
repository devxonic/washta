function generate4DigitCode() {
    const code = Math.floor(Math.random() * 9000) + 1000;
    return code.toString();
}


module.exports = {
    generate4DigitCode
}