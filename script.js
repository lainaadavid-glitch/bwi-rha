```javascript
/* ============================================
   BWI-RHA EKITI STATE CHAPTER
   ADO LG
   MAIN JAVASCRIPT
============================================ */


/* ============================================
   ADO LG WARDS
============================================ */

const wards = [
    {
        number: 1,
        name: "Ado A",
        area: "Idofin"
    },
    {
        number: 2,
        name: "Ado B",
        area: "Inisa"
    },
    {
        number: 3,
        name: "Ado C",
        area: "Idolofin"
    },
    {
        number: 4,
        name: "Ado D",
        area: "Ijigbo"
    },
    {
        number: 5,
        name: "Ado E",
        area: "Ijoka / Orereowu"
    },
    {
        number: 6,
        name: "Ado F",
        area: "Okeyinmi"
    },
    {
        number: 7,
        name: "Ado G",
        area: "Oke Ila"
    },
    {
        number: 8,
        name: "Ado H",
        area: "Ereguru"
    },
    {
        number: 9,
        name: "Ado I",
        area: "Dallimore"
    },
    {
        number: 10,
        name: "Ado J",
        area: "Okesa"
    },
    {
        number: 11,
        name: "Ado K",
        area: "Irona"
    },
    {
        number: 12,
        name: "Ado L",
        area: "Igbehin"
    },
    {
        number: 13,
        name: "Ado M",
        area: "Farm Settlement"
    }
];


/* ============================================
   WARD EXCO POSITIONS
============================================ */

const wardExcoPositions = [
    "Ward Coordinator",
    "Deputy Ward Coordinator",
    "Secretary",
    "Mobilization Officer",
    "Women Empowerment Officer",
    "Media/Publicity Officer",
    "Welfare Officer",
    "Polling Unit Officer"
];


/* ============================================
   LG EXCO POSITIONS
============================================ */

const lgExcoPositions = [
    "LG Coordinator",
    "Deputy LG Coordinator"
];


/* ============================================
   GET ELEMENTS
============================================ */

const wardsGrid = document.getElementById("wardsGrid");
const wardDisplay = document.getElementById("wardDisplay");
const wardSelect = document.getElementById("ward");

const registrationForm =
    document.getElementById("registrationForm");

const formMessage =
    document.getElementById("formMessage");

const menuButton =
    document.getElementById("menuButton");

const mobileNav =
    document.getElementById("mobileNav");

const adminLoginButton =
    document.getElementById("adminLoginButton");


/* ============================================
   CREATE WARD BUTTONS
============================================ */

function createWardButtons() {

    if (!wardsGrid) return;

    wardsGrid.innerHTML = "";

    wards.forEach((ward) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "ward-button";

        button.dataset.ward = ward.number;

        button.innerHTML = `
            <strong>
                ${ward.name}
            </strong>

            <span>
                ${ward.area}
            </span>
        `;

        button.addEventListener(
            "click",
            () => showWard(ward.number)
        );

        wardsGrid.appendChild(button);

    });
}


/* ============================================
   CREATE WARD SELECT OPTIONS
============================================ */

function createWardOptions() {

    if (!wardSelect) return;

    wards.forEach((ward) => {

        const option =
            document.createElement("option");

        option.value = ward.number;

        option.textContent =
            `${ward.name} — ${ward.area}`;

        wardSelect.appendChild(option);

    });
}


/* ============================================
   SHOW WARD
============================================ */

function showWard(wardNumber) {

    const ward =
        wards.find(
            (item) => item.number === Number(wardNumber)
        );

    if (!ward || !wardDisplay) return;


    /* Remove active state */

    document
        .querySelectorAll(".ward-button")
        .forEach((button) => {

            button.classList.remove("active");

        });


    /* Activate selected ward */

    const selectedButton =
        document.querySelector(
            `.ward-button[data-ward="${ward.number}"]`
        );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }


    /* Create EXCO placeholders */

    const excoHTML =
        wardExcoPositions
            .map((position) => {

                return `
                    <div class="exco-row">

                        <span>
                            ${position}
                        </span>

                        <strong>
                            Not Assigned
                        </strong>

                    </div>
                `;

            })
            .join("");


    wardDisplay.innerHTML = `

        <div class="ward-header">

            <div>

                <span>
                    WARD ${ward.number}
                </span>

                <h3>
                    ${ward.name}
                </h3>

                <p>
                    ${ward.area}
                </p>

            </div>

            <div class="member-count">
                <strong>0</strong>
                <span>Members</span>
            </div>

        </div>


        <div class="ward-content">

            <div class="ward-exco">

                <h4>
                    Ward EXCO
                </h4>

                <div class="exco-list">

                    ${excoHTML}

                </div>

            </div>


            <div class="ward-members">

                <h4>
                    Registered Members
                </h4>

                <div class="members-empty">

                    <div>
                        👥
                    </div>

                    <h3>
                        No members yet
                    </h3>

                    <p>
                        Registered members for this ward
                        will appear here.
                    </p>

                </div>

            </div>

        </div>

    `;

    wardDisplay.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* ============================================
   MOBILE MENU
============================================ */

if (menuButton && mobileNav) {

    menuButton.addEventListener(
        "click",
        () => {

            mobileNav.classList.toggle("active");

        }
    );


    mobileNav
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    mobileNav.classList.remove("active");

                }
            );

        });

}


/* ============================================
   REGISTRATION FORM
============================================ */

if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const fullName =
                document
                    .getElementById("fullName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const gender =
                document
                    .getElementById("gender")
                    .value;


            const ward =
                document
                    .getElementById("ward")
                    .value;


            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            if (
                !fullName ||
                !phone ||
                !ward ||
                !address
            ) {

                showFormMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;

            }


            /*
                SUPABASE WILL BE CONNECTED HERE.

                The form will eventually send:

                full_name
                phone
                email
                gender
                ward
                address

                directly into the Supabase
                members table.
            */


            console.log({
                fullName,
                phone,
                email,
                gender,
                ward,
                address
            });


            showFormMessage(
                "Your registration form is working. Supabase connection will be added next.",
                "success"
            );

        }
    );

}


/* ============================================
   FORM MESSAGE
============================================ */

function showFormMessage(message, type) {

    if (!formMessage) return;

    formMessage.textContent = message;

    if (type === "success") {

        formMessage.style.color = "#087f3e";

    } else {

        formMessage.style.color = "#c62828";

    }

}


/* ============================================
   ADMIN BUTTON
============================================ */

if (adminLoginButton) {

    adminLoginButton.addEventListener(
        "click",
        () => {

            alert(
                "Supabase Admin Login will be connected here."
            );

        }
    );

}


/* ============================================
   START WEBSITE
============================================ */

createWardButtons();

createWardOptions();

console.log(
    "BWI-RHA Ado LG website loaded successfully."
);
```
