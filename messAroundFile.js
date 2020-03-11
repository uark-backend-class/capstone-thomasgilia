<div>
  <div id="selectResourceType"></div>
  <h2>What type of document do you want to create?</h2>
  <form action="/creationControl" metdod="get">
    <div>
      <input type="radio" id="Note" name="chooseType" value="note" checked>
      <label for="note">Note</label>
    </div>

    <div>
      <input type="radio" id="Document" name="chooseType" value="document">
      <label for="document">Document</label>
    </div>

    <button type='submit' id='addResource'>Select Resource</button>
  </form>
  <script src="../../../js/app.js"></script>
</div>

