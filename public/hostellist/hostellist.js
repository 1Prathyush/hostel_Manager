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
let currentUser = null;
let id_token;
const hostelicon = [];
const container = document.getElementById("container");
let create = document.getElementById("create");
let join = document.getElementById("join");
let signout = document.getElementById("logout");
let home = document.getElementById("home");
let myprofile = document.getElementById("profile");
let joinH = document.getElementById("joinhostel");
let createH = document.getElementById("createhostel");
let createSubmit =document.getElementById("csubmit");
let joinSubmit=document.getElementById("jsubmit");
let jclose = document.getElementById("jclose");
let cclose = document.getElementById("cclose");
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("loged in");
    currentUser = user;

    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        id_token = idToken;
        fetch("/api/hostels", {
          method: "GET",
          headers: {
            id: idToken,
            //  Authentication: idToken,
          },
        })
          .then((response) => response.json())
          .then((Result) => {
            console.log(Result);
            hostelview(Result);
            userRole(id_token);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    console.log("please log in");
  }
});

function hostelview(data) {
  console.log(data)
  try {
    for (let i = 0; i < data.length; i++) {
      let a = document.createElement("a");
     a.href = `/h/${data[i].hostelid}`;
      let div = document.createElement("div");
      let br = document.createElement("br");
      div.classList = "hostel";
      div.id = data[i].hostelid;
      div.innerHTML = data[i].name;
      container.appendChild(a);
      a.appendChild(div);
      container.appendChild(br);
    }
  } catch (error) {
    console.log(error);
  }
}

function openHostel(e) {
  const selectedButton = e.target;
  const hosteldata = selectedButton.id;
  console.log(hosteldata);

  window.location.assign(`/hostel/${hosteldata}`);
}

function userRole(data) {
  console.log(data);

  fetch("/api/userRole", {
    method: "GET",
    headers: {
      id: data,
      //  Authentication: idToken,
    },
  })
    .then((response) => response.json())
    .then((Result) => {
      console.log(Result);
      if (Result[0] == "manager") {
        create.classList.remove("hide");
      } else {
        join.classList.remove("hide");
      }
    });
}



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
  window.location = "/h";
});


myprofile.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = "/h/myprofile";
});

create.addEventListener("click", (e) => {
  e.preventDefault();
 createH.classList.remove("hide");
});

join.addEventListener("click", (e) => {
  
  joinH.classList.remove("hide");

});

jclose.addEventListener('click',e=>{
  console.log("bye all");
  joinH.classList.add("hide");
})
joinSubmit.addEventListener('click',e=>{
  e.preventDefault();
  console.log("hai all");

  const hostelcode = document.getElementById("hcode");

  console.log(hostelcode.value);

  firebase
    .auth()
    .currentUser.getIdToken(/* forceRefresh */ true)
    .then((idToken) => {
      console.log(idToken);
      fetch("/api/joinhostel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          id: idToken,
        },
        body: JSON.stringify({ hcode: hostelcode.value }),
      })
      //  .then((response) => {
      ///    response.json();
      //  })
        .then((data) => {
          console.log("Success:", data);
          window.location ="/h"
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });



})

cclose.addEventListener('click',e=>{
  console.log("bye all");
  createH.classList.add("hide");
})
createSubmit.addEventListener('click',e=>{
  e.preventDefault();
  console.log("hai all");

  const hname = document.getElementById("name");
  const hplace = document.getElementById("place");
  firebase
    .auth()
    .currentUser.getIdToken(/* forceRefresh */ true)
    .then(function (idToken) {
      //console.log(idToken);
      fetch("/api/createhostel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          id:idToken,
        },
        body: JSON.stringify({
          hostelname: hname.value,
          hostelplace: hplace.value,
        }),
       
      })
        // .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
         window.location ="/h"
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
})