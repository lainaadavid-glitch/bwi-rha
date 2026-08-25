/* ============================================
   BWI-RHA EKITI STATE CHAPTER
   ADO LG
   SUPABASE CONNECTED VERSION
============================================ */


/* ============================================
   SUPABASE CONFIGURATION
============================================ */

const SUPABASE_URL =
    "https://xfjrmgendmmpnumsbjte.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_qBhmzkK4DDeZk1_pheHgRA_rNKHDKS7";


/* Create Supabase client */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ============================================
   ADO LG WARDS
============================================ */

const wards = [
    { number: 1, name: "Ado A", area: "Idofin" },
    { number: 2, name: "Ado B", area: "Inisa" },
    { number: 3, name: "Ado C", area: "Idolofin" },
    { number: 4, name: "Ado D", area: "Ijigbo" },
    { number: 5, name: "Ado E", area: "Ijoka / Orereowu" },
    { number: 6, name: "Ado F", area: "Okeyinmi" },
    { number: 7, name: "Ado G", area: "Oke Ila" },
    { number: 8, name: "Ado H", area: "Ereguru" },
    { number: 9, name: "Ado I", area: "Dallimore" },
    { number: 10, name: "Ado J", area: "Okesa" },
    { number: 11, name: "Ado K", area: "Irona" },
    { number: 12, name: "Ado L", area: "Igbehin" },
    { number: 13, name: "Ado M", area: "Farm Settlement" }
];


/* ============================================
   ELEMENTS
============================================ */

const wardsGrid =
    document.getElementById("wardsGrid");

const wardDisplay =
    document.getElementById("wardDisplay");

const wardSelect =
    document.getElementById("ward");

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

        const button =
            document.createElement("button");

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
   CREATE REGISTRATION WARD OPTIONS
============================================ */

function createWardOptions() {

    if (!wardSelect) return;

    wardSelect.innerHTML = `
        <option value="">
            Select your ward
        </option>
    `;

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
   LOAD MEMBERS FOR WARD
============================================ */

async function loadWardMembers(wardNumber) {

    const { data, error } =
        await supabaseClient
            .from("members")
            .select(`
                id,
                full_name,
                phone,
                email,
                gender,
                address
            `)
            .eq("ward_id", wardNumber)
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(
            "Member loading error:",
            error
        );

        return [];

    }

    return data || [];
}


/* ============================================
   LOAD WARD EXCO
============================================ */

async function loadWardExco(wardNumber) {

    const { data, error } =
        await supabaseClient
            .from("ward_exco")
            .select(`
                id,
                position,
                member_id,
                members (
                    id,
                    full_name
                )
            `)
            .eq("ward_id", wardNumber)
            .order("id");


    if (error) {

        console.error(
            "EXCO loading error:",
            error
        );

        return [];

    }

    return data || [];
}


/* ============================================
   SHOW WARD
============================================ */

async function showWard(wardNumber) {

    const ward =
        wards.find(
            item =>
                item.number === Number(wardNumber)
        );

    if (!ward || !wardDisplay) return;


    /* Active button */

    document
        .querySelectorAll(".ward-button")
        .forEach(button => {

            button.classList.remove("active");

        });


    const selectedButton =
        document.querySelector(
            `.ward-button[data-ward="${ward.number}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add("active");

    }


    /* Loading */

    wardDisplay.innerHTML = `

        <div class="empty-ward">

            <div class="empty-icon">
                ⏳
            </div>

            <h3>
                Loading ${ward.name}...
            </h3>

            <p>
                Getting members and EXCO information.
            </p>

        </div>

    `;


    /* Load database */

    const [
        members,
        exco
    ] = await Promise.all([

        loadWardMembers(ward.number),

        loadWardExco(ward.number)

    ]);


    /* EXCO */

    const excoHTML =
        exco.map(item => {

            const person =
                item.members?.full_name;

            return `

                <div class="exco-row">

                    <span>
                        ${escapeHTML(item.position)}
                    </span>

                    <strong>
                        ${
                            person
                                ? escapeHTML(person)
                                : "Not Assigned"
                        }
                    </strong>

                </div>

            `;

        }).join("");


    /* Members */

    let membersHTML = "";


    if (members.length === 0) {

        membersHTML = `

            <div class="members-empty">

                <div>
                    👥
                </div>

                <h3>
                    No members yet
                </h3>

                <p>
                    No registered members have been
                    assigned to this ward yet.
                </p>

            </div>

        `;

    } else {

        membersHTML =
            members.map(member => {

                return `

                    <div class="member-card">

                        <div class="member-avatar">
                            ${getInitials(member.full_name)}
                        </div>

                        <div class="member-info">

                            <h3>
                                ${escapeHTML(member.full_name)}
                            </h3>

                            <p>
                                ${escapeHTML(member.phone)}
                            </p>

                            ${
                                member.email
                                    ? `<p>${escapeHTML(member.email)}</p>`
                                    : ""
                            }

                        </div>

                    </div>

                `;

            }).join("");

    }


    /* Final ward page */

    wardDisplay.innerHTML = `

        <div class="ward-header">

            <div>

                <span>
                    WARD ${ward.number}
                </span>

                <h3>
                    ${escapeHTML(ward.name)}
                </h3>

                <p>
                    ${escapeHTML(ward.area)}
                </p>

            </div>

            <div class="member-count">

                <strong>
                    ${members.length}
                </strong>

                <span>
                    Members
                </span>

            </div>

        </div>


        <div class="ward-content">

            <div class="ward-exco">

                <h4>
                    Ward EXCO
                </h4>

                <div class="exco-list">

                    ${
                        excoHTML ||
                        "<p>No EXCO records found.</p>"
                    }

                </div>

            </div>


            <div class="ward-members">

                <h4>
                    Registered Members
                </h4>

                <div class="members-list">

                    ${membersHTML}

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
   MEMBER REGISTRATION
============================================ */

if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const submitButton =
                registrationForm.querySelector(
                    ".submit-button"
                );


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


            /* Disable button */

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Submitting...";

            }


            /* Insert into Supabase */

            const { error } =
                await supabaseClient
                    .from("members")
                    .insert({

                        full_name: fullName,

                        phone: phone,

                        email:
                            email || null,

                        gender:
                            gender || null,

                        address: address,

                        ward_id:
                            Number(ward)

                    });


            if (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showFormMessage(
                    "Registration failed: " +
                    error.message,
                    "error"
                );


            } else {

                showFormMessage(
                    "Registration successful! Welcome to BWI-RHA Ado LG.",
                    "success"
                );


                registrationForm.reset();

                createWardOptions();

            }


            /* Enable button */

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Submit Registration";

            }

        }
    );

}


/* ============================================
   FORM MESSAGE
============================================ */

function showFormMessage(
    message,
    type
) {

    if (!formMessage) return;

    formMessage.textContent =
        message;

    formMessage.style.color =
        type === "success"
            ? "#087f3e"
            : "#c62828";

}


/* ============================================
   MOBILE MENU
============================================ */

if (menuButton && mobileNav) {

    menuButton.addEventListener(
        "click",
        () => {

            mobileNav.classList.toggle(
                "active"
            );

        }
    );


    mobileNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mobileNav.classList.remove(
                        "active"
                    );

                }
            );

        });

}


/* ============================================
   ADMIN BUTTON
============================================ */

if (adminLoginButton) {

    adminLoginButton.addEventListener(
        "click",
        () => {

            alert(
                "Admin Login will be connected to Supabase Auth next."
            );

        }
    );

}


/* ============================================
   SECURITY / DISPLAY HELPERS
============================================ */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getInitials(name) {

    if (!name) return "?";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();

}


/* ============================================
   START
============================================ */

createWardButtons();

createWardOptions();

console.log(
    "BWI-RHA Ado LG + Supabase loaded."
);
