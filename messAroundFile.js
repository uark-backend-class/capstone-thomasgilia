//--One(Client)-To-Many(Notes)--//
//after this works, add {as: "owner"} to association
exports.associateClientToNote = async (req, res) => {
    try {
      const clientId = req.body.clientId;
      const noteId = req.body.noteId;
      // console.log("this is clientId " + clientId + ", and this is noteId " + noteId + ", and this is req.body:");
      // console.log(req.body);
      const existingClient = await Client.findByPk(clientId);
      const existingNote = await Note.findByPk(noteId);  
      await existingClient.setNote(noteId);
      const checkClientOnNote = await existingClient.getNote;
      // await existingClient.setNotes(noteId);
      // const updatedNote = await Note.findByFk(clientId );
      console.log(checkClientOnNote);
      res.send(checkClientOnNote);
    } catch (error) {
      console.log("HERE'S THE ERROR: " + error);
    }
  };