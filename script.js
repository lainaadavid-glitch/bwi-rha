/* =========================================================
   BWI-RHA EKITI STATE CHAPTER
   ADO LOCAL GOVERNMENT
   SUPABASE WEBSITE SYSTEM
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://xfjrmgendmmpnumsbjte.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_qBhmzkK4DDeZk1_pheHgRA_rNKHDKS7";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   WARDS
========================================================= */

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


/* =========================================================
   WARD OFFICES
========================================================= */

const wardOffices = [
    "Ward Coordinator",
    "Deputy Ward Coordinator",
    "Secretary",
    "Mobilization Officer",
    "Women Empowerment Officer",
    "Media/Publicity Officer",
    "Welfare Officer",
    "Polling Unit Officer"
];


/* =========================================================
   LG EXCO
========================================================= */

const lgOffices = [
    "LG Coordinator",
    "Deputy LG Coordinator"
];


/* =========================================================
   DOM ELEMENTS
========================================================= */

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

const lgExco =
    document.getElementById("lgExco");


/* =========================================================
   CREATE WARD BUTTONS
========================================================= */

function createWardButtons() {

    if (!wardsGrid) return;

    wardsGrid.innerHTML = "";

    wards.forEach(ward => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "ward-button";

        button.dataset.ward =
            ward.number;

        button.innerHTML = `
            <strong>
                ${escapeHTML(ward.name)}
            </strong>

            <span>
                ${escapeHTML(ward.area)}
            </span>
        `;

        button.addEventListener(
            "click",
            () => showWard(ward.number)
        );

        wardsGrid.appendChild(button);

    });
}


/* =========================================================
   CREATE WARD SELECT OPTIONS
========================================================= */

function createWardOptions() {

    if (!wardSelect) return;

    wardSelect.innerHTML = `
        <option value="">
            Select your ward
        </option>
    `;

    wards.forEach(ward => {

        const option =
            document.createElement("option");

        option.value =
            ward.number;

        option.textContent =
            `${ward.name} — ${ward.area}`;

        wardSelect.appendChild(option);

    });
}


/* =========================================================
   MEMBER REGISTRATION
========================================================= */

if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async event => {

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

            const bankName =
                document
                    .getElementById("bankName")
                    .value
                    .trim();

            const accountNumber =
                document
                    .getElementById("accountNumber")
                    .value
                    .trim();

            const ward =
                document
                    .getElementById("ward")
                    .value;

            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            /* VALIDATION */

            if (
                !fullName ||
                !phone ||
                !bankName ||
                !accountNumber ||
                !ward ||
                !address
            ) {

                showMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            if (!/^\d{10}$/.test(accountNumber)) {

                showMessage(
                    "Account number must contain exactly 10 digits.",
                    "error"
                );

                return;
            }


            /* BUTTON */

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";
            }


            try {

                const { error } =
                    await supabaseClient
                        .from("members")
                        .insert({
                            full_name: fullName,
                            phone: phone,
                            bank_name: bankName,
                            account_number: accountNumber,
                            ward_id: Number(ward),
                            address: address,
                            status: "pending"
                        });


                if (error) {

                    console.error(
                        "Registration error:",
                        error
                    );

                    showMessage(
                        "Registration failed: " +
                        error.message,
                        "error"
                    );

                    return;
                }


                showMessage(
                    "Registration submitted successfully. Your application is awaiting admin approval.",
                    "success"
                );


                registrationForm.reset();

                createWardOptions();

            }

            catch (error) {

                console.error(error);

                showMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Registration";
                }
            }
        }
    );
}


/* =========================================================
   SHOW WARD
========================================================= */

async function showWard(wardNumber) {

    const ward =
        wards.find(
            item =>
                item.number ===
                Number(wardNumber)
        );

    if (!ward || !wardDisplay) {
        return;
    }


    /* ACTIVE BUTTON */

    document
        .querySelectorAll(".ward-button")
        .forEach(button => {

            button.classList.remove("active");

        });


    const activeButton =
        document.querySelector(
            `.ward-button[data-ward="${ward.number}"]`
        );


    if (activeButton) {

        activeButton.classList.add(
            "active"
        );
    }


    /* LOADING */

    wardDisplay.innerHTML = `

        <div class="empty-ward">

            <div class="empty-icon">
                ⏳
            </div>

            <h3>
                Loading ${escapeHTML(
                    ward.name
                )}...
            </h3>

            <p>
                Loading ward information.
            </p>

        </div>
    `;


    /* GET APPROVED MEMBERS */

    const {
        data: members,
        error
    } =
        await supabaseClient
            .from("members")
            .select(`
                id,
                full_name,
                phone
            `)
            .eq(
                "ward_id",
                ward.number
            )
            .eq(
                "status",
                "approved"
            )
            .order(
                "full_name",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Ward members error:",
            error
        );

        wardDisplay.innerHTML = `

            <div class="empty-ward">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load members
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>
        `;

        return;
    }


    /* MEMBER HTML */

    let membersHTML = "";


    if (!members || members.length === 0) {

        membersHTML = `

            <div class="members-empty">

                <div class="empty-icon">
                    👥
                </div>

                <h3>
                    No approved members yet
                </h3>

                <p>
                    Approved members will appear
                    here.
                </p>

            </div>
        `;

    } else {

        membersHTML =
            members
                .map(member => {

                    return `

                        <div class="member-card">

                            <div class="member-avatar">

                                ${getInitials(
                                    member.full_name
                                )}

                            </div>

                            <div class="member-info">

                                <h3>
                                    ${escapeHTML(
                                        member.full_name
                                    )}
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        member.phone
                                    )}
                                </p>

                            </div>

                        </div>
                    `;

                })
                .join("");
    }


    /* WARD OFFICES */

    const officesHTML =
        wardOffices
            .map(position => {

                return `

                    <div class="office-card">

                        <div class="office-icon">
                            🏢
                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    position
                                )}
                            </strong>

                            <p>
                                Not yet assigned
                            </p>

                        </div>

                    </div>
                `;

            })
            .join("");


    /* DISPLAY */

    wardDisplay.innerHTML = `

        <div class="ward-header">

            <div>

                <span>
                    WARD ${ward.number}
                </span>

                <h3>
                    ${escapeHTML(
                        ward.name
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        ward.area
                    )}
                </p>

            </div>


            <div class="member-count">

                <strong>
                    ${members.length}
                </strong>

                <span>
                    Approved Members
                </span>

            </div>

        </div>


        <div class="ward-content">

            <section>

                <h4>
                    Ward Executive Offices
                </h4>

                <div class="offices-list">

                    ${officesHTML}

                </div>

            </section>


            <section>

                <h4>
                    Approved Members
                </h4>

                <div class="members-list">

                    ${membersHTML}

                </div>

            </section>

        </div>
    `;
}


/* =========================================================
   LG EXCO
========================================================= */

async function loadLGExco() {

    if (!lgExco) return;


    /*
       We currently display the two LG offices.

       Names can later be managed from the
       Supabase admin dashboard.
    */

    lgExco.innerHTML =
        lgOffices
            .map(position => {

                return `

                    <div class="exco-card">

                        <div class="exco-icon">
                            👑
                        </div>

                        <div class="position">

                            ${escapeHTML(
                                position
                            )}

                        </div>

                        <h3>
                            Not yet assigned
                        </h3>

                    </div>
                `;

            })
            .join("");
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type
) {

    if (!formMessage) return;

    formMessage.textContent =
        message;

    formMessage.className =
        "form-message " +
        type;
}


/* =========================================================
   MOBILE MENU
========================================================= */

if (
    menuButton &&
    mobileNav
) {

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


/* =========================================================
   CURRENT YEAR
========================================================= */

const currentYear =
    document.getElementById(
        "currentYear"
    );

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();
}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function getInitials(name) {

    if (!name) {
        return "?";
    }

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            word =>
                word.charAt(0)
        )
        .join("")
        .toUpperCase();
}


/* =========================================================
   START WEBSITE
========================================================= */

createWardButtons();

createWardOptions();

loadLGExco();


console.log(
    "BWI-RHA Ado LG website loaded successfully."
);
