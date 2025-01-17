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
            if(x.elements[i].id == "" || x.elements[i].id == null || x.elements[i].id == undefined){
                continue;
            }
            else{
                let ID;
                let Value;
                // Check For Toggles/Switches & Their Corresponding States
                if (x.elements[i].type == "checkbox") {
                    ID = x.elements[i].id;
                    Value = x.elements[i].checked;
                }
                // Elements That Arent Switches
                else{
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