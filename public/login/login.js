const mail = document.getElementById('email');
const password = document.getElementById('password');
const signin = document.getElementById('login');
const signout = document.getElementById('logout');
signin.addEventListener('click',(e)=>{
  e.preventDefault();
  console.log(mail.value + "  " + password.value);
  firebase.auth().signInWithEmailAndPassword(mail.value, password.value)
  .then((user) => {
    console.log("sign in")
    window.location="/h";
  }) 
  .catch((error) => {
    console.log("please sign in ");
    console.log(error.code);
    console.log(error.message);
    alert(error.code);
  });
});

signout.addEventListener('click',(e)=>{
  e.preventDefault();
  firebase.auth().signOut().then(function() {
   console.log("sign out");
  }).catch(function(error) {
    console.log(error);
  });
})


