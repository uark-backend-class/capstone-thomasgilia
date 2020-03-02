// TO DO:

const Note = require("../db").Note;
const Doc = require("../db").Doc;
//
exports.listResource = async (req, res) => {
  try {
    let resourceType = req.param.resourceType; //have to add to param...
    if (resourceType == "New Document") {
      let notes = await Note.findAll();
      res.json(notes);
      res.render('listNoteOrDoc', { resourceType: resourceType, resources });  

    } else if (resourceType == "New Document") {
      let docs = await Doc.findAll();
      res.json(docs);
    }
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};

exports.CreateResource = async (req, res) => {
  let resourceType = req.param.resourceType; //have to add to param...
  if (resourceType == "NewDoc") {
    res.render("createNoteOrDoc", {
      action: "NewDoc",
      buttonText: "Create a new Document",
    });
  } else if (resourceType == "NewNote") {
    //from button on form
    res.render("createNoteOrDoc", {
      action: "createResource",
      buttonText: "Create a new Note",
    });
  }
};
