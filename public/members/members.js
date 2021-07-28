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

const togglebutton = document.getElementsByClassName("toggle-button")[0];
const navbarlinks = document.getElementsByClassName("navbar-links")[0];
const logoname = document.getElementsByClassName("logo")[0];
togglebutton.addEventListener("click", () => {
  togglebutton.classList.toggle("open");
  navbarlinks.classList.toggle("active");
  logo.classList.toggle("hide");
});

//------------ nav ---------------------//

let hostelname = document.getElementById("logo");
let signout = document.getElementById("logout");
let home = document.getElementById("home");
let myprofile = document.getElementById("profile");
let clickbill = document.getElementById("bills");
let membercontainer = document.getElementById('membercontainer');
let userdata = null;
let hostel;

//------------

let path = window.location.pathname.split("/");
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
        fetch("/api/hosteldetails", {
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
            fetchmembers();
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

clickbill.addEventListener("click", (e) => {
  e.preventDefault();
  window.location = `/h/${hostelid}/hostelbills`;
});

function fetchmembers() {
  fetch("/api/members", {
    method: "GET",
    headers: {
      hid: hostelid,
      id: userdata,
    },
  })
    .then((response) => response.json())
    .then((Result) => {
      console.log(Result);
      displayData(Result);
    })
    .catch((err) => {
      console.log(err);
    });
}

function displayData(data) {


    //---------------sorting data-------------------------//
   data.sort((a,b)=>(a.name>b.name)?1:-1);
   
    data.forEach(element => {
        
        let dcontainer = document.createElement('div');
        dcontainer.className = "dcontainer"
        membercontainer.appendChild(dcontainer);
        let name = document.createElement('div');
        name.className = "name";
        let mail = document.createElement('div');
        mail.className = 'mail';
        let phone = document.createElement('div');
        phone.className = "phone"
        name.innerHTML =  `${element.name} ${element.last_name}`;
        mail.innerHTML = element.email;
        phone.innerHTML = element.phone_number;

        dcontainer.appendChild(name);
        dcontainer.appendChild(mail);
        dcontainer.appendChild(phone);
        
    });

}
