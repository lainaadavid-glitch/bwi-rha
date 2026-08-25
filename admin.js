/* ============================================
   BWI-RHA ADMIN DASHBOARD
============================================ */

const SUPABASE_URL =
    "https://xfjrmgendmmpnumsbjte.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_qBhmzkK4DDeZk1_pheHgRA_rNKHDKS7";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ELEMENTS */

const loginPage =
    document.getElementById("loginPage");

const dashboardPage =
    document.getElementById("dashboardPage");

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const logoutButton =
    document.getElementById("logoutButton");

const refreshButton =
    document.getElementById("refreshButton");

const statusFilter =
    document.getElementById("statusFilter");

const membersContainer =
    document.getElementById(
        "membersContainer"
    );


/* ============================================
   CHECK LOGIN
============================================ */

async function checkSession() {

    const {
        data
    } =
        await supabaseClient
            .auth
            .getSession();


    if (
        data.session
    ) {

        showDashboard();

    }

}


checkSession();


/* ============================================
   LOGIN
============================================ */

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        loginMessage.textContent =
            "Logging in...";


        const email =
            document
                .getElementById(
                    "email"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "password"
                )
                .value;


        const {
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({
                    email,
                    password
                });


        if (error) {

            loginMessage.textContent =
                error.message;

            loginMessage.style.color =
                "#b52b2b";

            return;

        }


        loginMessage.textContent = "";


        showDashboard();

    }
);


/* ============================================
   DASHBOARD
============================================ */

function showDashboard() {

    loginPage.classList.add(
        "hidden"
    );

    dashboardPage.classList.remove(
        "hidden"
    );

    loadMembers();

}


/* ============================================
   LOAD MEMBERS
============================================ */

async function loadMembers() {

    membersContainer.innerHTML =
        `<div class="loading">
            Loading registrations...
        </div>`;


    const {
        data: members,
        error
    } =
        await supabaseClient
            .from("members")
            .select("*")
            .order(
                "id",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            error
        );

        membersContainer.innerHTML =
            `<div class="empty">
                ${escapeHTML(
                    error.message
                )}
            </div>`;

        return;

    }


    updateStats(
        members
    );


    displayMembers(
        members
    );

}


/* ============================================
   STATISTICS
============================================ */

function updateStats(
    members
) {

    const total =
        members.length;


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


    const rejected =
        members.filter(
            member =>
                member.status ===
                "rejected"
        ).length;


    document.getElementById(
        "totalMembers"
    ).textContent =
        total;


    document.getElementById(
        "pendingMembers"
    ).textContent =
        pending;


    document.getElementById(
        "approvedMembers"
    ).textContent =
        approved;


    document.getElementById(
        "rejectedMembers"
    ).textContent =
        rejected;

}


/* ============================================
   DISPLAY MEMBERS
============================================ */

function displayMembers(
    members
) {

    const filter =
        statusFilter.value;


    const filtered =
        filter === "all"
            ? members
            : members.filter(
                member =>
                    member.status ===
                    filter
            );


    if (
        filtered.length === 0
    ) {

        membersContainer.innerHTML =
            `<div class="empty">
                No registrations found.
            </div>`;

        return;

    }


    membersContainer.innerHTML =
        filtered
            .map(
                member => {

                    return `

                        <div
                            class="member-row"
                            data-id="${member.id}"
                        >

                            <div>

                                <div class="member-name">
                                    ${escapeHTML(
                                        member.full_name
                                    )}
                                </div>

                                <div class="member-detail">
                                    ${escapeHTML(
                                        member.phone || ""
                                    )}
                                </div>

                            </div>


                            <div class="member-detail">

                                ${escapeHTML(
                                    member.bank_name || "—"
                                )}

                                <br>

                                ${escapeHTML(
                                    member.account_number || "—"
                                )}

                            </div>


                            <div class="member-detail">

                                Ward ${escapeHTML(
                                    member.ward_id || "—"
                                )}

                                <br>

                                ${escapeHTML(
                                    member.address || ""
                                )}

                            </div>


                            <div>

                                <span
                                    class="member-status status-${escapeHTML(
                                        member.status
                                    )}"
                                >
                                    ${escapeHTML(
                                        member.status
                                    )}
                                </span>

                            </div>


                            <div class="actions">

                                ${
                                    member.status !==
                                    "approved"
                                        ? `
                                            <button
                                                class="approve"
                                                onclick="updateStatus(
                                                    ${member.id},
                                                    'approved'
                                                )"
                                            >
                                                Approve
                                            </button>
                                        `
                                        : ""
                                }


                                ${
                                    member.status !==
                                    "rejected"
                                        ? `
                                            <button
                                                class="reject"
                                                onclick="updateStatus(
                                                    ${member.id},
                                                    'rejected'
                                                )"
                                            >
                                                Reject
                                            </button>
                                        `
                                        : ""
                                }


                                <button
                                    class="delete"
                                    onclick="deleteMember(
                                        ${member.id}
                                    )"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* ============================================
   UPDATE STATUS
============================================ */

async function updateStatus(
    id,
    status
) {

    const {
        error
    } =
        await supabaseClient
            .from("members")
            .update({
                status: status
            })
            .eq(
                "id",
                id
            );


    if (error) {

        alert(
            "Update failed: " +
            error.message
        );

        return;

    }


    await loadMembers();

}


/* ============================================
   DELETE
============================================ */

async function deleteMember(
    id
) {

    const confirmed =
        confirm(
            "Delete this member permanently?"
        );


    if (!confirmed)
        return;


    const {
        error
    } =
        await supabaseClient
            .from("members")
            .delete()
            .eq(
                "id",
                id
            );


    if (error) {

        alert(
            "Delete failed: " +
            error.message
        );

        return;

    }


    await loadMembers();

}


/* ============================================
   LOGOUT
============================================ */

logoutButton.addEventListener(
    "click",
    async () => {

        await supabaseClient
            .auth
            .signOut();


        dashboardPage.classList.add(
            "hidden"
        );

        loginPage.classList.remove(
            "hidden"
        );

    }
);


/* ============================================
   FILTER
============================================ */

statusFilter.addEventListener(
    "change",
    loadMembers
);


/* ============================================
   REFRESH
============================================ */

refreshButton.addEventListener(
    "click",
    loadMembers
);


/* ============================================
   ESCAPE HTML
============================================ */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
