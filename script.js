/* =====================================================
   VEHICLE ACCIDENT EMERGENCY SYSTEM
   JAVASCRIPT ES6
===================================================== */


/* ================= GLOBAL VARIABLES ================= */

let countdownTimer = null;

let countdownValue = 10;

let currentLatitude = null;

let currentLongitude = null;


/* ================= PAGE NAVIGATION ================= */

function showPage(pageId, button) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {

        page.classList.remove("active");

    });


    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    const navButtons =
        document.querySelectorAll(".nav-item");

    navButtons.forEach(item => {

        item.classList.remove("active");

    });


    if (button) {

        button.classList.add("active");

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ================= SOS SYSTEM ================= */

document
    .getElementById("sosButton")
    .addEventListener("click", startEmergency);


function startEmergency() {

    const modal =
        document.getElementById("emergencyModal");

    const status =
        document.getElementById("systemStatus");


    modal.classList.add("show");

    status.textContent = "EMERGENCY";

    status.style.color = "#ff4d5a";


    countdownValue = 10;

    document.getElementById("countdown").textContent =
        countdownValue;


    // Get GPS immediately

    getLocation();


    countdownTimer = setInterval(() => {

        countdownValue--;

        document.getElementById("countdown").textContent =
            countdownValue;


        if (countdownValue <= 0) {

            clearInterval(countdownTimer);

            executeEmergency();

        }

    }, 1000);

}


/* ================= CANCEL SOS ================= */

function cancelEmergency() {

    clearInterval(countdownTimer);

    document
        .getElementById("emergencyModal")
        .classList.remove("show");


    const status =
        document.getElementById("systemStatus");

    status.textContent = "SAFE";

    status.style.color = "#50e890";

}


/* ================= EMERGENCY EXECUTION ================= */

function executeEmergency() {

    document
        .getElementById("emergencyModal")
        .classList.remove("show");


    const status =
        document.getElementById("systemStatus");

    status.textContent = "HELP ACTIVATED";

    status.style.color = "#ff4d5a";


    // Save accident history

    saveEmergencyHistory();


    // Get contacts

    const contacts =
        JSON.parse(
            localStorage.getItem("emergencyContacts")
        ) || [];


    /*
       Browser security normally prevents a website
       from automatically calling multiple numbers.
       Therefore tel: links require user confirmation.
    */

    if (contacts.length > 0) {

        alert(
            "Emergency activated!\n\n" +
            "Your saved emergency contacts are ready."
        );

    } else {

        alert(
            "Emergency activated!\n\n" +
            "Please contact Police, Ambulance or Emergency Services."
        );

    }

}


/* ================= CALL FUNCTION ================= */

function callNumber(number) {

    const confirmation = confirm(
        "Call emergency number " + number + "?"
    );


    if (confirmation) {

        window.location.href = "tel:" + number;

    }

}


/* ================= GPS LOCATION ================= */

function getLocation() {

    const locationBox =
        document.getElementById("locationBox");


    if (!navigator.geolocation) {

        locationBox.innerHTML = `
            <span class="location-icon">❌</span>

            <div>
                <strong>GPS not supported</strong>

                <p>
                    Your browser does not support
                    Geolocation API.
                </p>
            </div>
        `;

        return;

    }


    locationBox.innerHTML = `
        <span class="location-icon">⏳</span>

        <div>
            <strong>Detecting location...</strong>

            <p>
                Please allow location permission.
            </p>
        </div>
    `;


    navigator.geolocation.getCurrentPosition(

        function(position) {

            currentLatitude =
                position.coords.latitude;

            currentLongitude =
                position.coords.longitude;


            const mapLink =
                `https://www.google.com/maps?q=${currentLatitude},${currentLongitude}`;


            locationBox.innerHTML = `

                <span class="location-icon">📍</span>

                <div>

                    <strong>
                        Location detected
                    </strong>

                    <p>
                        ${currentLatitude.toFixed(6)},
                        ${currentLongitude.toFixed(6)}
                    </p>

                    <a
                        href="${mapLink}"
                        target="_blank"
                        style="
                        color:#ff5662;
                        font-size:11px;
                        text-decoration:none;
                        "
                    >
                        Open in Google Maps →
                    </a>

                </div>
            `;

        },


        function(error) {

            let message =
                "Unable to detect location.";


            if (error.code === 1) {

                message =
                    "Location permission was denied.";

            } else if (error.code === 2) {

                message =
                    "Location information unavailable.";

            } else if (error.code === 3) {

                message =
                    "Location request timed out.";

            }


            locationBox.innerHTML = `

                <span class="location-icon">⚠️</span>

                <div>

                    <strong>
                        Location Error
                    </strong>

                    <p>
                        ${message}
                    </p>

                </div>
            `;

        },

        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}


/* ================= SHARE SYSTEM ================= */

async function shareEmergency() {

    let locationText =
        "Location unavailable";


    if (
        currentLatitude !== null &&
        currentLongitude !== null
    ) {

        locationText =
            `https://www.google.com/maps?q=${currentLatitude},${currentLongitude}`;

    }


    const shareText =

        `🚨 EMERGENCY ALERT

Vehicle accident emergency.

Please provide immediate help.

My current location:
${locationText}`;


    if (navigator.share) {

        try {

            await navigator.share({

                title:
                    "Vehicle Accident Emergency",

                text:
                    shareText

            });

        } catch (error) {

            console.log(
                "Share cancelled."
            );

        }

    } else {

        // Fallback

        navigator.clipboard.writeText(
            shareText
        );


        alert(
            "Emergency information copied to clipboard."
        );

    }

}


/* ================= CONTACT MANAGEMENT ================= */

function addContact() {

    const name =
        document.getElementById("contactName")
            .value.trim();


    const phone =
        document.getElementById("contactPhone")
            .value.trim();


    const email =
        document.getElementById("contactEmail")
            .value.trim();


    if (name === "" || phone === "") {

        alert(
            "Please enter contact name and phone number."
        );

        return;

    }


    const contact = {

        id: Date.now(),

        name: name,

        phone: phone,

        email: email

    };


    let contacts =
        JSON.parse(
            localStorage.getItem(
                "emergencyContacts"
            )
        ) || [];


    contacts.push(contact);


    localStorage.setItem(
        "emergencyContacts",
        JSON.stringify(contacts)
    );


    document.getElementById("contactName").value = "";

    document.getElementById("contactPhone").value = "";

    document.getElementById("contactEmail").value = "";


    loadContacts();


    alert(
        "Emergency contact saved successfully."
    );

}


/* ================= LOAD CONTACTS ================= */

function loadContacts() {

    const list =
        document.getElementById("contactList");


    const contacts =
        JSON.parse(
            localStorage.getItem(
                "emergencyContacts"
            )
        ) || [];


    if (contacts.length === 0) {

        list.innerHTML = `

            <p style="
                color:#858d99;
                font-size:13px;
                margin-top:10px;
            ">

                No emergency contacts added yet.

            </p>
        `;

        return;

    }


    list.innerHTML = "";


    contacts.forEach(contact => {

        const item =
            document.createElement("div");


        item.className =
            "saved-contact";


        item.innerHTML = `

            <div class="saved-contact-info">

                <strong>
                    ${escapeHTML(contact.name)}
                </strong>

                <small>
                    📞 ${escapeHTML(contact.phone)}
                </small>

                ${
                    contact.email
                    ?
                    `<br>
                     <small>
                        📧 ${escapeHTML(contact.email)}
                     </small>`
                    :
                    ""
                }

            </div>


            <div class="contact-actions">

                <button
                    class="icon-button"
                    onclick="callNumber('${contact.phone}')">

                    📞

                </button>


                ${
                    contact.email
                    ?
                    `<button
                        class="icon-button"
                        onclick="emailContact('${contact.email}')">

                        📧

                     </button>`
                    :
                    ""
                }


                <button
                    class="icon-button"
                    onclick="deleteContact(${contact.id})">

                    🗑️

                </button>

            </div>

        `;


        list.appendChild(item);

    });

}


/* ================= EMAIL CONTACT ================= */

function emailContact(email) {

    document.getElementById("emailInput").value =
        email;


    showPage(
        "dashboard",
        document.querySelector(".nav-item")
    );


    alert(
        "Emergency email selected."
    );

}


/* ================= DELETE CONTACT ================= */

function deleteContact(id) {

    let contacts =
        JSON.parse(
            localStorage.getItem(
                "emergencyContacts"
            )
        ) || [];


    contacts =
        contacts.filter(
            contact => contact.id !== id
        );


    localStorage.setItem(
        "emergencyContacts",
        JSON.stringify(contacts)
    );


    loadContacts();

}


/* ================= HISTORY ================= */

function saveEmergencyHistory() {

    const record = {

        date:
            new Date().toLocaleString(),

        latitude:
            currentLatitude,

        longitude:
            currentLongitude

    };


    let history =
        JSON.parse(
            localStorage.getItem(
                "accidentHistory"
            )
        ) || [];


    history.unshift(record);


    localStorage.setItem(
        "accidentHistory",
        JSON.stringify(history)
    );


    loadHistory();

}


/* ================= LOAD HISTORY ================= */

function loadHistory() {

    const list =
        document.getElementById("historyList");


    const history =
        JSON.parse(
            localStorage.getItem(
                "accidentHistory"
            )
        ) || [];


    if (history.length === 0) {

        list.innerHTML = `

            <p style="
                color:#858d99;
                font-size:13px;
            ">

                No emergency history available.

            </p>
        `;

        return;

    }


    list.innerHTML = "";


    history.forEach((record, index) => {

        let location = "Not available";


        if (
            record.latitude !== null &&
            record.longitude !== null
        ) {

            location =
                `${record.latitude.toFixed(5)},
                 ${record.longitude.toFixed(5)}`;

        }


        const item =
            document.createElement("div");


        item.className =
            "history-item";


        item.innerHTML = `

            <strong>
                🚨 Emergency Alert #${index + 1}
            </strong>

            <small>
                Time: ${record.date}
            </small>

            <br>

            <small>
                📍 Location: ${location}
            </small>

        `;


        list.appendChild(item);

    });

}


/* ================= CLEAR HISTORY ================= */

function clearHistory() {

    const confirmDelete =
        confirm(
            "Clear all emergency history?"
        );


    if (!confirmDelete) {

        return;

    }


    localStorage.removeItem(
        "accidentHistory"
    );


    loadHistory();

}


/* ================= SECURITY HELPER ================= */

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ================= INITIALIZATION ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadContacts();

        loadHistory();

    }
);


/* =====================================================
   EMAILJS EMERGENCY EMAIL SYSTEM
===================================================== */

const EMAILJS_CONFIG = {
    publicKey: "uIr_UI_rvzl3A9qdd",
    serviceId: "service_99f71r3",
    templateId: "template_99nmyud"
};


/* ================= INITIALIZE EMAILJS ================= */

(function () {

    emailjs.init({
        publicKey: EMAILJS_CONFIG.publicKey
    });

})();


/* ================= SEND EMERGENCY EMAIL ================= */

async function sendEmergencyEmail() {

    const emailInput =
        document.getElementById("emailInput");

    const sendButton =
        emailInput.parentElement
            .querySelector(".primary-button");


    const recipientEmail =
        emailInput.value.trim();


    /* Check email */

    if (recipientEmail === "") {

        alert(
            "Please enter emergency email address."
        );

        emailInput.focus();

        return;
    }


    if (!validateEmail(recipientEmail)) {

        alert(
            "Please enter a valid email address."
        );

        emailInput.focus();

        return;
    }


    /* ================= LOCATION ================= */

    let locationText =
        "GPS location not available";


    if (
        currentLatitude !== null &&
        currentLongitude !== null
    ) {

        locationText =
            `https://www.google.com/maps?q=${currentLatitude},${currentLongitude}`;

    }


    /* ================= EMERGENCY MESSAGE ================= */

    const emergencyMessage =

`🚨 VEHICLE ACCIDENT EMERGENCY ALERT

An emergency has been activated through the Vehicle Accident Emergency System.

⚠️ Please provide immediate assistance.

📍 Current GPS Location:
${locationText}

🕐 Emergency Time:
${new Date().toLocaleString()}

🚑 Emergency Services:
Police: 100
Ambulance: 108
Emergency: 112

This email was generated automatically by the Vehicle Accident Emergency System.`;


    /* ================= EMAILJS PARAMETERS ================= */

    const templateParams = {

        to_email: recipientEmail,

        subject:
            "🚨 VEHICLE ACCIDENT EMERGENCY ALERT",

        message:
            emergencyMessage,

        location:
            locationText,

        latitude:
            currentLatitude ?? "Not available",

        longitude:
            currentLongitude ?? "Not available",

        sent_at:
            new Date().toLocaleString()

    };


    /* ================= SEND ================= */

    try {

        sendButton.disabled = true;

        sendButton.textContent =
            "📧 Sending...";


        await emailjs.send(

            EMAILJS_CONFIG.serviceId,

            EMAILJS_CONFIG.templateId,

            templateParams

        );


        alert(
            "✅ Emergency email sent successfully!"
        );


        sendButton.textContent =
            "✅ Email Sent";


        setTimeout(() => {

            sendButton.disabled = false;

            sendButton.textContent =
                "📧 Send Emergency Email";

        }, 2500);


    } catch (error) {

        console.error(
            "EmailJS Error:",
            error
        );


        alert(
            "❌ Email could not be sent.\n\n" +
            "Please check your EmailJS settings."
        );


        sendButton.disabled = false;

        sendButton.textContent =
            "📧 Send Emergency Email";

    }

}


/* ================= EMAIL VALIDATION ================= */

function validateEmail(email) {

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}
