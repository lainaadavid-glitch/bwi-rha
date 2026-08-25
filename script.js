/* =========================================================
   BWI-RHA EKITI STATE CHAPTER
   ADO LG
   COMPLETE WEBSITE SCRIPT
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://xfjrmgendmmpnumsbjte.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_qBhmzkK4DDeZk1_pheHgRA_rNKHDKS7";


/* =========================================================
   WARDS
========================================================= */

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
   AUTH STORAGE
========================================================= */

function getAccessToken() {
    return localStorage.getItem(
        "bwi_rha_access_token"
    );
}


function getRefreshToken() {
    return localStorage.getItem(
        "bwi_rha_refresh_token"
    );
}


function saveSession(data) {

    if (data.access_token) {
        localStorage.setItem(
            "bwi_rha_access_token",
            data.access_token
        );
    }

    if (data.refresh_token) {
        localStorage.setItem(
            "bwi_rha_refresh_token",
            data.refresh_token
        );
    }
}


function clearSession() {

    localStorage.removeItem(
        "bwi_rha_access_token"
    );

    localStorage.removeItem(
        "bwi_rha_refresh_token"
    );
}


/* =========================================================
   HTML SECURITY
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
   SUPABASE REST
========================================================= */

async function supabaseRequest(
    endpoint,
    options = {},
    useUserToken = true
) {

    const headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    };


    const token =
        useUserToken
            ? getAccessToken()
            : null;


    headers["Authorization"] =
        `Bearer ${
            token || SUPABASE_KEY
        }`;


    if (options.headers) {

        Object.assign(
            headers,
            options.headers
        );

    }


    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${endpoint}`,
            {
                ...options,
                headers
            }
        );


    const text =
        await response.text();


    let data = null;


    if (text) {

        try {
            data = JSON.parse(text);
        }

        catch {
            data = text;
        }

    }


    if (!response.ok) {

        console.error(
            "SUPABASE ERROR:",
            response.status,
            data
        );


        let message =
            `Supabase error ${response.status}`;


        if (
            data &&
            typeof data === "object"
        ) {

            message =
                data.message ||
                data.msg ||
                data.error_description ||
                data.details ||
                data.hint ||
                message;

        }


        throw new Error(message);

    }


    return data;
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    element,
    message,
    type
) {

    if (!element) return;

    element.textContent =
        message;

    element.className =
        `form-message ${type}`;

}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );


const navMenu =
    document.getElementById(
        "navMenu"
    );


if (
    menuBtn &&
    navMenu
) {

    menuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   WARDS PAGE
========================================================= */

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


function createWardButtons() {

    if (!wardsGrid) return;


    wardsGrid.innerHTML = "";


    wards.forEach(
        ward => {

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
                    Ward ${ward.number}
                </strong>

                <span>
                    ${escapeHTML(
                        ward.name
                    )}
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

        }
    );

}


function createWardOptions() {

    if (!wardSelect) return;


    wardSelect.innerHTML = `

        <option value="">
            Select your ward
        </option>

    `;


    wards.forEach(
        ward => {

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

        }
    );

}


/* =========================================================
   SHOW WARD
========================================================= */

async function showWard(
    wardNumber
) {

    if (!wardDisplay) return;


    const ward =
        wards.find(
            item =>
                item.number ===
                Number(wardNumber)
        );


    if (!ward) return;


    document
        .querySelectorAll(
            ".ward-button"
        )
        .forEach(
            button =>
                button.classList.remove(
                    "active"
                )
        );


    const active =
        document.querySelector(
            `.ward-button[data-ward="${ward.number}"]`
        );


    if (active) {
        active.classList.add(
            "active"
        );
    }


    wardDisplay.innerHTML = `

        <div class="loading">
            Loading Ward ${ward.number}...
        </div>

    `;


    try {

        /*
         * IMPORTANT:
         * We use ward_id because this is the
         * actual column in your database.
         *
         * We use "approved" because the new
         * system uses pending/approved/declined.
         */

        const members =
            await supabaseRequest(
                `members?ward_id=eq.${ward.number}&status=eq.approved&select=id,full_name,phone&order=full_name.asc`,
                {},
                false
            );


        let membersHTML = "";


        if (
            !members ||
            members.length === 0
        ) {

            membersHTML = `

                <div class="empty-state">

                    No approved members yet.

                </div>

            `;

        }

        else {

            membersHTML =
                members
                    .map(
                        member => `

                            <div class="member-card">

                                <div class="member-avatar">

                                    ${escapeHTML(
                                        getInitials(
                                            member.full_name
                                        )
                                    )}

                                </div>

                                <div>

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

                        `
                    )
                    .join("");

        }


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
                        ${members?.length || 0}
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

                        ${EXCO_POSITIONS
                            .map(
                                position => `

                                    <div class="office-card">

                                        <div>
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

                                `
                            )
                            .join("")}

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

    catch (error) {

        console.error(
            "WARD ERROR:",
            error
        );


        wardDisplay.innerHTML = `

            <div class="empty-state error">

                Unable to load this ward.

                <br><br>

                ${escapeHTML(
                    error.message
                )}

            </div>

        `;

    }

}


/* =========================================================
   REGISTRATION
========================================================= */

const registrationForm =
    document.getElementById(
        "registrationForm"
    );


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        submitRegistration
    );

}


async function submitRegistration(
    event
) {

    event.preventDefault();


    const button =
        document.getElementById(
            "submitBtn"
        );


    const message =
        document.getElementById(
            "formMessage"
        );


    const fullName =
        document
            .getElementById(
                "fullName"
            )
            ?.value
            .trim();


    const phone =
        document
            .getElementById(
                "phone"
            )
            ?.value
            .trim();


    const ward =
        document
            .getElementById(
                "ward"
            )
            ?.value;


    const pollingBoothElement =
        document.getElementById(
            "pollingBooth"
        );


    const addressElement =
        document.getElementById(
            "address"
        );


    const bankName =
        document
            .getElementById(
                "bankName"
            )
            ?.value
            .trim();


    const accountNumber =
        document
            .getElementById(
                "accountNumber"
            )
            ?.value
            .trim();


    const email =
        document
            .getElementById(
                "email"
            )
            ?.value
            .trim() || null;


    const gender =
        document
            .getElementById(
                "gender"
            )
            ?.value || null;


    /*
     * Your newer database uses address.
     * Your older registration page uses pollingBooth.
     *
     * If polling booth exists, save it as address
     * only when address field doesn't exist.
     */

    const address =
        addressElement
            ? addressElement.value.trim()
            : (
                pollingBoothElement
                    ? pollingBoothElement.value.trim()
                    : ""
            );


    if (!fullName) {

        showMessage(
            message,
            "Please enter your full name.",
            "error"
        );

        return;
    }


    if (!phone) {

        showMessage(
            message,
            "Please enter your phone number.",
            "error"
        );

        return;
    }


    if (!ward) {

        showMessage(
            message,
            "Please select your ward.",
            "error"
        );

        return;
    }


    if (!address) {

        showMessage(
            message,
            "Please enter your address/polling booth.",
            "error"
        );

        return;
    }


    if (
        !/^\d{10}$/.test(
            accountNumber || ""
        )
    ) {

        showMessage(
            message,
            "Account number must contain exactly 10 digits.",
            "error"
        );

        return;
    }


    if (!bankName) {

        showMessage(
            message,
            "Please enter your bank name.",
            "error"
        );

        return;
    }


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "Submitting...";

    }


    showMessage(
        message,
        "Submitting registration...",
        "info"
    );


    try {

        const insertData = {

            full_name:
                fullName,

            phone:
                phone,

            email:
                email,

            gender:
                gender,

            address:
                address,

            ward_id:
                Number(ward),

            bank_name:
                bankName,

            account_number:
                accountNumber,

            status:
                "pending"

        };


        const result =
            await supabaseRequest(
                "members",
                {

                    method:
                        "POST",

                    headers: {

                        "Prefer":
                            "return=minimal"

                    },

                    body:
                        JSON.stringify(
                            insertData
                        )

                },
                false
            );


        console.log(
            "Registration successful:",
            result
        );


        showMessage(
            message,
            "Registration submitted successfully. Your application is awaiting admin approval.",
            "success"
        );


        registrationForm.reset();


        createWardOptions();

    }

    catch (error) {

        console.error(
            "REGISTRATION ERROR:",
            error
        );


        showMessage(
            message,
            `Registration failed: ${error.message}`,
            "error"
        );

    }

    finally {

        if (button) {

            button.disabled =
                false;

            button.textContent =
                "Submit Registration";

        }

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


/* =========================================================
   ADMIN LOGIN
========================================================= */

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        adminLoginSubmit
    );

}


async function adminLoginSubmit(
    event
) {

    event.preventDefault();


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


    const message =
        document.getElementById(
            "adminLoginMessage"
        );


    const button =
        document.getElementById(
            "loginBtn"
        );


    if (!email || !password) {

        showMessage(
            message,
            "Enter your email and password.",
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

        const response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                {

                    method:
                        "POST",

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            email:
                                email,

                            password:
                                password

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(

                data.error_description ||
                data.msg ||
                data.message ||
                "Login failed."

            );

        }


        if (!data.access_token) {

            throw new Error(
                "No access token was returned."
            );

        }


        saveSession(
            data
        );


        showMessage(
            message,
            "Login successful. Loading dashboard...",
            "success"
        );


        await openAdminDashboard(
            data.user
        );

    }

    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        clearSession();


        showMessage(
            message,
            `Login failed: ${error.message}`,
            "error"
        );

    }

    finally {

        button.disabled =
            false;

        button.textContent =
            "Login";

    }

}


/* =========================================================
   OPEN ADMIN
========================================================= */

async function openAdminDashboard(
    user
) {

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
   CHECK ADMIN SESSION
========================================================= */

async function checkAdminSession() {

    if (
        !adminLogin ||
        !adminDashboard
    ) {
        return;
    }


    const token =
        getAccessToken();


    if (!token) {

        adminLogin.style.display =
            "block";

        adminDashboard.style.display =
            "none";

        return;

    }


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/user`,
                {

                    method:
                        "GET",

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const user =
            await response.json();


        if (!response.ok) {

            throw new Error(
                "Session expired."
            );

        }


        await openAdminDashboard(
            user
        );

    }

    catch (error) {

        console.error(
            "SESSION ERROR:",
            error
        );


        clearSession();


        adminLogin.style.display =
            "block";


        adminDashboard.style.display =
            "none";

    }

}


checkAdminSession();


/* =========================================================
   ADMIN REQUEST
========================================================= */

async function adminRequest(
    endpoint,
    options = {}
) {

    if (!getAccessToken()) {

        throw new Error(
            "You are not logged in."
        );

    }


    return await supabaseRequest(
        endpoint,
        options,
        true
    );

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

async function loadAdminDashboard() {

    try {

        await loadStatistics();

        await loadPendingMembers();

        await loadAcceptedMembers();

        await loadMembersByWard();

        await loadExcoManager();

    }

    catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );

    }

}


/* =========================================================
   STATISTICS
========================================================= */

async function loadStatistics() {

    const members =
        await adminRequest(
            "members?select=id,status"
        );


    const pending =
        members.filter(
            member =>
                member.status ===
                "pending"
        ).length;


    const approved =
        members.filter(
            member =>
                member.status ===
                "approved"
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
        approved
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


    if (!container) return;


    container.innerHTML = `

        <div class="loading">
            Loading registrations...
        </div>

    `;


    try {

        const members =
            await adminRequest(
                "members?status=eq.pending&select=*&order=created_at.desc"
            );


        if (
            !members ||
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


        members.forEach(
            member => {

                const ward =
                    wards.find(
                        item =>
                            item.number ===
                            Number(
                                member.ward_id
                            )
                    );


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
                        <strong>Email:</strong>
                        ${escapeHTML(
                            member.email ||
                            "Not provided"
                        )}
                    </p>

                    <p>
                        <strong>Gender:</strong>
                        ${escapeHTML(
                            member.gender ||
                            "Not provided"
                        )}
                    </p>

                    <p>
                        <strong>Ward:</strong>
                        Ward ${member.ward_id}
                        ${
                            ward
                                ? ` — ${escapeHTML(
                                    ward.name
                                )}`
                                : ""
                        }
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${escapeHTML(
                            member.address
                        )}
                    </p>

                    <p>
                        <strong>Bank:</strong>
                        ${escapeHTML(
                            member.bank_name
                        )}
                    </p>

                    <p>
                        <strong>Account Number:</strong>
                        ${escapeHTML(
                            member.account_number
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
                                "approved"
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

            }
        );

    }

    catch (error) {

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
    id,
    status
) {

    const action =
        status === "approved"
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

        await adminRequest(
            `members?id=eq.${encodeURIComponent(id)}`,
            {

                method:
                    "PATCH",

                headers: {

                    "Prefer":
                        "return=minimal"

                },

                body:
                    JSON.stringify({

                        status:
                            status

                    })

            }
        );


        alert(
            `Registration ${action}d successfully.`
        );


        await loadAdminDashboard();

    }

    catch (error) {

        console.error(
            "STATUS ERROR:",
            error
        );


        alert(
            `Unable to update registration: ${error.message}`
        );

    }

}


/* =========================================================
   ACCEPTED / APPROVED MEMBERS
========================================================= */

async function loadAcceptedMembers() {

    const container =
        document.getElementById(
            "acceptedList"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="loading">
            Loading members...
        </div>

    `;


    try {

        const members =
            await adminRequest(
                "members?status=eq.approved&select=*&order=full_name.asc"
            );


        if (
            !members ||
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

                            <th>Address</th>

                            <th>Bank</th>

                            <th>Account</th>

                            <th>EXCO</th>

                        </tr>

                    </thead>

                    <tbody>

        `;


        members.forEach(
            member => {

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
                            Ward ${member.ward_id}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.address
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.bank_name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                member.account_number
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

            }
        );


        html += `

                    </tbody>

                </table>

            </div>

        `;


        container.innerHTML =
            html;

    }

    catch (error) {

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


    if (!container) return;


    container.innerHTML = "";


    try {

        const members =
            await adminRequest(
                "members?status=eq.approved&select=id,full_name,phone,ward_id,address,exco_position&order=ward_id.asc,full_name.asc"
            );


        for (
            let wardNumber = 1;
            wardNumber <= 13;
            wardNumber++
        ) {

            const ward =
                wards.find(
                    item =>
                        item.number ===
                        wardNumber
                );


            const wardMembers =
                members.filter(
                    member =>
                        Number(
                            member.ward_id
                        ) ===
                        wardNumber
                );


            const section =
                document.createElement(
                    "div"
                );


            section.className =
                "ward-admin-section";


            let rows = "";


            wardMembers.forEach(
                member => {

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
                                    member.address
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

                }
            );


            section.innerHTML = `

                <h3>

                    Ward ${wardNumber}

                    ${
                        ward
                            ? ` — ${escapeHTML(
                                ward.name
                            )}`
                            : ""
                    }

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

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Address
                                        </th>

                                        <th>
                                            EXCO
                                        </th>

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

        }

    }

    catch (error) {

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


    if (!container) return;


    container.innerHTML = `

        <div class="loading">
            Loading EXCO manager...
        </div>

    `;


    try {

        const members =
            await adminRequest(
                "members?status=eq.approved&select=id,full_name,ward_id,exco_position&order=full_name.asc"
            );


        container.innerHTML =
            "";


        EXCO_POSITIONS.forEach(
            position => {

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


                members.forEach(
                    member => {

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

                    }
                );


                wrapper.appendChild(
                    label
                );


                wrapper.appendChild(
                    select
                );


                container.appendChild(
                    wrapper
                );

            }
        );

    }

    catch (error) {

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

const saveExcoBtn =
    document.getElementById(
        "saveExcoBtn"
    );


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

        const members =
            await adminRequest(
                "members?status=eq.approved&select=id,exco_position"
            );


        /*
         * Make sure every member starts
         * with no EXCO position.
         */

        for (
            const member of members
        ) {

            if (
                member.exco_position
            ) {

                await adminRequest(
                    `members?id=eq.${encodeURIComponent(member.id)}`,
                    {

                        method:
                            "PATCH",

                        headers: {

                            "Prefer":
                                "return=minimal"

                        },

                        body:
                            JSON.stringify({

                                exco_position:
                                    null

                            })

                    }
                );

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


            await adminRequest(
                `members?id=eq.${encodeURIComponent(memberId)}`,
                {

                    method:
                        "PATCH",

                    headers: {

                        "Prefer":
                            "return=minimal"

                    },

                    body:
                        JSON.stringify({

                            exco_position:
                                position

                        })

                }
            );

        }


        showMessage(
            message,
            "EXCO positions saved successfully.",
            "success"
        );


        await loadAcceptedMembers();

        await loadMembersByWard();

    }

    catch (error) {

        console.error(
            "EXCO ERROR:",
            error
        );


        showMessage(
            message,
            `Unable to save EXCO: ${error.message}`,
            "error"
        );

    }

    finally {

        saveExcoBtn.disabled =
            false;

        saveExcoBtn.textContent =
            "Save EXCO Positions";

    }

}


/* =========================================================
   REFRESH
========================================================= */

const refreshPendingBtn =
    document.getElementById(
        "refreshPendingBtn"
    );


if (refreshPendingBtn) {

    refreshPendingBtn.addEventListener(
        "click",
        loadAdminDashboard
    );

}


/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        adminLogout
    );

}


async function adminLogout() {

    const token =
        getAccessToken();


    try {

        if (token) {

            await fetch(
                `${SUPABASE_URL}/auth/v1/logout`,
                {

                    method:
                        "POST",

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );

        }

    }

    catch (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );

    }


    clearSession();


    if (adminDashboard) {

        adminDashboard.style.display =
            "none";

    }


    if (adminLogin) {

        adminLogin.style.display =
            "block";

    }

}


/* =========================================================
   HELPERS
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


function getInitials(
    name
) {

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
   START
========================================================= */

createWardButtons();

createWardOptions();


console.log(
    "BWI-RHA EKITI STATE CHAPTER website loaded."
);
