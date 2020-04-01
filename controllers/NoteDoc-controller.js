const Note = require("../db").Note;
const Doc = require("../db").Doc;

exports.listAllResources = async (req, res) => {
  try {
    let { resourceType } = req.body;
    let isNote;
    if (resourceType === "Note") {
      let resources = await Note.findAll();
      res.render("listNotesOrDocs", { resourceType: "Note", resources, isNote: true });
    } else if (resourceType === "Document") {
      let resources = await Doc.findAll();
      res.render("listNotesOrDocs", { resourceType: "Document", resources });
    } else { res.redirect('/'); }
  } catch (error) {
    console.log("HERE'S THE ERROR: " + error);
  }
};

