
      {{#each resources }}
      <tr>
        <td>{{this.title}}</td>
        <td>{{this.id}}</td>
        <td>
          {{#if isNote}}
          <a class="btn btn-secondary btn-sm" href="/notes/note{{ this.id }}">View Note</a>
          {{else}}
          <a class="btn btn-secondary btn-sm" href="/docs/doc{{ this.id }}">View Document</a>
          {{/if}}
        </td>
      </tr>
      {{/each}}
    </table>
  </div>