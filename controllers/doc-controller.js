const Doc = require("../db").Doc;

exports.getAllDocs = async (req, res) => {
  try {
    let docs = await Doc.findAll();
    res.json(docs);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

exports.newDoc = async (req, res) => {
  try {
    let newDoc = await Doc.create(req.body);
    res.json(newDoc);
    console.log(newDoc);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

exports.deleteDoc = async (req, res) => {
  try {
    const id = req.params.id;
    const obsoleteDoc = await Doc.findByPk(id);
    if (!obsoleteDoc) {
      res.status(404).send();
      return;
    }
    await obsoleteDoc.destroy();
    res.json(obsoleteDoc);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};

//need to update this code
exports.replaceDoc = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = req.body;
    const existingDoc = await Note.findByPk(id);
    if (!existingDoc) {
      res.status(404).send();
      return;
    }
    const replacementDoc = await existingDoc.update(doc);
    res.json(replacementDoc);
  } catch (error) {
    console.log("HERE/'S THE ERROR" + error);
  }
};
