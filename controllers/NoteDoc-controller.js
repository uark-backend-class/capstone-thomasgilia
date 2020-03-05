// TO DO:

const Note = require("../db").Note;
const Doc = require("../db").Doc;

// exports.creationControl = (req, res) => {
//   try {
//     let resourceType = req.name;
//     console.log(resourceType);
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };

exports.listResource = async (req, res) => {
  try {
    let resourceType = "Document"; //temporary

    // let resourceType = req.param.resourceType; //have to add to param...
    if (resourceType == "Note") {
      let resources = await Note.findAll();
      res.render("listNoteOrDoc", { resourceType: "Note", resources });
    } else if (resourceType == "Document") {
      let resources = await Doc.findAll();
      res.render("listNoteOrDoc", { resourceType: "Document", resources });
    }
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};

// exports.listResourceByClient = async (req, res) => {
//   try {
//     let resourceType = "Document"; //temporary
//     let clientID = 2; //temporary
//     if (resourceType == "Note") {
//       let resources = await Note.findAll();
//       res.render("listNoteOrDoc", { resourceType: "Note", resources });
//     } else if (resourceType == "Document") {
//       let resources = await Doc.findAll();
//       res.render("listNoteOrDoc", { resourceType: "Document", resources });
//     }
//   } catch (error) {
//     console.log("HERE'S THE ERROR: " + error);
//   }
// };

// exports.CreateResource = async (req, res) => {
//   // let resourceType = req.param.resourceType; //have to add to param...
//   let resourceType = "Document"; //temporary
//   if (resourceType == "Document") {
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
