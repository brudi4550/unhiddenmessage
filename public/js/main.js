const information_modal_button = document.getElementById('information-modal-button');
const information_modal = document.getElementById('information-modal');
const close_information_modal = document.getElementById('close-information-modal');

const settings_modal_button = document.getElementById('settings-modal-button');
const settings_modal = document.getElementById('settings-modal');
const close_settings_modal = document.getElementById('close-settings-modal');

information_modal_button.onclick = function () {
    information_modal.style.display = "block";
}

settings_modal_button.onclick = function () {
    settings_modal.style.display = "block";
}

close_information_modal.onclick = function () {
    information_modal.style.display = "none";
}

close_settings_modal.onclick = function () {
    settings_modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == settings_modal) {
        settings_modal.style.display = "none";
    } else if (event.target == information_modal) {
        information_modal.style.display = "none";
    }
}

const navbar_brand = document.getElementById('navbar-brand');
navbar_brand.addEventListener('click', () => {
    var loc = window.location;
    window.location = loc.protocol + '//' + loc.host + loc.pathname + loc.search;
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

function resize(event) {
    localStorage.setItem('currentHeightSetting', event.height.value);
    localStorage.setItem('currentWidthSetting', event.width.value);
}
