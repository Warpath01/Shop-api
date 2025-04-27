
exports.resMessage = (req, res, next) => {
    res.locals.errors = [];
    res.locals.success = [];
    next()
}