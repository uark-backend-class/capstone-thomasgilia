// TO DO:


const Note = require("../db").Note;
const Doc = require("../db").Doc; 
//
exports.getAllNotes = async (req, res) => {
  try {
    res.json();
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};
