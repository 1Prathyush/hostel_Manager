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
let id_token;
let data;

let signout = document.getElementById("logout");
let home = document.getElementById("home");
let myprofile = document.getElementById("profile");
let fname = document.getElementById("fname");
let lname = document.getElementById("lname");
let phoneno = document.getElementById("ph");
let email = document.getElementById("email");
let address = document.getElementById("Address");
let iaddress = document.getElementById("Address2");
let institution = document.getElementById("ins");
let submit = document.getElementById("submit");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("loged in");

    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        id_token = idToken;
        fetch("/api/userdetais", {
          method: "GET",
          headers: {
            id: idToken,
            //  Authentication: idToken,
          },
        })
          .then((response) => response.json())
          .then((Result) => {
            console.log(Result);
            updateform(Result);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    console.log("please log in");
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
  window.location = "/h";
});

myprofile.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = "/h/myprofile";
});

//------------------- update form  -------------------------//

function updateform(data) {
  console.log(data.name);
  fname.value = data.name;
  email.value = data.email;
  phoneno.value = data.phone_number;
  address.value = data.address;
  institution.value = data.Institution;
  lname.value = data.last_name;
  iaddress.value= data.iaddress
}

submit.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("the enterd vlues");
  console.log(fname.value);

  firebase
    .auth()
    .currentUser.getIdToken(/* forceRefresh */ true)
    .then(function (idToken) {
      //console.log(idToken);
      fetch("/api/updateUserDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          id: idToken,
        },
        body: JSON.stringify({
          Fname: fname.value,
          Lastname: lname.value,
          Email: email.value,
          phone: phoneno.value,
          Uaddress: address.value,
          iaddress: iaddress.value,
          Institution: institution.value,
        }),
      })
        // .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});
