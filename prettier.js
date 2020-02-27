//to use by default - ctrl shift p, search format code, choose prettier
//to set as default - same, same, choose config default format, choose prettier. then can right click and
//choose format document to run prettier
//to config to format on save:  search settings for format, check format on save. if you have autosave still hit
//save to trigger it. there are other options to

//documentation at prettier.io
//see for additional defaults and things to change. (create own config file) rec. changing to accept trailing comma
//put config file in folder of your project:  .prettierrc   recommend putting in each project folder so everyone
//can use same patterns
//(or add to pkg json etc. there are other options)

let ndnd = require("dkdkdk");

let stuff = { greeting: "hi", salutations: "sup" };
//   can do //prettier-ignore in front of a a block that you want prettier to ignore (diff for html etc)