
function insertSmashing(smashing) {

  // here's a new div to drop the some data into...
  const newDiv = document.createElement("div");
  newDiv.classList.add("smashingResult");
  newDiv.appendChild(document.createElement('p'))

  for (let key in smashing){
    if (key.toString() === "smashingText" || key.toString() === "length" || key.toString() === "date" || key.toString() === "sentiment" ) {
      let para = document.createElement('p');
      let text = document.createTextNode(key.toString() + ": " + smashing[key]);
      para.appendChild(text);
      newDiv.appendChild(para);
      document.getElementById('results').appendChild(newDiv);
    }
  };
}

function deleteAllResults() {


  let smashResults = document.getElementsByClassName('smashingResult');

  while(smashResults[0])
    smashResults[0].parentNode.removeChild(smashResults[0]);

}


function refreshResults() {

  deleteAllResults();

  const b = '#filtering input[type="text"], #filtering input[type="number"]';
  const allInputs = document.querySelectorAll(b);
  const qs = Array.prototype.filter.call(allInputs, (ele) => ele.value.length > 0)
  .map(ele => `${ele.name}=${ele.value}`)
  .join('&');
  console.log('qs=' + qs);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/smashings?' + qs);
    xhr.addEventListener('load', function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            const smashings = JSON.parse(xhr.responseText);
            for (const s of smashings) {
                insertSmashing(s);
            }
        }
    });
    xhr.send();



/* BEFORE JOE

  // TODO:
  // retrieve filtered smashing data from the api and display results
  //
  // * get rid of the existing results (if there are any) on the page so 
  //   that we can show the new updated results (there's a helper function
  //   declared above that can be called to do this... as long as you've
  //   already implemented it)
    deleteAllResults();
  // * construct a query string by pulling values from every form field in
  //   this filter form (you can get every form field individually or use 
  //   some combination of higher order functions over all of the inputs)
    let queryStr = "?";

    let inputs = document.getElementById("filtering").children[0];
    //console.log("inputs: "+inputs[0].name);
    //console.log("HERE" + inputs.length)

    for (let i = 0; i < inputs.length-1; i++) {
      let temp = inputs[i];
      console.log("temp " +temp.name);
      
      if (temp.value != "" && temp.value != undefined) {
        queryStr += temp.name + "=" + temp.value + "&";
      }
    }
    // remove the trailing "&"
    if (queryStr.length > 1) {
      queryStr = queryStr.slice(0, queryStr.length-1);
    // deal with empty query
    } else if (queryStr === "?") {
      queryStr = "";
    }

  // * make a GET request to /api/smashings with the query string attached
  // * parse the resulting response
  // * go over every smashing in the result and add it to the dom (there's
  //   a helper function above that will do this for you if you finish the 
  //   implementation)

    // fetch data
    console.log("QUERY HERE: "+ queryStr)
    fetch("http://localhost:3000/api/smashings" + queryStr)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log("refreshing: " + JSON.stringify(myJson));
        myJson.forEach(function(obj){
          insertSmashing(obj);
          // make this prettier if you have time 
        });
      });
    
      end BEFORE JOE  */
}

function postSmashing() {

  const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/smashing');
      console.log(xhr.status);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

      const textarea = document.querySelector('#userInput textarea');
      console.log(textarea);
      const text = textarea.value;
      console.log(text);
      xhr.send('smashingText=' + text);
      xhr.addEventListener('load', function() {
        console.log('content loaded!');
        refreshResults();
      });
}



function main() {

  refreshResults();
  const filterBtn = document.querySelector('#filtering input[type="submit"]');
  filterBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    refreshResults();
  });

  const postBtn = document.querySelector('#userInput input[type="submit"]');
    postBtn.addEventListener('click', function(event) {
    event.preventDefault();
    postSmashing();
  })

  /* BEFORE JOE

  // set up event handlers, show all smashings from database
  //
  // * get all of the keyboard smashings and display them immediately once 
  //   this page loads (there's a function that already does this for you
  //   defined above - assuming that you've finished the implementation)
  refreshResults();
  // * add an event handler so that the pressing the button on the filter
  //   form will get the keyboard smashings filtered based on the form inputs 
  //   and display the smashings in the DOM (again there's a function above 
  //   that already does this for you - assuming you've implemented it 
  //   correctly)
  //let btn = document.getElementById("userInput").firstChild.lastChild;
  //btn.addEventListener("click", refreshResults);


  // * add an event handler to the send user data form so that when the
  //   button is pressed, a new keyboard smashing is aved to the database
  //   (use one of the functions that you've finished above to do this) 
  // (postsmashing())

  end BEFORE JOE */ 
}

document.addEventListener("DOMContentLoaded", main);
