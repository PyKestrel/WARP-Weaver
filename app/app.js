const ProtectedIDs = ["AutoConnect",
    "ClientID",
    "ClientSecret",
    "DisplayName",
    "MultiUser",
    "OrganizationName",
    "OverrideAPIEndpoint",
    "OverrideDoHEndpoint",
    "OverrideWARPEndpoint",
    "ServiceMode",
    "SupportURL",
    "SwitchLock",
    "form"
]

// Get Select Field Data From Each Form Found On The Document
function getAllFormData() {
    // Declarations
    let FormsArray = [];
    // Get All Form Elements On DOM & Their Count
    const elements = document.querySelectorAll('form');
    const count = elements.length;
    // Loop Through Each Form Element That Exists
    for (let i = 0; i < count; i++) {
        // Get An Element From The Array Of Forms, Assign It To x Variable For Easier Handling
        let x = elements[i];
        // Hold Key Value Pairs In JSON Object To Be Appended To FormsArray
        let formDataValuesObject = {}
        for (let i = 0; i < x.length; i++) {
            // Check For Elements Without An ID & Skip Them
            if (x.elements[i].id == "" || x.elements[i].id == null || x.elements[i].id == undefined) {
                continue;
            }else if (!(ProtectedIDs.includes(x.elements[i].id))){
                continue;
            }
            else {
                let ID;
                let Value;
                // Check For Toggles/Switches & Their Corresponding States
                if (x.elements[i].type == "checkbox") {
                    ID = x.elements[i].id;
                    Value = x.elements[i].checked;
                }
                // Elements That Arent Switches
                else {
                    ID = x.elements[i].id;
                    Value = x.elements[i].value;
                }
                // Add The Key & Value To Our JSON Array
                formDataValuesObject[ID] = Value;
            }
        }
        // Append The Completed JSON Object To The FormsArray
        FormsArray.push(formDataValuesObject)
    }
    return FormsArray
}

let NumberOfAdditionalOrganizations = 0;
function addOrganization() {
    // Configuration Container
    const ConfigGenerator = document.getElementById("ConfigGenerator");
    // Get Configuration Buttons
    const configurationButtonsNode = document.getElementById("ConfigurationButtons");
    // Get All Organization Elements On DOM & Clone Only One Of Them
    const elements = document.querySelectorAll('.organization');
    let organizationCard = elements[0].cloneNode(true);
    // Remove The Pre-Logon & Multi-User Options Since We Only Need It Set Once
    //organizationCard.removeChild(document.getElementById("prelogonAccordionItem"));
    //organizationCard.removeChild(document.getElementById("multiuserAccordionItem"));

    const elementsThatHaveId = [...organizationCard.querySelectorAll('[id]')];
    const elementsThatHaveFor = [...organizationCard.querySelectorAll('[for]')];
    
    elementsThatHaveId.forEach((e) => {
        if (ProtectedIDs.includes(e.id)){
            
        }else{
            if (isNaN(e.id[e.id.length - 1])){
                let shouldSkip = false;
                elementsThatHaveFor.forEach((f) => {
                    if (shouldSkip) {
                        return;
                    }
                    if (f.for == e.id){
                        f.for = e.id + NumberOfAdditionalOrganizations;
                        shouldSkip = true;
                        return;
                    }
                });
                if(e.hasAttribute('data-bs-target')){
                    e.setAttribute('data-bs-target', e.getAttribute("data-bs-target") + NumberOfAdditionalOrganizations);
                }
                if(e.hasAttribute('aria-controls')){
                    e.setAttribute('aria-controls', e.getAttribute("aria-controls") + NumberOfAdditionalOrganizations);
                }
                if(e.hasAttribute('data-bs-parent')){
                    e.setAttribute('data-bs-parent', e.getAttribute("data-bs-parent") + NumberOfAdditionalOrganizations);
                }
                e.id += NumberOfAdditionalOrganizations;
            }else{
                e.id.slice(0,-1)
                let shouldSkip = false;
                elementsThatHaveFor.forEach((f) => {
                    if (shouldSkip) {
                        return;
                    }
                    if (f.for == e.id){
                        f.for = e.id + NumberOfAdditionalOrganizations;
                        shouldSkip = true;
                        return;
                    }
                });
                if(e.hasAttribute('data-bs-target')){
                    e.setAttribute('data-bs-target', e.getAttribute("data-bs-target") + NumberOfAdditionalOrganizations);
                }
                if(e.hasAttribute('aria-controls')){
                    e.setAttribute('aria-controls', e.getAttribute("aria-controls") + NumberOfAdditionalOrganizations);
                }
                if(e.hasAttribute('data-bs-parent')){
                    e.setAttribute('data-bs-parent', e.getAttribute("data-bs-parent") + NumberOfAdditionalOrganizations);
                }
                e.id += NumberOfAdditionalOrganizations;
            }
        }
    });
    NumberOfAdditionalOrganizations += 1;

    let tempcloseButton = `<button type="button" class="btn-close" style="position: relative; left: 96%; top: 10px;" aria-label="Close" onclick="this.parentElement.remove()"></button>`
    var temp = document.createElement('div');
    temp.innerHTML = tempcloseButton;
    var closeButton = temp.firstChild;

    organizationCard.insertBefore(closeButton, organizationCard.firstChild);
    // Insert The New Card Before The Configuration Buttons
    ConfigGenerator.insertBefore(organizationCard, configurationButtonsNode);
}