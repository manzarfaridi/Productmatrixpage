// ==========================================================================//
                           // HEADER PAGE STARTS //
//========================================================================== //
document.addEventListener("DOMContentLoaded", function () {
        const hamburgerBtn = document.getElementById("bdaHamburgerBtn");
        const navMenu = document.getElementById("bdaNavMenu");
        const searchTrigger = document.getElementById("bdaMobileSearchTrigger");
        const searchForm = document.getElementById("bdaSearchForm");

        // 1. HEMBURG BUTTON CLICK(TO OPEN/CLOSE MOBILE MENU)
        if (hamburgerBtn && navMenu) {
            hamburgerBtn.addEventListener("click", function (event) {
                event.stopPropagation(); // TO STOP CLICK OUT
                
                // ON/OFF MENU 
                navMenu.classList.toggle("bda-menu-open");
                // ALL TREE LINE TO BE 'X' MARK
                hamburgerBtn.classList.toggle("bda-close-toggle");
                
                // SAFTY CHECK IF AT TIME OF PENING MENU SEARCH BOX IS OPEN THET IT WILL CLOSE THE SEARCH BOX 
                if (searchForm) {
                    searchForm.classList.remove("bda-search-open");
                }
            });
        }
             //====================ye bad me dala hua java script hai vajah thi loginbutton close karne pe search ka drop down notification khula mil rha tha================
            // 2. क्लोज (X) बटन पर क्लिक करने पर पॉप-अप बंद हो जाए (Updated with StopPropagation)
    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // सबसे ज़रूरी: यह क्लिक इवेंट को पीछे मौजूद सर्च कॉलम तक जाने से रोकेगा!
            
            authOverlay.classList.remove('open-popup');
        });
    }

    // 3. अगर यूज़र फॉर्म से बाहर खाली जगह (Overlay) पर क्लिक करे, तो बंद हो जाए
    if (authOverlay) {
        authOverlay.addEventListener('click', (e) => {
            if (e.target === authOverlay) {
                e.preventDefault();
                e.stopPropagation();
                authOverlay.classList.remove('open-popup');
            }
        });
    }


        // 2. SEARCH ICON CLIC सर्च आइकॉन क्लिक (MOBILE SEARCH BOX ON/OFF)
        if (searchTrigger && searchForm) {
            searchTrigger.addEventListener("click", function (event) {
                event.stopPropagation(); // TO STOP CLICK TO GO OUT
                
                // SEARCH BOX ON/OFF
                searchForm.classList.toggle("bda-search-open");
                
                // SAFTY CHECK: AT TIME OF OPENING SEARCH IF MENU IS OPEN THEN IT WILL COLSE THE MENU
                if (navMenu && hamburgerBtn) {
                    navMenu.classList.remove("bda-menu-open");
                    hamburgerBtn.classList.remove("bda-close-toggle");
                }
            });
        }

        // 3. ON ANY WHERE ON SCREEN IS CLICK OPENED MENU IS CLOSSED
        document.addEventListener("click", function (event) {
            // अगर क्लिक मेनू या हैमबर्गर बटन के अंदर नहीं हुआ है, तो मेनू बंद करें
            if (navMenu && !navMenu.contains(event.target) && hamburgerBtn && !hamburgerBtn.contains(event.target)) {
                navMenu.classList.remove("bda-menu-open");
                hamburgerBtn.classList.remove("bda-close-toggle");
            }
            
            // अगर क्लिक सर्च फॉर्म या सर्च आइकॉन के अंदर नहीं हुआ है, तो सर्च बंद करें
            if (searchForm && !searchForm.contains(event.target) && searchTrigger && !searchTrigger.contains(event.target)) {
                searchForm.classList.remove("bda-search-open");
            }
        });
    });
// ==========================================================================
//                               HEADER PAGE ENDS 
//===========================================================================
//===========================================================================
//        BIHAR DRUGS AGENCY (BDA) - PRODUCTS MATRIX PAGE SCRIPT STARTS
//===========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("pharmaLiveSearchInput");
    const tableBody = document.getElementById("pharmaTableBodyRows");
    const noResultsMsg = document.getElementById("noPharmaResultsMessage");
    
    // Actions Targets
    const selectAllCheckbox = document.getElementById("selectAllPharmaRows");
    const exportExcelBtn = document.getElementById("exportExcelBtn");
    const shareWhatsappBtn = document.getElementById("shareWhatsappBtn");
    const checkedRowsCount = document.getElementById("checkedRowsCount");
    
    const categoryItems = document.querySelectorAll(".category-item");
    const companyCheckboxes = document.querySelectorAll(".company-filter-checkbox");

    if (!tableBody) return;

    // 1. रो-डेटा को क्रैश होने से बचाने के लिए सेफ सेलेक्टर फंक्शन
    function getTableRowData(row) {
        if (!row || !row.cells || row.cells.length < 7) {
            return { brand: "", needle: "", suture: "", comp: "", mrp: "" };
        }
        return {
            brand: row.cells[1] ? row.cells[1].innerText.trim() : "",
            needle: row.cells[2] ? row.cells[2].innerText.trim() : "",
            suture: row.cells[3] ? row.cells[3].innerText.trim() : "",
            comp: row.cells[4] ? row.cells[4].innerText.trim() : "",
            mrp: row.cells[5] ? row.cells[5].innerText.trim() : ""
        };
    }

    // 2. 3-लेवल हाइब्रिड मास्टर फ़िल्टर इंजन (खोज + श्रेणी + कंपनी)
    function filterDashboardInventory() {
        const rows = tableBody.getElementsByTagName("tr");
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
        
        const activeCatItem = document.querySelector(".category-item.active-cat");
        const activeCategory = activeCatItem ? activeCatItem.getAttribute("data-category") : "all";

        const selectedCompanies = [];
        companyCheckboxes.forEach(cb => {
            if (cb.checked) selectedCompanies.push(cb.value);
        });

        let matchCount = 0;

        Array.from(rows).forEach(row => {
            const rowCategory = row.getAttribute("data-prod-cat") || "";
            const rowCompany = row.getAttribute("data-company") || "";
            const data = getTableRowData(row);

            const categoryMatches = (activeCategory === "all" || rowCategory === activeCategory);
            const companyMatches = selectedCompanies.includes(rowCompany);
            
            // पूरे रो के किसी भी अक्षर को टाइप करके खोजने की सुविधा
            const rowFullText = `${data.brand} ${data.needle} ${data.suture} ${data.comp}`.toLowerCase();
            const searchMatches = rowFullText.includes(searchTerm);

            if (categoryMatches && companyMatches && searchMatches) {
                row.style.display = "";
                matchCount++;
            } else {
                row.style.display = "none";
                
                // छिपे हुए रो को अनचेक करना ताकि गलत एक्सपोर्ट न हो
                const cb = row.querySelector(".row-select-input");
                if (cb) {
                    cb.checked = false;
                    row.classList.remove("row-is-selected");
                }
            }
        });

        if (noResultsMsg) {
            noResultsMsg.style.display = (matchCount === 0) ? "block" : "none";
        }

        syncActionControls();
    }

    // 3. काउंटर और इनेबल/डिसेबल लॉजिक कंट्रोलर
    function syncActionControls() {
        const allInputs = tableBody.querySelectorAll(".row-select-input");
        const checkedInputs = tableBody.querySelectorAll(".row-select-input:checked");
        const visibleInputs = tableBody.querySelectorAll("tr:not([style*='display: none']) .row-select-input");
        const visibleChecked = tableBody.querySelectorAll("tr:not([style*='display: none']) .row-select-input:checked");

        const count = checkedInputs.length;
        if (checkedRowsCount) checkedRowsCount.innerText = count;

        const isBtnDisabled = (count === 0);
        if (exportExcelBtn) exportExcelBtn.disabled = isBtnDisabled;
        if (shareWhatsappBtn) shareWhatsappBtn.disabled = isBtnDisabled;

        if (selectAllCheckbox) {
            selectAllCheckbox.checked = (visibleInputs.length === visibleChecked.length && visibleInputs.length > 0);
        }
    }

    // 4. 'Select All' चेकबॉक्स पर क्लिक इवेंट
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", function () {
            const isChecked = this.checked;
            const rows = tableBody.getElementsByTagName("tr");
            
            Array.from(rows).forEach(row => {
                if (row.style.display !== "none") {
                    const cb = row.querySelector(".row-select-input");
                    if (cb) {
                        cb.checked = isChecked;
                        if (isChecked) row.classList.add("row-is-selected");
                        else row.classList.remove("row-is-selected");
                    }
                }
            });
            syncActionControls();
        });
    }

    // 5. सिंगल चेकबॉक्स क्लिक इवेंट (डेलिगेटेड मोड - सेफ)
    tableBody.addEventListener("change", function (e) {
        if (e.target && e.target.classList.contains("row-select-input")) {
            const tr = e.target.closest("tr");
            if (tr) {
                if (e.target.checked) tr.classList.add("row-is-selected");
                else tr.classList.remove("row-is-selected");
            }
            syncActionControls();
        }
    });

    // फ़िल्टर लिसनर्स बाइंडिंग
    companyCheckboxes.forEach(cb => cb.addEventListener("change", filterDashboardInventory));
    if (searchInput) searchInput.addEventListener("input", filterDashboardInventory);
    
    categoryItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            categoryItems.forEach(cat => cat.classList.remove("active-cat"));
            this.classList.add("active-cat");
            filterDashboardInventory();
        });
    });

    // 6. माइक्रोसॉफ्ट एक्सेल एक्सपोर्ट इंजन (.xlsx)
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener("click", () => {
            const checkedBoxes = tableBody.querySelectorAll(".row-select-input:checked");
            const exportData = [];
            
            // एक्सेल के लिए बिल्कुल सटीक 5 हेडर कॉलम्स
            exportData.push(["BRAND", "NEEDLE'S PROFILE", "SUTURE'S PROFILE", "COMPOSITION", "MRP (BOX/12PCS)"]);

            checkedBoxes.forEach(cb => {
                const tr = cb.closest("tr");
                if (tr) {
                    const data = getTableRowData(tr);
                    exportData.push([data.brand, data.needle, data.suture, data.comp, data.mrp]);
                }
            });

            if (typeof XLSX !== "undefined") {
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(exportData);
                XLSX.utils.book_append_sheet(wb, ws, "Surgical Profiles");
                XLSX.writeFile(wb, "BDA_Surgical_Profiles_Matrix.xlsx");
            } else {
                alert("Excel Engine error: Please check your internet connection to load SheetJS.");
            }
        });
    }

    // 7. एडवांस व्हाट्सएप शेयरिंग मैसेज इंजन
    if (shareWhatsappBtn) {
        shareWhatsappBtn.addEventListener("click", () => {
            const checkedBoxes = tableBody.querySelectorAll(".row-select-input:checked");
            let textMessage = "*BDA GLOBAL MATRIX - SURGICAL PROFILES*\n";
            textMessage += "========================================\n\n";

            let idx = 1;
            checkedBoxes.forEach(cb => {
                const tr = cb.closest("tr");
                if (tr) {
                    const data = getTableRowData(tr);
                    textMessage += `${idx}. *${data.brand}*\n`;
                    textMessage += `   • *Needle:* ${data.needle}\n`;
                    textMessage += `   • *Suture:* ${data.suture}\n`;
                    textMessage += `   • *Composition:* ${data.comp}\n`;
                    textMessage += `   • *MRP:* ${data.mrp}\n`;
                    textMessage += "----------------------------------------\n";
                    idx++;
                }
            });

            textMessage += "\n_Generated via BDA Global System Matrix_";
            window.open(`https://whatsapp.com{encodeURIComponent(textMessage)}`, "_blank");
        });
    }

    // 8. "View More" बटन क्लिक इवेंट
    tableBody.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("row-view-details")) {
            e.preventDefault();
            const tr = e.target.closest("tr");
            const data = getTableRowData(tr);
            
            // अगर लॉगिन ब्लॉक पहले से मौजूद है, तो उसे खोलें वरना सेफ अलर्ट दिखाएँ
            alert(`Opening detailed specification metrics for *${data.brand}*.\n\nNeedle Profile: ${data.needle}\nSuture Profile: ${data.suture}`);
        }
    });
});
//=================================================================================
//            BIHAR DRUGS AGENCY (BDA)- PRODUCTS MATRIX PAGE SCRIPT ENDS
//=================================================================================

// ================================================================================
//                      FOATING MAP BUTTON SCRIPT STARTS 
//=================================================================================
document.addEventListener("DOMContentLoaded", function() {
    const mapBtn = document.getElementById("openMapModal");
    const mapModal = document.getElementById("mapModal");
    const closeBtn = document.getElementById("closeMapModal");

    // बटन क्लिक करने पर मैप पॉपअप खोलें
    if(mapBtn && mapModal) {
        mapBtn.addEventListener("click", function(e) {
            e.preventDefault();
            mapModal.style.display = "flex";
        });
    }

    // X पर क्लिक करने पर बंद करें
    if(closeBtn && mapModal) {
        closeBtn.addEventListener("click", function() {
            mapModal.style.display = "none";
        });
    }

    // बाहर डार्क एरिया में क्लिक करने पर भी बंद करें
    window.addEventListener("click", function(e) {
        if (e.target === mapModal) {
            mapModal.style.display = "none";
        }
    });
});
// ===============================================================================
//                         FOATING MAP BUTTON SCRIPT ENDS 
//================================================================================

// ===============================================================================
//                               LOGIN SCRIPT STARTS 
//================================================================================
document.addEventListener("DOMContentLoaded", () => {
    const authCard = document.getElementById('authCard');
    const toSignUp = document.getElementById('toSignUp');
    const toSignIn = document.getElementById('toSignIn');
    const brandTitle = document.getElementById('brandTitle');
    const brandDesc = document.getElementById('brandDesc');

    // Smooth UI State Switch Event Handlers
    toSignUp.addEventListener('click', () => {
        authCard.classList.add('show-signup');
        // Dynamic Side Text Content Adaptation (Optional Premium Detail)
        brandTitle.innerText = "Join Our Global Medical Supply Network";
        brandDesc.innerText = "Create your secure portal identity to unlock instant pricing, tracking matrices, and enterprise grade system integrations.";
    });

    toSignIn.addEventListener('click', () => {
        authCard.classList.remove('show-signup');
        brandTitle.innerText = "Premium Solutions For Global Medical Supply";
        brandDesc.innerText = "Access your secure executive dashboard to manage high-precision medical instruments and steel system integrations.";
    });

    // Password Visibility Masking Toggles
    const maskIcons = document.querySelectorAll('.toggle-mask');
    maskIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const pwdInput = this.parentElement.querySelector('.pwd-field');
            if(pwdInput.type === 'password') {
                pwdInput.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                pwdInput.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
});
//====================on click get opent java section======================// 
          document.addEventListener("DOMContentLoaded", () => {
    const sectionLoginTrigger = document.querySelector('.section-login-trigger');
    const sectionSignupTrigger = document.querySelector('.section-signup-trigger');
    const dropZone = document.getElementById('dropZone');
    const docInput = document.getElementById('documentUploadInput');
    const fileListName = document.getElementById('fileListName');

    // मोबाइल व्यू फंक्शन को सुरक्षित कॉल करने के लिए चेक
    function syncMobileView() {
        if (typeof updateMobileFormVisibility === "function") {
            updateMobileFormVisibility();
        }
    }

    // निचले दोनों नए एक्शन बटन्स पर क्लिक करने पर सीधे पॉप-अप को सही फ़ॉर्म के साथ खोलना
    if (sectionLoginTrigger) {
        sectionLoginTrigger.addEventListener('click', () => {
            authCard.classList.remove('show-signup'); 
            authOverlay.classList.add('open-popup');
            if (brandTitle) brandTitle.innerText = "Premium Solutions For Global Medical Supply";
            if (brandDesc) brandDesc.innerText = "Access your secure executive dashboard to manage integrations.";
            syncMobileView();
        });
    }

    if (sectionSignupTrigger) {
        sectionSignupTrigger.addEventListener('click', () => {
            authCard.classList.add('show-signup'); 
            authOverlay.classList.add('open-popup');
            if (brandTitle) brandTitle.innerText = "Join Our Global Medical Supply Network";
            if (brandDesc) brandDesc.innerText = "Create your secure portal identity to unlock instant pricing.";
            syncMobileView();
        });
    }

    // ड्रैग-एंड-ड्रॉप और मोबाइल क्लिक फाइल अपलोडर कोर लॉजिक
    if (dropZone && docInput) {
        dropZone.addEventListener('click', () => docInput.click());

        docInput.addEventListener('change', () => {
            if (docInput.files.length > 0) {
                let names = Array.from(docInput.files).map(f => f.name).join(', ');
                fileListName.innerText = "Selected: " + names;
                fileListName.style.color = "var(--auth-navy)";
            } else {
                fileListName.innerText = "No file selected";
                fileListName.style.color = "var(--auth-orange)";
            }
        });

        // ड्रैग ओवर एनिमेशन इफेक्ट्स (डेस्कटॉप सपोर्ट)
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = "var(--auth-navy)";
            dropZone.style.background = "#f0f4f8";
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = "var(--auth-border)";
            dropZone.style.background = "#f8fafc";
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = "var(--auth-border)";
            dropZone.style.background = "#f8fafc";
            
            if (e.dataTransfer.files.length > 0) {
                docInput.files = e.dataTransfer.files;
                let names = Array.from(docInput.files).map(f => f.name).join(', ');
                fileListName.innerText = "Dropped: " + names;
                fileListName.style.color = "var(--auth-navy)";
            }
        });
    }

    const authOverlay = document.getElementById('authOverlay');
    const authCard = document.getElementById('authCard');
    const closeAuthBtn = document.getElementById('closeAuthBtn');
    
    // वेबसाइट के Navbar वाले बटन की ID (जिससे लॉगिन फॉर्म खुलेगा)
    const navSignUpBtn = document.getElementById('navSignUpBtn'); 
    
    const toSignUp = document.getElementById('toSignUp');
    const toSignIn = document.getElementById('toSignIn');
    const brandTitle = document.getElementById('brandTitle');
    const brandDesc = document.getElementById('brandDesc');

    // 1. मोबाइल और डेस्कटॉप दोनों के लिए फॉर्म विज़िबिलिटी को मैनेज करने वाला फंक्शन
    function updateMobileFormVisibility() {
        // अगर स्क्रीन छोटी है (850px से कम)
        if (window.innerWidth <= 850) {
            const signInBox = document.querySelector('.auth-overlay .signin-box');
            const signUpBox = document.querySelector('.auth-overlay .sign-up-box');
            
            if (signInBox && signUpBox) {
                if (authCard.classList.contains('show-signup')) {
                    signInBox.style.setProperty('display', 'none', 'important');
                    signUpBox.style.setProperty('display', 'flex', 'important');
                } else {
                    signInBox.style.setProperty('display', 'flex', 'important');
                    signUpBox.style.setProperty('display', 'none', 'important');
                }
            }
        }
    }

    // 2. जब यूज़र Navbar के बटन पर क्लिक करे तो पॉप-अप खुले
    if (navSignUpBtn) {
        navSignUpBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            authOverlay.classList.add('open-popup');
            updateMobileFormVisibility(); // मोबाइल चेक रन करें
        });
    }

    // 3. क्लोज (X) बटन पर क्लिक करने पर पॉप-अप बंद हो जाए
    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authOverlay.classList.remove('open-popup');
        });
    }

    // 4. अगर यूज़र फॉर्म से बाहर खाली जगह (Overlay) पर क्लिक करे, तो बंद हो जाए
    if (authOverlay) {
        authOverlay.addEventListener('click', (e) => {
            if (e.target === authOverlay) {
                authOverlay.classList.remove('open-popup');
            }
        });
    }

    // 5. साइन-अप फॉर्म पर स्विच करने का लॉजिक
    if (toSignUp) {
        toSignUp.addEventListener('click', () => {
            authCard.classList.add('show-signup');
            if (brandTitle) brandTitle.innerText = "Join Our Global Medical Supply Network";
            if (brandDesc) brandDesc.innerText = "Create your secure portal identity to unlock instant pricing.";
            updateMobileFormVisibility(); // मोबाइल व्यू को तुरंत अपडेट करें
        });
    }

    // 6. लॉगिन (Sign In) फॉर्म पर वापस आने का लॉजिक
    if (toSignIn) {
        toSignIn.addEventListener('click', () => {
            authCard.classList.remove('show-signup');
            if (brandTitle) brandTitle.innerText = "Premium Solutions For Global Medical Supply";
            if (brandDesc) brandDesc.innerText = "Access your secure executive dashboard to manage integrations.";
            updateMobileFormVisibility(); // मोबाइल व्यू को तुरंत अपडेट करें
        });
    }

    // स्क्रीन का साइज़ छोटा-बड़ा होने पर भी फॉर्म की विज़िबिलिटी चेक होती रहे
    window.addEventListener('resize', updateMobileFormVisibility);

    // 7. पासवर्ड शो/हाइड करने का लॉजिक
    const maskIcons = document.querySelectorAll('.toggle-mask');
    maskIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const pwdInput = this.parentElement.querySelector('.pwd-field');
            if (pwdInput) {
                if (pwdInput.type === 'password') {
                    pwdInput.type = 'text';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                } else {
                    pwdInput.type = 'password';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                }
            }
        });
    });
});
// =========================================================================
//                             LOGIN SCRIPT ENDS 
//==========================================================================


