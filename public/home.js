


function subscribe() {
  const email = document.getElementById("email").value;

  if(!email){
    alert("Please enter an email");
    return;
  }

  alert("Thanks for subscribing!");
  document.getElementById("email").value = "";
}





