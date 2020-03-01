xports.associateClientToNote = async (req, res) => {
    try {
      const clientId = req.body.clientId;
      const existingClient = await Client.findByPk(clientId);
      const noteIdArray = [req.body.noteId]; //our array of notes from request - may be one value but still array
      for (let id of noteIdArray) {           //making the association for each id
        await existingClient.setNotes(id);
      }
      let noteList = await existingClient.getNotes(clientId); //listing all associations for that client
      console.log(noteList);
      res.send("Note(s) " + noteIdArray + " now associated with client " + clientId);
    } catch (error) {
      console.log("HERE'S THE ERROR: " + error);
    }
  };
  