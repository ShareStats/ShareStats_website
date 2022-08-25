import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

let oktokit_files = [];
let questionFolders = [];
let questionFiles = [];
let content = [];
var documents = [];

// Octokit.js
// https://github.com/octokit/core.js#readme

const octokit = new Octokit({
  auth: `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`,
});
collectFolders();
collectFiles(localStorage.getItem('questionFolders'));
//console.log(localStorage.getItem('questionFiles'))
collectContent(localStorage.getItem('questionFiles').split(",") )
addTextToDocuments();



async function collectFolders() {
  const responseRootFolders = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner: "ShareStats",
      repo: "itembank",
      tree_sha: "79b7e6ff0adafc33a8866ed72c88851bfb19fc72",
    }
  );

  responseRootFolders.data.tree.map(async (e, index) => {
    //console.log(e)

    let responseFolders = await octokit.request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner: "ShareStats",
        repo: "itembank",
        tree_sha: e.sha,
      }
    );

    responseFolders.data.tree.map((eachItem, i) => {
      //console.log(eachItem,i)
      eachItem.root = e.path;
      questionFolders.push(eachItem);
    });
    localStorage.setItem('questionFolders',JSON.stringify(questionFolders) );
    
  });

}

async function collectFiles(folders) {
   // console.log("JSON.parse(localStorage.getItem('folders')",JSON.parse(folders))
    JSON.parse( folders).map(async (eachItem, index1) => {
   //  console.log(eachItem);
    oktokit_files[index1] = new Octokit({
      auth: `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`,
    });
    let responseFiles = await oktokit_files[index1].request(
      "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
      {
        owner: "ShareStats",
        repo: "itembank",
        tree_sha: eachItem.sha,
      }
    );
  //  console.log("responseFiles.data.tree",responseFiles.data.tree);
    responseFiles.data.tree.map((eachF, i) => {
      questionFiles.push({
        name:eachItem.path,
        path: eachItem.root + "/" +eachItem.path + "/" + eachF.path});
      //questionFiles[i].filePath = eachItem.root + "/"+ eachF.path
    });
    //console.log("questionFiles", questionFiles);
    localStorage.setItem('questionFiles',JSON.stringify(questionFiles));
  });

}

async function collectContent(files) {
  JSON.parse(files).map(async (eachFile) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      await fetch(`https://raw.githubusercontent.com/ShareStats/itembank/main/${eachFile.path}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            //console.log(result);
            content.push({
                name:eachFile.name,
                path:eachFile.path,
                text: result.split('Meta-information')[1]
            })
        })
        .catch(error => console.log('error', error));
        localStorage.setItem('content',JSON.stringify(content));
        //console.log("localStorage.getItem('content')",localStorage.getItem('content'))
      
  });
 
}

function addTextToDocuments () {
    //console.log("JSON.parse(localStorage.getItem('content')",JSON.parse(localStorage.getItem('content')));
    JSON.parse(localStorage.getItem('content')).map( (eachText,index)=>{
       documents.push({
        id:index,
        url:`https://raw.githubusercontent.com/ShareStats/itembank/main/${eachText.path}`,
        title: eachText.name,
        body: eachText.text
       })
    })
    localStorage.setItem('documents',JSON.stringify(documents))

}


var documents = JSON.parse(localStorage.getItem("documents"));

var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);
    console.log(text,textFile)
    // returns a URL you can use as a href
    return textFile;
  };

  makeTextFile('tasos');





/* var documents = [
  {
    id: 0,
    url: "https://www.sharestats.nl/questions/vu-ancova-001-nl/",
    title: "vu-ancova-001-nl",
    body: "Question In an experiment, a standard ANCOVA analysis investigates the effect of Social Stress (Two-group Factor: $Z_1$) on Performance (Dependent Variable: $y$). We control for Neuroticism (Covariate: $X$, with $\\overline{X} = 20$). The following estimated regression equation is found: $\\hat{y} = 25 \u002b 0.8X \u002b 2Z_1$. Calculate the adjusted means (adjusted means) for both groups of the Factor.\nAnswerlist  25 and 27. 20 and 25. 16 and 20. 41 and 43.  Meta-information exname: vu-ancova-001-nl extype: schoice exsolution: 0001 exsection: Inferential Statistics/Parametric Techniques/ANOVA/ANCOVA exextra[Type]: Case, Calculation exextra[Language]: Dutch exextra[Level]: Statistical Thinking\n",
  },
  {
    id: 1,
    url: "https://www.sharestats.nl/questions/vu-ancova-002-nl/",
    title: "vu-ancova-002-nl",
    body: "TEST test Tasos\n",
  },
];
*/
