<div>
  <div id="selectResourceType"></div>
  <h2>What type of document do you want to create?</h2>
  <form action="/creationControl" method="get">
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

"Note") {
    let resources = await Note.findAll({ where: { clientId: clientId } }); //also works to give whole note
    // let resources = await thisClient.getNotes();  //works at least to give whole note
    let clientName = "";
    for (let resource of resources) {
      clientName = resource.resources.id;
    } //replace with foreach later
    console.log(clientName); //have to iterate to get all. handlebars #each is iterating!


    <h1>{{#if hasClient}}List of all {{resourceType}}s for client {{#each thisClient }}
  {{this.clientName}}{{/each}}
  {{else}}
  List of all {{resourceType}}s
  {{/if}}
</h1>

<div>
{{#if typeNote}}
<a class="btn btn-primary" href='/add{{resourceType}}/'>New {{resourceType}}</a>
{{ else }}
<a class="btn btn-primary" href='/add{{resourceType}}/'>New {{resourceType}}</a>
{{/if}}
</div>
