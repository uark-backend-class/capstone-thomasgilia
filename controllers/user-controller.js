
exports.homepage = async (req, res) => {
    try {
        res.render("homepage");
    } catch (error) {
        console.log("HERE'S THE ERROR" + error);
    }
}