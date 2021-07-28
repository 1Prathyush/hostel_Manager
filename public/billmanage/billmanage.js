var firebaseConfig = {
  apiKey: "AIzaSyCUZ-V4SIAIu3wOD10jT022jkXoDWpX75Q",
  authDomain: "hostel-manager-cbc1a.firebaseapp.com",
  databaseURL: "https://hostel-manager-cbc1a.firebaseio.com",
  projectId: "hostel-manager-cbc1a",
  storageBucket: "hostel-manager-cbc1a.appspot.com",
  messagingSenderId: "876084003915",
  appId: "1:876084003915:web:74e46d42b107ce1423b9ce",
  measurementId: "G-KFVR03EDC0",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let hostelname = document.getElementById("logo");
let signout = document.getElementById("logout");
let home = document.getElementById("home");
let myprofile = document.getElementById("profile");
let clickbill = document.getElementById("bills");
let members =document.getElementById("members");
let userdata = null;
let hostel;
const togglebutton = document.getElementsByClassName("toggle-button")[0];
const navbarlinks = document.getElementsByClassName("navbar-links")[0];
const logoname = document.getElementsByClassName("logo")[0];
const container = document.getElementsByClassName('container')[0]; 
togglebutton.addEventListener("click", () => {
  togglebutton.classList.toggle("open");
  navbarlinks.classList.toggle("active");
  logo.classList.toggle("hide");
  container.classList.toggle('hide');

});
//----------      file upload const         -----------//
let submitButton = document.getElementById('submit');
let upfile =document.getElementById('upload');
let amount = document.getElementById('amount');
let month = document.getElementById('month');
//--------------//
let path = window.location.pathname.split("/");
//console.log(path[2])
const hostelid = path[2];
let currentUser = null;
firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    console.log("user is not signed in ");
    window.location = "/";
  } else {
    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        //   console.log(idToken);
        userdata = idToken;
        await fetch("/api/hosteldetails", {
          method: "GET",
          headers: {
            hid: hostelid,
            id: idToken,
          },
        })
          .then((response) => response.json())
          .then((Result) => {
            console.log(Result);
            let str = Result.name;
            console.log(str.toUpperCase());
            hostel = str;
            hostelname.innerHTML = str.toUpperCase();
          });
      });
  }
});

signout.addEventListener("click", (e) => {
  e.preventDefault();
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("sign out");
      window.location = "/";
    })
    .catch(function (error) {
      console.log(error);
    });
});

home.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = `/h/${hostelid}`;
});

myprofile.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = "/h/myprofile";
});
members.addEventListener('click',(e)=>{
  e.preventDefault();
  window.location =`/h/${hostelid}/members`;
})
submitButton.addEventListener('click',e=>{
  e.preventDefault();
  console.log('hai ');
  console.log(month.value);
  console.log(amount.value);


  try {
    var input = upfile;
    let reader = new FileReader(upfile);
    reader.onload =function(){
     inputdataURL = reader.result;
      console.log(inputdataURL);
    //  uploadfile(inputdataURL);
      upfileed(input);
      var output = document.getElementById('output');
      output.src = inputdataURL;
    }
    reader.readAsDataURL(input.files[0]);
    
  } catch (error) {
    console.log(error);
  }
 

})



function uploadfile(inputdataURL){
console.log(`hai all ${inputdataURL}`)
  fetch("/api/uploadfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      id: userdata,
    },
    body: JSON.stringify({
      messbill:inputdataURL,
      Month : month.value,
      Amount : amount.value,
      hostelID: hostelid,
      hostelName :hostel
    }),
  })
    // .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

}


function upfileed(inputdataURL){
  let file = inputdataURL


  let storageref = firebase.storage().ref(`${hostel}/${month.value}/` + file.name)


  storageref.put(file)
}