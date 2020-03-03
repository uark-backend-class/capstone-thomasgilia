// TO DO:

const Note = require("../db").Note;
const Doc = require("../db").Doc;

//for now, just doing NOTE ONLY but still calling resource just in case. do simple first!
exports.listResource = async (req, res) => {
  try {
    // let resourceType = req.param.resourceType; //have to add to param...
    let resourceType = "Note"; //temporary
    if (resourceType == "Note") {
      let resources = await Note.findAll();
      console.log(resources)
      // res.json(notes);
      res.render("listNoteOrDoc", { resourceType: "Note", resources });     //!!!!!!!
    } else if (resourceType == "Document") {
      let resources = await Doc.findAll();
      res.render("listNoteOrDoc", { resourceType: "Document", resources });
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

//later maybe...
// exports.listResource = async (req, res) => {
//   try {
//     let resourceType = req.param.resourceType; //have to add to param...
//     if (resourceType == "New Document") {
//       let notes = await Note.findAll();
//       res.json(notes);
//       res.render("listNoteOrDoc", { resourceType: "New Note", resources }); //!!!!!!!
//     } else if (resourceType == "New Document") {
//       let docs = await Doc.findAll();
//       res.json(docs);
//     }
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };

// exports.CreateResource = async (req, res) => {
//   let resourceType = req.param.resourceType; //have to add to param...
//   if (resourceType == "NewDoc") {
//     res.render("createNoteOrDoc", {
//       action: "NewDoc",
//       buttonText: "Create a new Document",
//     });
//   } else if (resourceType == "NewNote") {
//     //from button on form
//     res.render("createNoteOrDoc", {
//       action: "createResource",
//       buttonText: "Create a new Note",
//     });
//   }
// };
