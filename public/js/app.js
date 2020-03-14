//for now - deprecated

let assocSelector = document.querySelector('#assocSelector');

assocSelector.addEventListener("click", event => {
    let assocSelectorDivNode = document.querySelector('#selectResourceType');
    let currentIdDivNode = document.querySelector('#currentId');
    let currentTypeDivNode = document.querySelector('#currentType');
    let inputNode = document.createElement("input");        //creating our input node to use lower down
    inputNode.assoc1Id = currentIdDivNode;  //adding attributes to our input. otherwise it adds just input with no attributes
    inputNode.assoc1Type = currentTypeDivNode;    //ditto
    // let breakNode = document.createElement("br");
    assocSelectorDivNode.appendChild(inputNode);           //adding our newly created nodes to our existing DOM
    // resourceTypeDivNode.appendChild(breakNode);
    //in above line, need to dynamically create node in js to tell it what to append into the child - create element
    console.log("add new");
});
