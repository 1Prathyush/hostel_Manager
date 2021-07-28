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
let anounce = document.getElementById("anounce");
let readm = document.getElementById("readm");
let signout = document.getElementById("logout");
let home = document.getElementById("home");
let myprofile = document.getElementById("profile");
let mcancel = document.getElementById("mcancel");
let msubmit = document.getElementById("mclick");
let message = document.getElementById("message");
let littlecontainer = document.getElementById("littlecontainer");
let clickbill = document.getElementById("bills");
let members = document.getElementById("members")
let userdata = null;


const togglebutton = document.getElementsByClassName('toggle-button')[0];
const navbarlinks = document.getElementsByClassName('navbar-links')[0];
const logoname = document.getElementsByClassName('logo')[0];
togglebutton.addEventListener('click',()=>{
  togglebutton.classList.toggle('open');
  navbarlinks.classList.toggle('active');
  logo.classList.toggle('hide');
});

//--------------//
let path = window.location.pathname.split("/");
const hostelid = path.pop();
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
            hostelname.innerHTML = str.toUpperCase();
            displayAnounce();
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

anounce.addEventListener("click", (e) => {
  e.preventDefault();
  readm.classList.remove("hide");
  anounce.classList.add("hide");
});
mcancel.addEventListener("click", (e) => {
  e.preventDefault();
  readm.classList.add("hide");
  anounce.classList.remove("hide");
});

members.addEventListener('click',e=>{

  e.preventDefault();
  window.location= `/h/${hostelid}/members`;

})

msubmit.addEventListener("click", (e) => {
  e.preventDefault();
  let anounceMessage = message.value;
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDate();
  let correctDay = year + "-" + month + "-" + day;
  console.log(correctDay);

  /*
 let hh =now.getHours();
 let mm = now.getMinutes();
 let ss = now.getSeconds();
 let time = hh+":"+mm+":"+ss;
 console.log(time);

 let actualdate = correctDay+"T"+time+".000Z";
 console.log(actualdate)*/
  fetch("/api/anouncement", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      id: userdata,
    },
    body: JSON.stringify({
      Amessage: anounceMessage,
      adate:correctDay,
      Hostelid: hostelid,
    }),
  })
    // .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);


     
      readm.classList.add("hide");
      anounce.classList.remove("hide");
      displayAnounce();
      window.location = `/h/${hostelid}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});


function displayAnounce(){
  fetch("/api/displayAnouncement", {
    method: "GET",
    headers: {
      hid: hostelid,
      id: userdata
    },
  })
    .then((response) => response.json())
    .then((Result) => {
      console.log(Result);
      Result.forEach(element => {
        let ndiv = document.createElement('div');
        ndiv.innerHTML = `by ${element.auther}`;
        ndiv.className ="auther";
        let ddiv = document.createElement('div');
       
        let darr = element.date.split("T");
        console.log(darr[0]);
        ddiv.innerHTML = darr[0];
        ddiv.className = "date";
        let div = document.createElement('div');
        div.className = 'message';
        let mdiv = document.createElement('div');
        mdiv.innerHTML = element.Message;
        mdiv.className= 'messagepart';
        div.appendChild(ndiv);
        div.appendChild(ddiv);
        div.appendChild(mdiv);
        littlecontainer.appendChild(div);

      });
    });

}

clickbill.addEventListener('click',(e)=>{
  e.preventDefault();
  console.log('hai all');
  window.location = `/h/${hostelid}/hostelbills`;
})