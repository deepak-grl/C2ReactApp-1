function mouseBusy(isBusy) {
    if (isBusy) {
        document.body.style.cursor = "wait";
        document.getElementById("root").style.pointerEvents = 'none';
    }

    else {
        document.body.style.cursor = "default";
        document.getElementById("root").style.pointerEvents = "auto";
    }
}

function setPlotButtonCursor_Wait(isBusy) {
    mouseBusy(isBusy);
    var len = document.getElementsByClassName("plot-toolbar-btn").length;
    var cursorStyle = "";
    if (isBusy) {
        cursorStyle = "wait";
    }
    for (var i = 0; i < len; i++) {
        document.getElementsByClassName("plot-toolbar-btn")[i].style.cursor = cursorStyle;
    }
}

function scrollToPacket(val) {
    //document.querySelector('.ccPacketScrollToBottom div').scrollTop = val;
}

function setPlotCursor(cursorType) {
    if (cursorType === 0) {
        document.getElementById("plot-container").className = "";
    }
    else if (cursorType === 1) {
        document.getElementById("plot-container").className = "zoom-in";
    }
    else if (cursorType === 2) {
        document.getElementById("plot-container").className = "zoom-out";
    }
    else if (cursorType === 3) {
        document.getElementById("plot-container").className = "pan";
    }
    else if (cursorType === 4) {
        document.getElementById("plot-container").className = "wait";
    } else {
        document.getElementById("plot-container").className = "";           // if value is grater than 4.
    }
}

function hideAndShowByClassName() {              // if we are using same in multiple times we can pass 2 classNames as parameter.
    document.getElementsByClassName('custom_dropdown_btn')[0].addEventListener('click', function () {
        var isHidden = document.getElementsByClassName('custom-dropdown-items-container')[0].classList.contains('hidden');
        if (isHidden) {
            document.getElementsByClassName('custom-dropdown-items-container')[0].classList.remove('hidden');
        } else {
            document.getElementsByClassName('custom-dropdown-items-container')[0].classList.add('hidden');
        }
    })
}

function getVerticalMarkerTime(zoomStart, zoomStop, absSignalStart, absSignalStop, markerPercent) {
    var delta;
    var signalStartTime;
    if (zoomStart && zoomStop !== absSignalStop) {
        zoomStart = (zoomStart > 0) ? zoomStart : 0;
        delta = zoomStop - zoomStart;
        signalStartTime = zoomStart;
    } else {
        delta = absSignalStop - absSignalStart;
        signalStartTime = absSignalStart;
    }
    var newTime = (delta * markerPercent) / 100;
    newTime = newTime + signalStartTime;
    return newTime;
    //var res = timeFormatter(newTime);
    //return res;
}

function timeFormatter(newTime) {
    // Formating Time to => (12:345:678:910) 
    var res = "";
    newTime = newTime.toFixed(9);
    var timeArr = newTime.split('.');
    if (timeArr[1] !== undefined) {
        for (var i = 0; i < timeArr[1].length; i++) {
            res = res + timeArr[1][i];
            if ((i + 1) % 3 === 0 && i !== 8) {
                res = res + ':'
            }
        }
    }
    return res = timeArr[0] + '.' + res;
}

var checkVerticalZoomActive;
var counter = 0;
function verticalZoomArea_CustomDiv(GRAPH_YAXIS_WIDTH, isVerticalZoomActive) {
    var mouseDown = false;
    var clientY_val = 0;
    var canvasArr = document.getElementsByClassName('chartjs-render-monitor');
    checkVerticalZoomActive = isVerticalZoomActive;

    function mouseDownFn(element, e, isVZoomActive) {
        if (isVZoomActive) {
            var node = document.createElement("div");
            node.setAttribute("id", "verticalZoomArea_div")
            element.parentElement.appendChild(node);

            mouseDown = true;
            clientY_val = e.clientY;
            document.getElementById('verticalZoomArea_div').style.top = e.clientY + 'px';
            document.getElementById('verticalZoomArea_div').style.width = document.getElementsByTagName('canvas')[0].offsetWidth - GRAPH_YAXIS_WIDTH + 'px';
        }
    }

    function mouseOverFn(element, e, isVZoomActive) {
        if (mouseDown && isVZoomActive) {
            if (e.clientY > clientY_val) {
                document.getElementById('verticalZoomArea_div').style.height = e.clientY - clientY_val + 'px';
            } else {
                document.getElementById('verticalZoomArea_div').style.top = e.clientY + 'px';
                document.getElementById('verticalZoomArea_div').style.height = clientY_val - e.clientY + 'px';
            }
        }
    }

    function mouseUpFn(ele, e, isVZoomActive) {
        if (isVZoomActive) {
            clientY_val = 0;
            mouseDown = false;
            var element = document.getElementById("verticalZoomArea_div");
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
    }

    var countloop = 0;
    Array.from(canvasArr).forEach(function (element) {
        countloop = countloop + 1;
        if (counter === 0 && checkVerticalZoomActive) {
            element.addEventListener('mousedown', function (e) {
                mouseDownFn(element, e, checkVerticalZoomActive);
            });

            element.addEventListener('mousemove', function (e) {
                mouseOverFn(element, e, checkVerticalZoomActive);
            });

            element.addEventListener('mouseup', function (e) {
                mouseUpFn(element, e, checkVerticalZoomActive);
            });

            if (countloop === canvasArr.length) {
                counter = counter + 1;
            }
        }
    });
}


function customNavbarOnSpitterMoves(PLOTTOOLBAR_ICON_TOTAL_WIDTH) {
    var floatingPlotTollbarHeight = document.getElementsByClassName('chart-plottoolbar')[0].offsetHeight;
    var widthBetweenSplitter = document.getElementsByClassName("chart-container")[0].offsetWidth;
    //var navBarWidth = document.getElementsByClassName('chart-plottoolbar')[0].offsetWidth;
    if (widthBetweenSplitter < PLOTTOOLBAR_ICON_TOTAL_WIDTH) {

        document.getElementsByClassName('chart-plottoolbar')[0].classList.add("toggle_navbar_item");
        // document.getElementById('navbar_icon_img').style.display = 'block';

        /* toggle bar position changed because of that markers,plot data height changed --- starts */
        // document.getElementsByClassName('plot-toggle')[0].classList.add('toolbar-height-toggle-mode');
        // document.getElementsByClassName("ccline_Chart_spliter")[0].classList.add('chart-height-toolbarmode');
        // document.getElementsByClassName("chart-container")[0].classList.add('plot-height-toolbarmode');
        // if (document.getElementsByClassName("marker-one")[0] !== undefined) {
        //     document.getElementsByClassName("marker-one")[0].classList.add('marker-height-toolbarmode');
        //     document.getElementsByClassName("marker-two")[0].classList.add('marker-height-toolbarmode');
        // }

        /* toggle bar position changed because of that markers,plot data height changed --- ends*/
        if (document.getElementById('zoomHorizontalDragedArea')) {
            document.getElementById('zoomHorizontalDragedArea').style.marginTop = floatingPlotTollbarHeight + 40 + 'px';     // when zoomIn button clicked glasspan zIndex is not letting to click on other buttons.
        }
    }
    else {
        document.getElementsByClassName('chart-plottoolbar')[0].classList.remove("toggle_navbar_item");

        /* toggle bar position changed because of that markers,plot data height changed  --- starts */
        // document.getElementsByClassName('plot-toggle')[0].classList.remove('toolbar-height-toggle-mode');
        // document.getElementsByClassName("ccline_Chart_spliter")[0].classList.remove('chart-height-toolbarmode');
        // document.getElementsByClassName("chart-container")[0].classList.remove('plot-height-toolbarmode');
        // if (document.getElementsByClassName("marker-one")[0] !== undefined) {
        //     document.getElementsByClassName("marker-one")[0].classList.remove('marker-height-toolbarmode');
        //     document.getElementsByClassName("marker-two")[0].classList.remove('marker-height-toolbarmode');
        // }
        /* toggle bar position changed because of that markers,plot data height changed  --- ends */

        var hideImage = document.getElementsByClassName('hideImage')[0];
        if (hideImage) {
            hideImage.classList.remove('hideImage');
        }
        if (document.getElementsByClassName('hideToolbar')[0]) {
            document.getElementsByClassName('chart-plottoolbar')[0].classList.remove("hideToolbar");
        }
        document.getElementById('navbar_icon_img').style.display = 'none';

        if (document.getElementById('zoomHorizontalDragedArea')) {
            document.getElementById('zoomHorizontalDragedArea').style.marginTop = '40px';     // when zoomIn button clicked glasspan zIndex is not letting to click on other buttons.
        }
    }
}

function resizeSplitterPaneToNormalMode() {
    document.querySelector(".plotSplitPane > .Pane1").style.width = "99.5%";
    document.getElementsByClassName('chart-plottoolbar')[0].classList.remove("toggle_navbar_item");
}

function scrollToTopOnMoiDropDownChange() {
    var setScrollBarToBottom = setInterval(() => {
        var fivePortScrollBarAlignBottom = document.querySelector('.overflow-for-five-port');
        if (fivePortScrollBarAlignBottom !== null && fivePortScrollBarAlignBottom !== undefined) {
            document.getElementsByClassName("overflow-for-five-port")[0].scrollHeight = document.getElementsByClassName("overflow-for-five-port")[0].scrollHeight + 24
            fivePortScrollBarAlignBottom.scrollTop = fivePortScrollBarAlignBottom.scrollHeight
        }
    }, 30);

    setTimeout(() => {
        clearInterval(setScrollBarToBottom)
    }, 500);
}

function replaceAll(str, find, replace) {
    if (str) {
        if (find === ".") {  //dot can't be used normally in regex
            return str.split(find).join(replace);
        }
        return str.replace(new RegExp(find, 'g'), replace); // this is faster
    }
    return "";
}

function objToArray(obj) {
    var dict = {};
    obj.map((item) => { return dict[item] = item });
    return Object.keys(dict);
}

function isArrayEmpty(array) {
    if (!Array.isArray(array) || !array.length) {
        return true;
    }
    return false;
}

function firstLetterUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function strToBool(val) {
    return (val === 'true');
}
function listenScrollEvent(e) {
    return e.stopPropagation();
}

function xmlToJson(file, callback) {
    var xmlobject;
    var reader = new FileReader();
    var convert = require('xml-js');
    reader.onload = function (event) {
        xmlobject = event.target.result;
        var convertedJson = convert.xml2json(xmlobject, { compact: true, spaces: 4 });
        var parsedJson = JSON.parse(convertedJson);
        callback(parsedJson);
    };
    reader.readAsText(file);
}
function getWidthOfText(txt, fontname = "'Varela Round', sans-serif", fontsize = "14px") {
    if (getWidthOfText.c === undefined) {
        getWidthOfText.c = document.createElement('canvas');
        getWidthOfText.c.id = "canvasWidthOfText";
        getWidthOfText.ctx = getWidthOfText.c.getContext('2d');
    }
    getWidthOfText.ctx.font = fontsize + ' ' + fontname;
    return getWidthOfText.ctx.measureText(txt).width;
}
function removeCanvasCreatedToCalculateTextWidth() {
    var ele = document.getElementById("canvasWidthOfText");
    if (getWidthOfText.c !== undefined) {
        ele.parentNode.removeChild(ele);
    }
}
function getCurrentDateAndTime() {
    var dt = new Date();
    let year = dt.getFullYear();
    let month = ((dt.getMonth() + 1) < 10 ? '0' : '') + dt.getMonth();
    let day = ((dt.getDate() + 1) < 10 ? '0' : '') + dt.getDate();
    let hour = ((dt.getHours() + 1) < 10 ? '0' : '') + dt.getHours();
    let minute = ((dt.getMinutes() + 1) < 10 ? '0' : '') + dt.getMinutes();
    let secoond = ((dt.getSeconds() + 1) < 10 ? '0' : '') + dt.getSeconds();
    return year + '' + month + '' + day + '_' + hour + '' + minute + '' + secoond;
}

module.exports = {
    replaceAll: replaceAll, objToArray, isArrayEmpty, firstLetterUpperCase, strToBool, mouseBusy, setPlotButtonCursor_Wait, getVerticalMarkerTime, timeFormatter, setPlotCursor, listenScrollEvent, xmlToJson, getWidthOfText, removeCanvasCreatedToCalculateTextWidth, scrollToPacket, verticalZoomArea_CustomDiv, customNavbarOnSpitterMoves, scrollToTopOnMoiDropDownChange, hideAndShowByClassName, getCurrentDateAndTime, resizeSplitterPaneToNormalMode
}
