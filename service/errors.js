module.exports = {
    ERRPAIR: {
        code: 'ERRPAIR',
        message: 'Invalid Pair'
    },
    ERRTRADEBUY(detail) {
        return {
            code: 'ERRTRADEBUY',
            message: 'Error while exec trade buy',
            details: detail
        }
    }
}