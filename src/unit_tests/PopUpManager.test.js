import PopUpManager from "../components/PopUpManager/PopUpManager";

var popupmanager = new PopUpManager();

describe("Validating the value return by start polling() method",()=>{
    test("start polling()",()=>{
        //Null Checks 
        expect(popupmanager.startPolling()).not.toBeNull()

        //Expected Value check
        expect(popupmanager.startPolling()).toBeUndefined()
    })
})