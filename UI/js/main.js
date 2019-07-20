function open() {
    document.getElementById('id01').style.display = 'block'
}

// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function changepic() {
    document.getElementById('abtus').innerHTML = "Auto Mart is an online marketplace for automobiles of diverse makes,model or body type" +
        "Here users can sell their cars or buy from trusted dealerships or private sellers.";
}