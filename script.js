/* =========================================================
   BWI-RHA EKITI STATE CHAPTER
   ADO LG

   COMPLETE SUPABASE WEBSITE SCRIPT
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://xfjrmgendmmpnumsbjte.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_qBhmzkK4DDezK1_pheHgRA_rNKHDKS7";


let supabaseClient = null;


if (window.supabase) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

} else {

    console.error(
        "Supabase library was not loaded."
    );

}


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
   EXCO POSITIONS
========================================================= */

const EXCO_POSITIONS = [

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
   DOM ELEMENTS
========================================================= */

const registrationForm =
    document.getElementById(
        "registrationForm"
    );

const formMessage =
    document.getElementById(
        "formMessage"
    );

const wardsGrid =
    document.getElementById(
        "wardsGrid"
    );

const wardDisplay =
    document.getElementById(
        "wardDisplay"
    );

const wardSelect =
    document.getElementById(
        "ward"
    );

const lgExco =
    document.getElementById(
        "lgExco"
    );


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   INITIALS
========================================================= */

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
   MESSAGE
========================================================= */

function showMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        "form-message " +
        type;

}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
    document.getElementById(
        "menuButton"
    );

const mobileNav =
    document.getElementById(
        "mobileNav"
    );

const navMenu =
    document.getElementById(
        "navMenu"
    );


if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            if (mobileNav) {

                mobileNav.classList.toggle(
                    "active"
                );

            }

            if (navMenu) {

                navMenu.classList.toggle(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   CREATE WARD BUTTONS
========================================================= */

function createWardButtons() {

    if (!wardsGrid) {
        return;
    }

    wardsGrid.innerHTML = "";


    wards.forEach(ward => {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "ward-button";


        button.dataset.ward =
            ward.number;


        button.innerHTML = `

            <strong>
                ${escapeHTML(
                    ward.name
                )}
            </strong>

            <span>
                Ward ${ward.number}
            </span>

            <small>
                ${escapeHTML(
                    ward.area
                )}
            </small>

        `;


        button.addEventListener(
            "click",
            () =>
                showWard(
                    ward.number
                )
        );


        wardsGrid.appendChild(
            button
        );

    });

}


/* =========================================================
   CREATE WARD OPTIONS
========================================================= */

function createWardOptions() {

    if (!wardSelect) {
        return;
    }


    wardSelect.innerHTML = `

        <option value="">
            Select your ward
        </option>

    `;


    wards.forEach(ward => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            ward.number;


        option.textContent =
            `Ward ${ward.number} — ${ward.name} — ${ward.area}`;


        wardSelect.appendChild(
            option
        );

    });

}


/* =========================================================
   REGISTRATION
========================================================= */

if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        submitRegistration
    );

}


async function submitRegistration(event) {

    event.preventDefault();


    if (!supabaseClient) {

        showMessage(
            formMessage,
            "Supabase is not available. Refresh the page.",
            "error"
        );

        return;
    }


    const submitButton =
        registrationForm.querySelector(
            "button[type='submit']"
        );


    const fullName =
        document
            .getElementById("fullName")
            ?.value
            .trim();


    const phone =
        document
            .getElementById("phone")
            ?.value
            .trim();


    const ward =
        document
            .getElementById("ward")
            ?.value;


    const pollingBooth =
        document
            .getElementById("pollingBooth")
            ?.value
            .trim();


    const accountName =
        document
            .getElementById("accountName")
            ?.value
            .trim();


    const accountNumber =
        document
            .getElementById("accountNumber")
            ?.value
            .trim();


    const bankName =
        document
            .getElementById("bankName")
            ?.value
            .trim();


    if (
        !fullName ||
        !phone ||
        !ward ||
        !pollingBooth ||
        !accountName ||
        !accountNumber ||
        !bankName
    ) {

        showMessage(
            formMessage,
            "Please complete all required fields.",
            "error"
        );

        return;
    }


    if (
        !/^\d{10}$/.test(
            accountNumber
        )
    ) {

        showMessage(
            formMessage,
            "Account number must contain exactly 10 digits.",
            "error"
        );

        return;
    }


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

                    full_name:
                        fullName,

                    phone:
                        phone,

                    ward_id:
                        Number(ward),

                    polling_booth:
                        pollingBooth,

                    account_name:
                        accountName,

                    account_number:
                        accountNumber,

                    bank_name:
                        bankName,

                    status:
                        "pending"

                });


        if (error) {
            throw error;
        }


        showMessage(
            formMessage,
            "Registration submitted successfully. Your application is awaiting admin approval.",
            "success"
        );


        registrationForm.reset();

        createWardOptions();


    } catch (error) {

        console.error(
            "REGISTRATION ERROR:",
            error
        );


        showMessage(
            formMessage,
            "Registration failed: " +
            error.message,
            "error"
        );

    }


    if (submitButton) {

        submitButton.disabled =
            false;

        submitButton.textContent =
            "Submit Registration";

    }

}


/* =========================================================
   WARD DISPLAY
========================================================= */

async function showWard(wardNumber) {

    if (!wardDisplay) {
        return;
    }


    const ward =
        wards.find(
            item =>
                item.number ===
                Number(wardNumber)
        );


    if (!ward) {
        return;
    }


    document
        .querySelectorAll(
            ".ward-button"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

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

        </div>

    `;


    try {

        const {
            data: members,
            error
        } =
            await supabaseClient
                .from("members")
                .select(
                    "id,full_name,phone,exco_position"
                )
                .eq(
                    "ward_id",
                    ward.number
                )
                .eq(
                    "status",
                    "accepted"
                )
                .order(
                    "full_name",
                    {
                        ascending: true
                    }
                );


        if (error) {
            throw error;
        }


        const memberList =
            members || [];


        let membersHTML = "";


        if (
            memberList.length === 0
        ) {

            membersHTML = `

                <div class="members-empty">

                    <div class="empty-icon">
                        👥
                    </div>

                    <h3>
                        No approved members yet
                    </h3>

                </div>

            `;

        } else {

            membersHTML =
                memberList
                    .map(member => `

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

                                ${
                                    member.exco_position
                                    ?
                                    `
                                    <strong>
                                        ${escapeHTML(
                                            member.exco_position
                                        )}
                                    </strong>
                                    `
                                    :
                                    ""
                                }

                            </div>

                        </div>

                    `)
                    .join("");

        }


        const officesHTML =
            EXCO_POSITIONS
                .map(position => {

                    const officer =
                        memberList.find(
                            member =>
                                member.exco_position ===
                                position
                        );


                    return `

                        <div class="office-card">

                            <div class="office-icon">
                                👤
                            </div>

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        position
                                    )}
                                </strong>

                                <p>
                                    ${
                                        officer
                                        ?
                                        escapeHTML(
                                            officer.full_name
                                        )
                                        :
                                        "Not yet assigned"
                                    }
                                </p>

                            </div>

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
                        ${memberList.length}
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

    } catch (error) {

        console.error(
            "WARD ERROR:",
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

    }

}


/* =========================================================
   ADMIN ELEMENTS
========================================================= */

const adminLogin =
    document.getElementById(
        "adminLogin"
    );

const adminDashboard =
    document.getElementById(
        "adminDashboard"
    );

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const refreshPendingBtn =
    document.getElementById(
        "refreshPendingBtn"
    );

const saveExcoBtn =
    document.getElementById(
        "saveExcoBtn"
    );


/* =========================================================
   ADMIN LOGIN
========================================================= */

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        adminLoginSubmit
    );

}


async function adminLoginSubmit(event) {

    event.preventDefault();


    const message =
        document.getElementById(
            "adminLoginMessage"
        );


    const button =
        document.getElementById(
            "loginBtn"
        );


    const email =
        document
            .getElementById(
                "adminEmail"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "adminPassword"
            )
            .value;


    if (!email || !password) {

        showMessage(
            message,
            "Enter your email and password.",
            "error"
        );

        return;
    }


    if (!supabaseClient) {

        showMessage(
            message,
            "Supabase library is not loaded.",
            "error"
        );

        return;
    }


    button.disabled =
        true;

    button.textContent =
        "Logging in...";


    showMessage(
        message,
        "Connecting to Supabase...",
        "info"
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        password

                });


        if (error) {
            throw error;
        }


        if (!data.user) {

            throw new Error(
                "No user returned by Supabase."
            );

        }


        showMessage(
            message,
            "Login successful.",
            "success"
        );


        await openAdminDashboard(
            data.user
        );


    } catch (error) {

        console.error(
            "ADMIN LOGIN ERROR:",
            error
        );


        showMessage(
            message,
            "Login failed: " +
            error.message,
            "error"
        );

    }


    button.disabled =
        false;

    button.textContent =
        "Login";

}


/* =========================================================
   OPEN ADMIN DASHBOARD
========================================================= */

async function openAdminDashboard(user) {

    if (
        !adminLogin ||
        !adminDashboard
    ) {
        return;
    }


    adminLogin.style.display =
        "none";


    adminDashboard.style.display =
        "block";


    const emailElement =
        document.getElementById(
            "adminUserEmail"
        );


    if (emailElement) {

        emailElement.textContent =
            user?.email || "";

    }


    await loadAdminDashboard();

}


/* =========================================================
   CHECK SESSION
========================================================= */

async function checkAdminSession() {

    if (
        !adminLogin ||
        !adminDashboard ||
        !supabaseClient
    ) {
        return;
    }


    try {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getUser();


        if (data.user) {

            await openAdminDashboard(
                data.user
            );

        } else {

            adminLogin.style.display =
                "block";

            adminDashboard.style.display =
                "none";

        }

    } catch (error) {

        console.error(
            "SESSION ERROR:",
            error
        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await supabaseClient
                    .auth
                    .signOut();

            } catch (error) {

                console.error(
                    error
                );

            }


            if (adminDashboard) {

                adminDashboard.style.display =
                    "none";

            }


            if (adminLogin) {

                adminLogin.style.display =
                    "block";

            }

        }
    );

}


/* =========================================================
   LOAD ADMIN DASHBOARD
========================================================= */

async function loadAdminDashboard() {

    await loadStatistics();

    await loadPendingMembers();

    await loadAcceptedMembers();

    await loadMembersByWard();

    await loadExcoManager();

}


/* =========================================================
   STATISTICS
========================================================= */

async function loadStatistics() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("members")
            .select(
                "id,status"
            );


    if (error) {
        throw error;
    }


    const members =
        data || [];


    const pending =
        members.filter(
            member =>
                member.status ===
                "pending"
        ).length;


    const accepted =
        members.filter(
            member =>
                member.status ===
                "accepted"
        ).length;


    const declined =
        members.filter(
            member =>
                member.status ===
                "declined"
        ).length;


    setText(
        "pendingCount",
        pending
    );


    setText(
        "acceptedCount",
        accepted
    );


    setText(
        "declinedCount",
        declined
    );

}


/* =========================================================
   PENDING MEMBERS
========================================================= */

async function loadPendingMembers() {

    const container =
        document.getElementById(
            "pendingList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading">
            Loading registrations...
        </div>
    `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("members")
                .select("*")
                .eq(
                    "status",
                    "pending"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {
            throw error;
        }


        const members =
            data || [];


        if (
            members.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">
                    No pending registrations.
                </div>
            `;

            return;

        }


        container.innerHTML =
            "";


        members.forEach(member => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "registration-item";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(
                        member.full_name
                    )}
                </h3>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHTML(
                        member.phone
                    )}
                </p>

                <p>
                    <strong>Ward:</strong>
                    Ward ${escapeHTML(
                        member.ward_id
                    )}
                </p>

                <p>
                    <strong>Polling Booth:</strong>
                    ${escapeHTML(
                        member.polling_booth
                    )}
                </p>

                <p>
                    <strong>Account Name:</strong>
                    ${escapeHTML(
                        member.account_name
                    )}
                </p>

                <p>
                    <strong>Account Number:</strong>
                    ${escapeHTML(
                        member.account_number
                    )}
                </p>

                <p>
                    <strong>Bank:</strong>
                    ${escapeHTML(
                        member.bank_name
                    )}
                </p>


                <div class="registration-actions">

                    <button
                        type="button"
                        class="small-btn accept-btn"
                    >
                        ✓ Approve
                    </button>


                    <button
                        type="button"
                        class="small-btn decline-btn"
                    >
                        ✕ Decline
                    </button>

                </div>

            `;


            card
                .querySelector(
                    ".accept-btn"
                )
                .addEventListener(
                    "click",
                    () =>
                        updateMemberStatus(
                            member.id,
                            "accepted"
                        )
                );


            card
                .querySelector(
                    ".decline-btn"
                )
                .addEventListener(
                    "click",
                    () =>
                        updateMemberStatus(
                            member.id,
                            "declined"
                        )
                );


            container.appendChild(
                card
            );

        });


    } catch (error) {

        console.error(
            "PENDING ERROR:",
            error
        );


        container.innerHTML = `
            <div class="empty-state error">
                ${escapeHTML(
                    error.message
                )}
            </div>
        `;

    }

}


/* =========================================================
   APPROVE / DECLINE
========================================================= */

async function updateMemberStatus(
    memberId,
    status
) {

    const action =
        status === "accepted"
            ? "approve"
            : "decline";


    if (
        !confirm(
            `Are you sure you want to ${action} this registration?`
        )
    ) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("members")
                .update({

                    status:
                        status,

                    reviewed_at:
                        new Date()
                            .toISOString()

                })
                .eq(
                    "id",
                    memberId
                );


        if (error) {
            throw error;
        }


        alert(
            `Registration ${action}d successfully.`
        );


        await loadAdminDashboard();


    } catch (error) {

        console.error(
            "STATUS ERROR:",
            error
        );


        alert(
            "Unable to update registration: " +
            error.message
        );

    }

}


/* =========================================================
   APPROVED MEMBERS
========================================================= */

async function loadAcceptedMembers() {

    const container =
        document.getElementById(
            "acceptedList"
        );


    if (!container) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("members")
                .select("*")
                .eq(
                    "status",
                    "accepted"
                )
                .order(
                    "full_name",
                    {
                        ascending: true
                    }
                );


        if (error) {
            throw error;
        }


        const members =
            data || [];


        if (
            members.length === 0
        ) {

            container.innerHTML = `
                <div class="empty-state">
                    No approved members yet.
                </div>
            `;

            return;

        }


        let html = `

            <div class="member-table-wrapper">

                <table class="member-table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Phone</th>

                            <th>Ward</th>

                            <th>Polling Booth</th>

                            <th>Bank</th>

                            <th>EXCO</th>

                        </tr>

                    </thead>

                    <tbody>

        `;


        members.forEach(member => {

            html += `

                <tr>

                    <td>
                        ${escapeHTML(
                            member.full_name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            member.phone
                        )}
                    </td>

                    <td>
                        Ward ${escapeHTML(
                            member.ward_id
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            member.polling_booth
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            member.bank_name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            member.exco_position ||
                            "Not assigned"
                        )}
                    </td>

                </tr>

            `;

        });


        html += `

                    </tbody>

                </table>

            </div>

        `;


        container.innerHTML =
            html;


    } catch (error) {

        container.innerHTML = `
            <div class="empty-state error">
                ${escapeHTML(
                    error.message
                )}
            </div>
        `;

    }

}


/* =========================================================
   MEMBERS BY WARD
========================================================= */

async function loadMembersByWard() {

    const container =
        document.getElementById(
            "wardMembers"
        );


    if (!container) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("members")
                .select(
                    "id,full_name,phone,ward_id,polling_booth,exco_position"
                )
                .eq(
                    "status",
                    "accepted"
                )
                .order(
                    "ward_id",
                    {
                        ascending: true
                    }
                )
                .order(
                    "full_name",
                    {
                        ascending: true
                    }
                );


        if (error) {
            throw error;
        }


        const members =
            data || [];


        container.innerHTML =
            "";


        wards.forEach(ward => {

            const wardMembers =
                members.filter(
                    member =>
                        Number(
                            member.ward_id
                        ) ===
                        ward.number
                );


            const section =
                document.createElement(
                    "div"
                );


            section.className =
                "ward-admin-section";


            let rows = "";


            wardMembers.forEach(member => {

                rows += `

                    <tr>

                        <td>
                            ${escapeHTML(
                                member.full_name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.phone
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.polling_booth
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.exco_position ||
                                "—"
                            )}
                        </td>

                    </tr>

                `;

            });


            section.innerHTML = `

                <h3>
                    Ward ${ward.number} —
                    ${escapeHTML(
                        ward.name
                    )}
                    (${wardMembers.length})
                </h3>


                ${
                    wardMembers.length === 0

                    ?

                    `
                    <p class="empty-state">
                        No approved members.
                    </p>
                    `

                    :

                    `

                    <div class="member-table-wrapper">

                        <table class="member-table">

                            <thead>

                                <tr>

                                    <th>Name</th>

                                    <th>Phone</th>

                                    <th>Polling Booth</th>

                                    <th>EXCO</th>

                                </tr>

                            </thead>

                            <tbody>

                                ${rows}

                            </tbody>

                        </table>

                    </div>

                    `
                }

            `;


            container.appendChild(
                section
            );

        });


    } catch (error) {

        console.error(
            "WARD ADMIN ERROR:",
            error
        );


        container.innerHTML = `
            <div class="empty-state error">
                ${escapeHTML(
                    error.message
                )}
            </div>
        `;

    }

}


/* =========================================================
   EXCO MANAGER
========================================================= */

async function loadExcoManager() {

    const container =
        document.getElementById(
            "excoManager"
        );


    if (!container) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("members")
                .select(
                    "id,full_name,ward_id,exco_position"
                )
                .eq(
                    "status",
                    "accepted"
                )
                .order(
                    "full_name",
                    {
                        ascending: true
                    }
                );


        if (error) {
            throw error;
        }


        const members =
            data || [];


        container.innerHTML =
            "";


        EXCO_POSITIONS.forEach(position => {

            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "exco-position";


            const label =
                document.createElement(
                    "label"
                );


            label.textContent =
                position;


            const select =
                document.createElement(
                    "select"
                );


            select.dataset.position =
                position;


            const empty =
                document.createElement(
                    "option"
                );


            empty.value =
                "";


            empty.textContent =
                "Select member";


            select.appendChild(
                empty
            );


            members.forEach(member => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    member.id;


                option.textContent =
                    `${member.full_name} — Ward ${member.ward_id}`;


                if (
                    member.exco_position ===
                    position
                ) {

                    option.selected =
                        true;

                }


                select.appendChild(
                    option
                );

            });


            wrapper.appendChild(
                label
            );


            wrapper.appendChild(
                select
            );


            container.appendChild(
                wrapper
            );

        });


    } catch (error) {

        console.error(
            "EXCO LOAD ERROR:",
            error
        );


        container.innerHTML = `
            <div class="empty-state error">
                ${escapeHTML(
                    error.message
                )}
            </div>
        `;

    }

}


/* =========================================================
   SAVE EXCO
========================================================= */

if (saveExcoBtn) {

    saveExcoBtn.addEventListener(
        "click",
        saveExcoPositions
    );

}


async function saveExcoPositions() {

    const message =
        document.getElementById(
            "excoMessage"
        );


    saveExcoBtn.disabled =
        true;


    saveExcoBtn.textContent =
        "Saving...";


    try {

        const {
            data: members,
            error
        } =
            await supabaseClient
                .from("members")
                .select(
                    "id,exco_position"
                )
                .eq(
                    "status",
                    "accepted"
                );


        if (error) {
            throw error;
        }


        /*
           Clear all existing EXCO positions.
        */

        if (members.length > 0) {

            const {
                error:
                    clearError
            } =
                await supabaseClient
                    .from("members")
                    .update({
                        exco_position: null
                    })
                    .eq(
                        "status",
                        "accepted"
                    );


            if (clearError) {
                throw clearError;
            }

        }


        const selects =
            document.querySelectorAll(
                "#excoManager select"
            );


        const selectedMembers =
            new Set();


        for (
            const select of selects
        ) {

            const memberId =
                select.value;


            const position =
                select.dataset.position;


            if (!memberId) {
                continue;
            }


            if (
                selectedMembers.has(
                    memberId
                )
            ) {

                throw new Error(
                    "A member cannot hold more than one EXCO position."
                );

            }


            selectedMembers.add(
                memberId
            );


            const {
                error:
                    updateError
            } =
                await supabaseClient
                    .from("members")
                    .update({

                        exco_position:
                            position

                    })
                    .eq(
                        "id",
                        memberId
                    );


            if (updateError) {
                throw updateError;
            }

        }


        showMessage(
            message,
            "EXCO positions saved successfully.",
            "success"
        );


        await loadAcceptedMembers();

        await loadMembersByWard();

        await loadExcoManager();


    } catch (error) {

        console.error(
            "EXCO ERROR:",
            error
        );


        showMessage(
            message,
            "Unable to save EXCO: " +
            error.message,
            "error"
        );

    }


    saveExcoBtn.disabled =
        false;


    saveExcoBtn.textContent =
        "Save EXCO Positions";

}


/* =========================================================
   REFRESH
========================================================= */

if (refreshPendingBtn) {

    refreshPendingBtn.addEventListener(
        "click",
        loadAdminDashboard
    );

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   LG EXCO
========================================================= */

function loadLGExco() {

    if (!lgExco) {
        return;
    }


    lgExco.innerHTML = `

        <div class="exco-card">

            <div class="exco-icon">
                🏢
            </div>

            <div class="position">
                LG Coordinator
            </div>

            <h3>
                Not yet assigned
            </h3>

        </div>


        <div class="exco-card">

            <div class="exco-icon">
                🏢
            </div>

            <div class="position">
                Deputy LG Coordinator
            </div>

            <h3>
                Not yet assigned
            </h3>

        </div>

    `;

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
   START
========================================================= */

createWardButtons();

createWardOptions();

loadLGExco();

checkAdminSession();


console.log(
    "BWI-RHA Ado LG website loaded successfully."
);
