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

let message = document.getElementById("infobutton");
let signout = document.getElementById("logout");
let currentUser = null;
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    currentUser = user;
    console.log("logged in ");
    try {
      firebase
        .auth()
        .currentUser.getIdToken(/* forceRefresh */ true)
        .then((Result) => {
          console.log(Result);
          fetch("/api/userdata", {
            method: "GET",
            headers: {
              id: Result,
              //  Authentication: idToken,
            },
          })
            .then((response) => response.json())
            .then((Result) => {
              console.log(Result);

              updateName(Result);
            });
        });
    } catch (error) {
      alert("Something went wrong try after some times :)");
      console.log(error);
    }
  } else {
    message.innerText = "Sign In";

    message.addEventListener("click", (e) => {
      window.location = "/login";
    });
  }
});

function updateName(data) {
  console.log(data[0]);

  message.innerText = `hai ${data[0]}`;
  signout.classList.remove("hide");

  message.addEventListener("click", (e) => {
    e.preventDefault();
    window.location = "/h";
  });
}

signout.addEventListener("click", (e) => {
  e.preventDefault();
  firebase
    .auth()
    .signOut()
    .then(function () {
      console.log("sign out");
      signout.classList.add("hide");
    })
    .catch(function (error) {
      console.log(error);
    });
});
