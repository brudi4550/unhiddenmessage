const modal_button = document.getElementById('modal-button');
const modal = document.getElementById('modal');
var close_button = document.getElementById('close-modal');

modal_button.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
close_button.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const navbar_brand = document.getElementById('navbar-brand');
navbar_brand.addEventListener('click', () => {
    window.location.reload();
});

const tx = document.getElementsByTagName("textarea");
for (let i = 0; i < tx.length; i++) {
  tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
  tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
  this.style.height = "auto";
  this.style.height = (this.scrollHeight) + "px";
}