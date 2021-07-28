const togglebutton = document.getElementsByClassName('toggle-button')[0];
const navbarlinks = document.getElementsByClassName('navbar-links')[0];
const logoname = document.getElementsByClassName('logo')[0];
togglebutton.addEventListener('click',()=>{
  togglebutton.classList.toggle('open');
  navbarlinks.classList.toggle('active');
  logo.classList.toggle('hide');
});
