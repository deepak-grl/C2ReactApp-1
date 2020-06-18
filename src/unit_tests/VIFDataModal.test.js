import LoadXmlVIFFile from "../components/PanelProductCapability/LoadXmlVIFFile";
import { VIFDataModal, VIFElement } from "../modals/VIFDataModal";
import * as Constants from "../Constants/index"
import * as VIF_ENUMS from "../Constants/VIF_ENUMS";
import { InputGroup } from "react-bootstrap";

var loadXmlVifFile = new LoadXmlVIFFile();
var vifDataModal = new VIFDataModal();

// var fileJsonObj = JSON.parse(NxpVifData);
// var filekeys = Object.keys(fileJsonObj);
// var fileJsonEle = "";
// for (let x = 0; x < filekeys.length; x++) {
//     let key = filekeys[x];
//     fileJsonEle = fileJsonObj[key];
// }

var vifProductType = { "_attributes": { "value": "0" }, "_text": "Port Product" };
var vifProductTypeObj = JSON.parse(JSON.stringify(vifProductType));
var sopCapable = {"_attributes":{"value":"true"}};
var sopCapableObj = JSON.parse(JSON.stringify(sopCapable));

var vifProductTypeElement = new VIFElement(VIF_ENUMS.VIF_Product_Type, vifProductTypeObj, null, null, Constants.TYPE_FILE);
var sopCapableEle = new VIFElement(VIF_ENUMS.SOP_Capable, sopCapableObj, null, null, Constants.TYPE_FILE);

describe("Validating the value returned by getValue() method", () => {
    test("getValue()", () => {
        //Null Test for spec value and decoded value
        expect(vifProductTypeElement.getValue()).not.toBeNull();
        expect(sopCapableEle.getValue()).not.toBeNull();
        expect(sopCapableEle.getValue()).not.toBeNaN();

        //Expected Value Test
        expect(vifProductTypeElement.getValue()).toBe(0);
        expect(sopCapableEle.getValue()).toBe(1);
    })
});

describe("Validating the value returned by getVIFElementDecodedValue() method", () => {
    test("getVIFElementDecodedValue()", () => {
        //Null Checks for spec value and decoded value
        expect(vifProductTypeElement.getVIFElementDecodedValue()).not.toBeNull();
        expect(sopCapableEle.getVIFElementDecodedValue()).toBeNull();

        //Expected Value Checks
        expect(vifProductTypeElement.getVIFElementDecodedValue()).toBe("Port Product");
    })
});

describe("Validating the value returned by getLocalProperty() method", () => {
    test("getLocalProperty()", () => {
        //Null Checks for spec value and decoded value
        expect(vifProductTypeElement.getLocalProperty()).not.toBeNull();
        expect(sopCapableEle.getLocalProperty()).not.toBeNull();

        //Expected Value Checks
        expect(vifProductTypeElement.getLocalProperty()).toBe("Port Product");
    })
});
