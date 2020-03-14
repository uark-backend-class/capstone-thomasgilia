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







<h1>{{#if thisClient}}{{resourceType}} for client {{thisClient.clientName}}
    {{else}}
    {{resourceType}} with no associated Client
    {{/if}}
</h1>

<div>
    <a class="btn btn-primary" href='/{{resourceType}}s/'>New {{resourceType}}</a>
    <!-- Deprecated
        <a class="btn btn-primary" href='/associations/' value="current">Add association to this {{resourceType}}</a>-->
    <a class="btn btn-secondary btn-sm" href="/createResource/{{ this.id }}">Edit {{resourceType}}</a>
    <a class="btn btn-warning btn-sm" href="/delete/{{ this.id }}">Delete {{resourceType}}</a></td>
    <div>
        <table class="table">
            <tr>
                <th>{{resourceType}}: {{resources.title}}</th>
                <br>
            </tr>
            <tr>
                <td>{{resources.note}}</td>
                <br>
            </tr>
        </table>
    </div>
    <br>
    <table class="table">
        <tr>
            <th>{{resourceType}} Id</th>
            <th>Flag Urgent?:</th>
            <th>Flag expiration date:</th>
            <th>Category:</th>
            <th>Associated Resources:</th>
            <th>Last Update:</th>
            <th>Last updated by:</th>
        </tr>
        <tr>
            <td>{{resources.id}}</td>
            <td>{{resources.setUrgent}}</td>
            <td>{{resources.flagExpires}}</td>
            <td>{{resources.category}}</td>
            <td>{{resources.docAssociated}}</td>
            <td>{{resources.revisionLog}}</td>
            <td>{{resources.lastUpdateUser}}</td>
        </tr>
    </table>
    <table class="table">
        <tr>
            <th>Revision Log:</th>
            <br>
        </tr>
        <tr>
            <td>{{resources.revisionLog}}</td>
            <br>
        </tr>
    </table>
</div>
<!--   xxxxxxxxxxxxxxxxxxxxxxxxxxx WORKING HERE  xxxxxxxxxxxxxxxxxxxxxxxx 
<h2>This note belongs to client:</h2>
{{#if thisClient}}{{thisClient.clientName}} client Id: {{thisClient.id}}
{{else}}-->
<!--   client association form -->
<form action="/associations" method="put"></form>
<select name="assoc2Id" id="assoc2Id">
    <option value="" selected>--Choose Client--</option>
    {{#each allClients}}
    <option value="{{assoc2Id}}">{{this.id}}</option>  <!--<option value="{{this.clientId}}">{{this.clientName}}</option>-->
    {{/each}}
</select>   
<!--{{/if}}
now 'assoc2Id' value should be the selected client id -should be on object being sent forward-->
<input type="hidden" name="assoc1Type" value="{{resourceType}}" />
<input type="hidden" name="assoc1Id" value="{{resources.id}}" />
<input type="hidden" name="assoc2Type" value="{{assoc2Type}}" />
<input type="hidden" name="assoc2Id" value="{{assoc2Id}}" />
<button type="submit">Add Client</button>
</form>


<!--   doc association -->
<h2>Documents associated with this Note:</h2>
<table class="table">
    <tr>
        <th>Document Title</th>
        <th>Document Id</th>
    </tr>
    <tr>
        {{#each docsThisNote}}
        <td>{{this.title}}</td>
        <td>{{this.id}}</td>
    </tr>
    {{/each}}
</table>

{{#if thisClient}}
<form action="/associations" method="post"></form>

<select name="assoc2Id" id="assoc2Id">
    <option value="" selected>--None--</option>
    {{#each allDocsThisClient}}
    <option value={{this.id}}>{{this.title}}</option>
    {{/each}}
</select>

<input type="hidden" name="assoc1Type" value="{{resourceType}}" />
<input type="hidden" name="assoc1Id" value="{{resources.id}}" />
<input type="hidden" name="assoc2Type" value="Document" />
<input type="hidden" name="docAssociated" value="true" />
<button type="submit">Add Doc</button>
</form>
{{else}}
Please choose client above before associating documents
{{/if}}
<br />