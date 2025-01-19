// These ID's Are To Not Be Modified And Are Critical To The XML Function.
const ProtectedIDs = [
  "AutoConnect",
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
  "form",
];

// Get Select Field Data From Each Form Found On The Document
function getAllFormData() {
  // Declarations
  let FormsArray = [];
  // Get All Form Elements On DOM & Their Count
  const elements = document.querySelectorAll("form");
  const count = elements.length;
  // Loop Through Each Form Element That Exists
  for (let i = 0; i < count; i++) {
    // Get An Element From The Array Of Forms, Assign It To x Variable For Easier Handling
    let x = elements[i];
    // Hold Key Value Pairs In JSON Object To Be Appended To FormsArray
    let formDataValuesObject = {};
    for (let i = 0; i < x.length; i++) {
      // Check For Elements Without An ID & Skip Them
      if (
        x.elements[i].id == "" ||
        x.elements[i].id == null ||
        x.elements[i].id == undefined
      ) {
        continue;
      } else if (!ProtectedIDs.includes(x.elements[i].id)) {
        continue;
      } else {
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
    FormsArray.push(formDataValuesObject);
  }
  return FormsArray;
}

let NumberOfAdditionalOrganizations = 0;
function addOrganization() {
  // Configuration Container
  const ConfigGenerator = document.getElementById("ConfigGenerator");
  // Get Configuration Buttons
  const configurationButtonsNode = document.getElementById(
    "ConfigurationButtons"
  );
  // Get All Organization Elements On DOM & Clone Only One Of Them
  const elements = document.querySelectorAll(".organization");
  let organizationCard = elements[0].cloneNode(true);
  // Remove The Pre-Logon & Multi-User Options Since We Only Need It Set Once
  //organizationCard.removeChild(document.getElementById("prelogonAccordionItem"));
  //organizationCard.removeChild(document.getElementById("multiuserAccordionItem"));

  const elementsThatHaveId = [...organizationCard.querySelectorAll("[id]")];
  const elementsThatHaveFor = [...organizationCard.querySelectorAll("[for]")];
  // Check For Elements With A ID Attribute And Updating Them To Be Unique By Appending A Number To The End That Increments Everytime The Function Is Called.
  elementsThatHaveId.forEach((e) => {
    if (ProtectedIDs.includes(e.id)) {
    } else {
      if (isNaN(e.id[e.id.length - 1])) {
        let shouldSkip = false;
        // Check For Elements That Have A for Attribute Like Labels, This Is Required For Bootstrap Accordions To Work Properly.
        elementsThatHaveFor.forEach((f) => {
          if (shouldSkip) {
            return;
          }
          if (f.for == e.id) {
            // Update The For Label To Match The Updated ID Of The Select Fields In The New Card.
            f.for = e.id + NumberOfAdditionalOrganizations;
            shouldSkip = true;
            return;
          }
        });
        // Updating All The Attributes That Need To Be Unique For Bootstrap Accordions And Floating Labels To Work Properly.
        if (e.hasAttribute("data-bs-target")) {
          e.setAttribute(
            "data-bs-target",
            e.getAttribute("data-bs-target") + NumberOfAdditionalOrganizations
          );
        }
        if (e.hasAttribute("aria-controls")) {
          e.setAttribute(
            "aria-controls",
            e.getAttribute("aria-controls") + NumberOfAdditionalOrganizations
          );
        }
        if (e.hasAttribute("data-bs-parent")) {
          e.setAttribute(
            "data-bs-parent",
            e.getAttribute("data-bs-parent") + NumberOfAdditionalOrganizations
          );
        }
        // Update ID
        e.id += NumberOfAdditionalOrganizations;

        if (e.id.includes("prelogon") || e.id.includes("multiuser")) {
          e.remove();
        }
      } else {
        e.id.slice(0, -1);
        let shouldSkip = false;

        elementsThatHaveFor.forEach((f) => {
          if (shouldSkip) {
            return;
          }
          if (f.for == e.id) {
            f.for = e.id + NumberOfAdditionalOrganizations;
            shouldSkip = true;
            return;
          }
        });
        // Updating All The Attributes That Need To Be Unique For Bootstrap Accordions And Floating Labels To Work Properly.
        if (e.hasAttribute("data-bs-target")) {
          e.setAttribute(
            "data-bs-target",
            e.getAttribute("data-bs-target") + NumberOfAdditionalOrganizations
          );
        }
        if (e.hasAttribute("aria-controls")) {
          e.setAttribute(
            "aria-controls",
            e.getAttribute("aria-controls") + NumberOfAdditionalOrganizations
          );
        }
        if (e.hasAttribute("data-bs-parent")) {
          e.setAttribute(
            "data-bs-parent",
            e.getAttribute("data-bs-parent") + NumberOfAdditionalOrganizations
          );
        }
        // Update ID
        e.id += NumberOfAdditionalOrganizations;
        if (e.id.includes("prelogon") || e.id.includes("multiuser")) {
          e.remove();
        }
      }
    }
  });
  NumberOfAdditionalOrganizations += 1;

  let tempcloseButton = `<button type="button" class="btn-close" style="position: relative; left: 96%; top: 10px;" aria-label="Close" onclick="this.parentElement.remove()"></button>`;
  var temp = document.createElement("div");
  temp.innerHTML = tempcloseButton;
  var closeButton = temp.firstChild;

  organizationCard.insertBefore(closeButton, organizationCard.firstChild);
  // Insert The New Card Before The Configuration Buttons
  ConfigGenerator.insertBefore(organizationCard, configurationButtonsNode);
  RefreshTooltips();
}

// Validate Form Fields
function ValidateForm() {
  // Get All Input Fields That Have The needs-validation Class
  const forms = document.querySelectorAll(".needs-validation");
  let IsValid = true;

    // Loop Through Each Form & Check For Validity, Use IsValid Variable To Control
  forms.forEach(function (form) {
    if (form.value == "") {
      form.classList.add("is-invalid");
      form.addEventListener("input", function (event) {
        ValidateForm();
      }, {once: true});
      IsValid = false;
    } else {
      form.classList.remove("is-invalid");
      form.classList.add("is-valid");
    }
  });

  if (IsValid) {
    return true;
  } else {
    return false;
  }
}

// Function To Generate XML From Form Data
function GenerateXML() {
  // Get Form Data
  let FormsData = getAllFormData();
  // Initialize XML Variable
  let XMLDocument = document.implementation.createDocument("", "", null);
  let DocumentRootElement;
  let DocumentDictArray = document.createElement("array");
  // Check For Pre-Logon Conditions
  if (FormsData[0].ClientID != "" || FormsData[0].ClientSecret != "") {
    DocumentRootElement = XMLDocument.createElement("dict");

    // Create Pre-Logon Key
    let PreLogonKey = XMLDocument.createElement("key");
    PreLogonKey.innerHTML = "pre_login";
    DocumentRootElement.appendChild(PreLogonKey);

    // Create Pre-Logon Dict
    let PreLogonDict = XMLDocument.createElement("dict");
    // Create Organization Key
    let OrganizationKey = XMLDocument.createElement("key");
    OrganizationKey.innerHTML = "organization";
    PreLogonDict.appendChild(OrganizationKey);
    // Create Organization String
    let OrganizationString = XMLDocument.createElement("string");
    OrganizationString.innerHTML = FormsData[0].OrganizationName;
    PreLogonDict.appendChild(OrganizationString);
    // Create Client ID Key
    let ClientIDKey = XMLDocument.createElement("key");
    ClientIDKey.innerHTML = "auth_client_id";
    PreLogonDict.appendChild(ClientIDKey);
    // Create Client ID String
    let ClientIDString = XMLDocument.createElement("string");
    ClientIDString.innerHTML = FormsData[0].ClientID;
    PreLogonDict.appendChild(ClientIDString);
    // Create Client Secret Key
    let ClientSecretKey = XMLDocument.createElement("key");
    ClientSecretKey.innerHTML = "auth_client_secret";
    PreLogonDict.appendChild(ClientSecretKey);
    // Create Client Secret String
    let ClientSecretString = XMLDocument.createElement("string");
    ClientSecretString.innerHTML = FormsData[0].ClientSecret;
    PreLogonDict.appendChild(ClientSecretString);

    // Append Pre-Logon Dict To Root Element
    DocumentRootElement.appendChild(PreLogonDict);

    // Create Configs Key
    let ConfigsKey = XMLDocument.createElement("key");
    ConfigsKey.innerHTML = "configs";
    DocumentRootElement.appendChild(ConfigsKey);

    // Append Configs Array
    DocumentRootElement.appendChild(DocumentDictArray);
  } else {
    DocumentRootElement = DocumentDictArray;
  }

  // Loop Through Forms Data & Build Dict Elements From The Data
  FormsData.forEach(function (Form) {
    let ElemDict = XMLDocument.createElement("dict");

    // Create Organization Name Key
    let ElemOrganizationKey = XMLDocument.createElement("key");
    ElemOrganizationKey.innerHTML = "organization";
    ElemDict.appendChild(ElemOrganizationKey);

    // Create Organization Name String
    let ElemOrganizationString = XMLDocument.createElement("string");
    ElemOrganizationString.innerHTML = Form.OrganizationName;
    ElemDict.appendChild(ElemOrganizationString);

    // Create Display Name Key
    let ElemDisplayNameKey = XMLDocument.createElement("key");
    ElemDisplayNameKey.innerHTML = "display_name";
    ElemDict.appendChild(ElemDisplayNameKey);

    // Create Display Name String
    let ElemDisplayNameString = XMLDocument.createElement("string");
    ElemDisplayNameString.innerHTML = Form.DisplayName;
    ElemDict.appendChild(ElemDisplayNameString);

    // Check If Auto Connect Field Is Enabled
    if (Form.AutoConnect != "") {
      // Create Auto Connect Key
      let ElemAutoConnectKey = XMLDocument.createElement("key");
      ElemAutoConnectKey.innerHTML = "auto_connect";
      ElemDict.appendChild(ElemAutoConnectKey);

      // Create Auto Connect True Value
      let ElemAutoConnectTrue = XMLDocument.createElement("string");
      ElemAutoConnectTrue.innerHTML = Form.AutoConnect;
      ElemDict.appendChild(ElemAutoConnectTrue);
    }

    // Check Service Mode
    if (Form.ServiceMode != "") {
      // Create Service Mode Key
      let ElemServiceModeKey = XMLDocument.createElement("key");
      ElemServiceModeKey.innerHTML = "service_mode";
      ElemDict.appendChild(ElemServiceModeKey);

      // Create Service Mode String
      let ElemServiceModeString = XMLDocument.createElement("string");
      ElemServiceModeString.innerHTML = Form.ServiceMode;
      ElemDict.appendChild(ElemServiceModeString);
    }

    // Check If Override API Endpoint Is Enabled
    if (Form.OverrideAPIEndpoint != "") {
      // Create Override API Endpoint Key
      let ElemOverrideAPIEndpointKey = XMLDocument.createElement("key");
      ElemOverrideAPIEndpointKey.innerHTML = "override_api_endpoint";
      ElemDict.appendChild(ElemOverrideAPIEndpointKey);

      // Create Override API Endpoint String
      let ElemOverrideAPIEndpointString = XMLDocument.createElement("string");
      ElemOverrideAPIEndpointString.innerHTML = Form.OverrideAPIEndpoint;
      ElemDict.appendChild(ElemOverrideAPIEndpointString);
    }

    // Check If Override DoH Endpoint Is Enabled
    if (Form.OverrideDoHEndpoint != "") {
      // Create Override DoH Endpoint Key
      let ElemOverrideDoHEndpointKey = XMLDocument.createElement("key");
      ElemOverrideDoHEndpointKey.innerHTML = "override_doh_endpoint";
      ElemDict.appendChild(ElemOverrideDoHEndpointKey);

      // Create Override DoH Endpoint String
      let ElemOverrideDoHEndpointString = XMLDocument.createElement("string");
      ElemOverrideDoHEndpointString.innerHTML = Form.OverrideDoHEndpoint;
      ElemDict.appendChild(ElemOverrideDoHEndpointString);
    }

    // Check If Override WARP Endpoint Is Enabled
    if (Form.OverrideWARPEndpoint != "") {
      // Create Override WARP Endpoint Key
      let ElemOverrideWARPEndpointKey = XMLDocument.createElement("key");
      ElemOverrideWARPEndpointKey.innerHTML = "override_warp_endpoint";
      ElemDict.appendChild(ElemOverrideWARPEndpointKey);

      // Create Override WARP Endpoint String
      let ElemOverrideWARPEndpointString = XMLDocument.createElement("string");
      ElemOverrideWARPEndpointString.innerHTML = Form.OverrideWARPEndpoint;
      ElemDict.appendChild(ElemOverrideWARPEndpointString);
    }
    // Check If Support URL Is Enabled
    if (Form.SupportURL != "") {
      // Create Support URL Key
      let ElemSupportURLKey = XMLDocument.createElement("key");
      ElemSupportURLKey.innerHTML = "support_url";
      ElemDict.appendChild(ElemSupportURLKey);

      // Create Support URL String
      let ElemSupportURLString = XMLDocument.createElement("string");
      ElemSupportURLString.innerHTML = Form.SupportURL;
      ElemDict.appendChild(ElemSupportURLString);
    }

    // Check If Switch Lock Is Enabled
    if (Form.SwitchLock != "") {
      // Create Switch Lock Key
      let ElemSwitchLockKey = XMLDocument.createElement("key");
      ElemSwitchLockKey.innerHTML = "switch_lock";
      ElemDict.appendChild(ElemSwitchLockKey);

      // Create Switch Lock True Value
      let ElemSwitchLockTrue = XMLDocument.createElement("true");
      ElemDict.appendChild(ElemSwitchLockTrue);
    }

    // Append Dict To Array
    DocumentDictArray.appendChild(ElemDict);
  });
  XMLDocument.appendChild(DocumentRootElement);
  return XMLDocument;
}

function DownloadXML() {
  if (!ValidateForm()) {
    return;
  }
  GeneratedXMLDocument = GenerateXML();
  var fileName = "mdm.xml";
  var fileType = ".xml";
  var blob = new Blob(
    [new XMLSerializer().serializeToString(GeneratedXMLDocument)],
    { type: "octect/stream" }
  );
  var a = document.createElement("a");
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () {
    URL.revokeObjectURL(a.href);
  }, 1500);
}
