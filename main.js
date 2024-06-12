let del = document.getElementById('del')
let setting = document.getElementById('setting')
let moreBtns = document.getElementById('moreBtns')
let ansDisplay = document.getElementById('ansDisplay')

// Function to update settings based on local storage
function onUpdateSetting(){
    let btnsVisibility = document.getElementById('buttons-visible-toggle')
    let angleType = document.getElementById('radian-toggle')
    let trigoType = document.getElementById('inverse-trig-toggle')
    let precisionValElement = document.getElementById('precision-value')
    let inverseBtn = document.getElementById('inverseBtn')
    let deg = document.getElementById('deg')
    let rad = document.getElementById('rad')
    let allClear = document.getElementById('allClear')

    if (localStorage.getItem('allBtns')=="false") {
        btnsVisibility.classList.remove('active');
    } else {
        btnsVisibility.classList.add('active');
        if (allClear.classList.contains('simpleCalcBtns')) {
            moreBtns.click()
        }
    }

    if (localStorage.getItem('angleType')=="deg") {
        angleType.classList.remove('active');
        deg.click()
    } else {
        angleType.classList.add('active');
        rad.click()
    }

    if (localStorage.getItem('trigoType')=="simple") {
        trigoType.classList.remove('active');
        if (!invCodeExecuted) {
            inverseBtn.click()
        }
    } else {
        trigoType.classList.add('active');
        if (invCodeExecuted) {
            inverseBtn.click()
        }
    }

    precisionValElement.textContent = parseInt(localStorage.getItem('precision'));
}

document.addEventListener('DOMContentLoaded', function() {
    // Set default values if not present in local storage
    if (!localStorage.getItem('angleType')) {
        localStorage.setItem('allBtns', 'false');
        localStorage.setItem('angleType', 'deg');
        localStorage.setItem('trigoType', 'simple');
        localStorage.setItem('precision', '6');
    }

    onUpdateSetting();
});

// Function to check and adjust the font size based on input length
function checkOverflow() {  
    if (ansDisplay.value.length <= 16) {
        ansDisplay.style.fontSize = "1.6rem";
    } else if (16 < ansDisplay.value.length && ansDisplay.value.length <= 22) {
        ansDisplay.style.fontSize = "1.2rem";
    } else if (22 < ansDisplay.value.length && ansDisplay.value.length <= 33) {
        ansDisplay.style.fontSize = "0.8rem";
    } else {
        ansDisplay.style.fontSize = "0.6rem";
    } 
}

moreBtns.addEventListener('click', () => {

    if (moreBtns.firstElementChild.getAttribute('src') === "images/moreBtns.png") {
        moreBtns.firstElementChild.setAttribute("src", "images/simpleCalc.png")
        let arrTop = Array.from(document.getElementsByClassName('simpleCalcTopBtns'))
        let arrBtns = Array.from(document.getElementsByClassName('simpleCalcBtns'))
        arrTop.forEach(element => {
            element.className = "smallBtns topBtns"
        });
        arrBtns.forEach(element => {
            element.className = "smallBtns"
        });
        del.setAttribute("width", "15rem")
        setting.setAttribute("width", "14rem")
        del.parentElement.style.lineHeight = "0.5rem"
        ansDisplay.focus()
    } else {
        moreBtns.firstElementChild.setAttribute("src", "images/moreBtns.png")
        let arrTop = Array.from(document.getElementsByClassName('topBtns'))
        let arrBtns = Array.from(document.getElementsByClassName('smallBtns'))
        arrBtns.forEach(element => {
            element.className = "simpleCalcBtns"
        });
        arrTop.forEach(element => {
            element.className = "simpleCalcTopBtns"
        });
        del.setAttribute("width", "17rem")
        ansDisplay.focus()
    }
})

var isStarting = false
var lastCursor = 0

// Event listener to manage input focus and cursor position
ansDisplay.addEventListener('click', () => {
    if (ansDisplay.selectionStart == 0 && ansDisplay.value.length > 0) {
        isStarting = true
    }
})

// Function to insert text at cursor position
function insertAtCursor(value) {
    let cursorPosition = ansDisplay.selectionStart || lastCursor;
    if (isStarting) {
        cursorPosition = ansDisplay.selectionStart
    }
    const currentValue = ansDisplay.value;
    ansDisplay.value = currentValue.substring(0, cursorPosition) + value + currentValue.substring(cursorPosition);
    if (value.includes("log")) {
        ansDisplay.setSelectionRange(cursorPosition + value.length - 2, cursorPosition + value.length - 2);
    } else if (value.includes(")") && value.length > 1) {
        ansDisplay.setSelectionRange(cursorPosition + value.length - 1, cursorPosition + value.length - 1);
    } else {
        ansDisplay.setSelectionRange(cursorPosition + value.length, cursorPosition + value.length);
    }
    ansDisplay.focus()
    checkOverflow()
    lastCursor = cursorPosition + 1
    isStarting = false
}

// Function to display an error message in the answer display
function ansDisplayError() {
    ansDisplay.value = 'Invalid Input';
    setTimeout(() => {
        ansDisplay.value = ''
        ansDisplay.focus()
    }, 1000)
    lastCursor = ansDisplay.value.length
}

function calculateFactorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    } else {
        return n * calculateFactorial(n - 1);
    }
}

function permutation(n, r) {
    let result = calculateFactorial(n) / (calculateFactorial(n - r))
    return result
}

function combination(n, r) {
    let result = calculateFactorial(n) / ((calculateFactorial(n - r)) * (calculateFactorial(r)))
    return result
}

// Function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Function to convert radians to degrees
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

let isDegActive = true;

function handleDegRad(temp) {
    if (temp == "deg") {
        document.getElementById('deg').style.color = "red"
        document.getElementById('rad').style.color = "black"
    } else {
        document.getElementById('rad').style.color = "red"
        document.getElementById('deg').style.color = "black"
    }
}

function solveTrigo(val) {
    let trigoRegex = /(sin|cos|tan|sin⁻¹|cos⁻¹|tan⁻¹)(\-?\+?\d*\.?\d+)/g;
    val = val.replace(trigoRegex, function (match, func, angle) {
        let angleValue;
        if ((func == "sin" || func == "cos" || func == "tan") && isDegActive) {
            angleValue = toRadians(parseFloat(angle));
        } else {
            angleValue = parseFloat(angle);
        }

        var tempResult;
        switch (func) {
            case "sin":
                tempResult = Math.sin(angleValue);
                break;
            case "cos":
                tempResult = Math.cos(angleValue);
                break;
            case "tan":
                tempResult = Math.tan(angleValue);
                break;
            case "sin⁻¹":
                tempResult = isDegActive ? toDegrees(Math.asin(angleValue)) : Math.asin(angleValue);
                break;
            case "cos⁻¹":
                tempResult = isDegActive ? toDegrees(Math.acos(angleValue)) : Math.acos(angleValue);
                break;
            case "tan⁻¹":
                tempResult = isDegActive ? toDegrees(Math.atan(angleValue)) : Math.atan(angleValue);
                break;
            default:
                tempResult = match;
        }
        return tempResult;
    });

    return val;
}


let allbtns = document.querySelectorAll('button')
let invCodeExecuted = true;

function calculateAnswer(expr){

    if (expr.includes("log")) {
        let logRegex = /log\(([^,]+),([^)]+)\)/g;
        expr = expr.replace(logRegex, function (match, x, base) {
            x = parseFloat(x);
            base = parseFloat(base);
            if (x <= 0 || base <= 0 || base === 1) {
                throw new Error("Invalid logarithmic expression");
            }
            return Math.log(x) / Math.log(base);
        });
        expr = calculateAnswer(expr);
        return expr;
    }
    
    while (expr.includes("(")) {
        const startIndex = expr.lastIndexOf("(");
        const endIndex = expr.indexOf(")", startIndex);
        const innerExpr = expr.substring(startIndex + 1, endIndex);
        const innerResult = calculateAnswer(innerExpr);

        if (innerResult < 0 && ansDisplay.value.includes("!")) {
            throw new Error("Factorial is defined for integers only.");
        }

        expr = expr.substring(0, startIndex) + innerResult + expr.substring(endIndex + 1);
    }

    if (expr.includes("√")) {
        let squareRootRegex = /(\d*\.?\d*)?√([\+\-]?\d*\.?\d*)/g;
        expr = expr.replace(squareRootRegex, function (match, coefficient, digits) {
            if (!coefficient) coefficient = 1;
            
            if (digits.startsWith('+')) {
                digits = digits.slice(1);
            }
    
            if (digits.startsWith('-')) {
                throw new Error("Square root of a negative number is not allowed.");
            }
    
            return coefficient * Math.sqrt(parseFloat(digits));
        });
    } 

    if (expr.includes("!")) {
        let pattern = /(\d*\.\d*!)|(!\d)|(!\.\d*)/g
        if (pattern.test(ansDisplay.value)) {
            throw new Error("Factorial is defined for integers only.");
        } else {
            let factRegex = /(\d+)!/g
            expr = expr.replace(factRegex, function (match, digits) {
                return calculateFactorial(parseInt(digits, 10));
            });
        }
    }
    
    if (expr.includes("P")) {
        let permuRegex = /(\d+)P(\d+)/g
        expr = expr.replace(permuRegex, function (match, n, r) {
            return permutation(n, r);
        });
    }
    
    if (expr.includes("C")) {
        let permuRegex = /(\d+)C(\d+)/g
        expr = expr.replace(permuRegex, function (match, n, r) {
            return combination(n, r);
        });
    }
    
    if (expr.includes("ln")) {
        let lnRegex = /ln(\d*\.?\d*)/g
        expr = expr.replace(lnRegex, function (match, n) {
            if (n <= 0) {
                throw new Error("Invalid logarithmic expression");
            }

            return Math.log(n);
        });
    }
    
    if (expr.includes("sin") || expr.includes("sin⁻¹") ||
        expr.includes("cos") || expr.includes("cos⁻¹") ||
        expr.includes("tan") || expr.includes("tan⁻¹")) {
        expr = solveTrigo(expr)
    } 

    // Evaluate the final expression
    expr = eval(expr);

    return expr;
}

// Function to save the calculation history
function saveHistory(expression, answer){
    let temp = ''
    temp = temp.toString()
    expression = expression.toString()
    answer = answer.toString()

    if (expression.startsWith('(')) {
        temp = expression.slice(1, -1);
    }

    if (expression.startsWith('+')) {
        temp = expression.slice(1);
    }

    if (temp.startsWith('+')) {
        temp = temp.slice(1);
    }

    if (answer !== "Infinity" && expression !== answer && temp !== answer ) {
        let history = localStorage.getItem('ansHistory');
    
        history = history ? JSON.parse(history) : [];
    
        // Push the new item
        history.push({ expression: expression, answer: answer });
    
        // Check if history length exceeds 30
        if (history.length > 30) {
            // Remove the first item
            history.shift();
        }
    
        localStorage.setItem('ansHistory', JSON.stringify(history));
    }
}

// Event listeners to all buttons for their respective actions
Array.from(allbtns).forEach(element => {
    element.addEventListener('click', (e) => {
        if (e.target.innerText == "=") {
            try {
                let expr = ansDisplay.value.replace(/x/g, '*').replace(/\^/g, '**')
                expr = expr.replace(/\e/g, `${Math.E.toFixed(16)}`).replace(/\π/g, `${Math.PI.toFixed(16)}`)

                expr = calculateAnswer(expr)
                
                if (typeof expr === "undefined" || isNaN(expr)) {
                    ansDisplay.value = "";
                    ansDisplay.focus()
                    lastCursor = 0
                } else {
                    if (Number.isInteger(expr)) {
                        saveHistory(ansDisplay.value,expr)
                        ansDisplay.value = expr;
                        ansDisplay.focus()
                        checkOverflow()
                        lastCursor = ansDisplay.value.length
                    } else {
                        expr = parseFloat(expr);
                        let precision = parseInt(localStorage.getItem('precision')) || 6;
                        const formattedExpr = expr.toFixed(precision).replace(/\.?0+$/, '');
                        saveHistory(ansDisplay.value,formattedExpr)
                        ansDisplay.value = formattedExpr
                        if (ansDisplay.value == "Infinity") {
                            setTimeout(() => {
                                ansDisplay.value = ''
                                ansDisplay.focus()
                            }, 1500)
                        }
                        checkOverflow()
                        lastCursor = ansDisplay.value.length
                    }
                }
            } catch (error) {
                ansDisplayError()
            }
        } else if (e.target.innerText == "AC") {
            ansDisplay.value = ""
            ansDisplay.focus()
            lastCursor = 0
        } else if (e.target.innerText === "xy" || e.target.innerText === "y") {
            insertAtCursor("^")
        } else if (e.target.tagName === 'img' || e.target.closest('img') || e.target.tagName === 'i' || e.target.closest('i') || e.target.querySelector('img') || e.target.querySelector('i')) {
            // Do nothing, because the logic required for these is written below...
        } else if (e.target.innerText == "e") {
            insertAtCursor("e");
        } else if (e.target.innerText == "ex") {
            insertAtCursor("e^");
        } else if (e.target.innerText == "10x") {
            insertAtCursor("10^");
        } else if (e.target.innerText == "x") {
            if (e.target.parentElement.firstChild.textContent == 10) {
                insertAtCursor("10^");
            } else if (e.target.parentElement.firstChild.textContent == "e") {
                insertAtCursor("e^");
            } else {
                insertAtCursor("x")
            }
        }  else if (e.target.innerText == "deg") {
            isDegActive = true
            ansDisplay.focus()
        } else if (e.target.innerText == "rad") {
            isDegActive = false
            ansDisplay.focus()
        } else if (e.target.innerText == "ln") {
            insertAtCursor("ln()")
        } else if (e.target.innerText == "log") {
            insertAtCursor("log(,)")
        } else if (e.target.innerText == "sin") {
            insertAtCursor("sin()");
        } else if (e.target.innerText == "cos") {
            insertAtCursor("cos()");
        } else if (e.target.innerText == "tan") {
            insertAtCursor("tan()");
        } else if (e.target.innerText == "sin-1") {
            insertAtCursor("sin⁻¹()");
        } else if (e.target.innerText == "cos-1") {
            insertAtCursor("cos⁻¹()");
        } else if (e.target.innerText == "tan-1") {
            insertAtCursor("tan⁻¹()");
        } else if (e.target.innerText == "-1") {
            if (e.target.parentElement.firstChild.textContent == "sin") {
                insertAtCursor("sin⁻¹()");
            } else if (e.target.parentElement.firstChild.textContent == "cos") {
                insertAtCursor("cos⁻¹()");
            } else {
                insertAtCursor("tan⁻¹()");
            }
        } else if (e.target.innerText == "nPr" || e.target.innerText == "P") {
            insertAtCursor("P");
        } else if (e.target.innerText == "nCr" || e.target.innerText == "C") {
            insertAtCursor("C");
        } else if (e.target.innerText == "n" || e.target.innerText == "r") {
            if (e.target.parentElement.innerText.includes('P')) {
                insertAtCursor("P");
            } else {
                insertAtCursor("C");
            }
        } else if (e.target.innerText == "inv") {
            let btns = document.getElementsByClassName('inv')
            if (invCodeExecuted) {
                Array.from(btns).forEach(element => {
                    element.firstElementChild.style.display = "inline"
                    element.classList.add('smallFont')
                });
                e.target.style.color = "red"
                invCodeExecuted = false
            } else {
                Array.from(btns).forEach(element => {
                    element.firstElementChild.style.display = "none"
                    element.classList.remove('smallFont')
                });
                e.target.style.color = "black"
                invCodeExecuted = true
            }
        } else {
            insertAtCursor(e.target.innerText)
        }
    })
});

const divideButton = document.getElementsByClassName('fa-divide')[0].parentElement;
divideButton.addEventListener('click', function () {
    insertAtCursor("/");
});

const delButton = del.parentElement;
delButton.addEventListener('click', function () {
    let cursorPosition = ansDisplay.selectionStart || lastCursor;
    if (isStarting) {
        cursorPosition = ansDisplay.selectionStart
    }
    const currentValue = ansDisplay.value;
    if (cursorPosition > 0) {
        const currentValue = ansDisplay.value;
        ansDisplay.value = currentValue.substring(0, cursorPosition - 1) + currentValue.substring(cursorPosition);
        ansDisplay.focus()
        checkOverflow()
        ansDisplay.setSelectionRange(cursorPosition - 1, cursorPosition - 1);

    }
    lastCursor = cursorPosition - 1
    isStarting = false

});

const minusButton = document.getElementsByClassName('fa-minus')[0].parentElement;
minusButton.addEventListener('click', function () {
    insertAtCursor("-");
});

const sqrtButton = document.getElementById('sqrt');
sqrtButton.addEventListener('click', function () {
    insertAtCursor("√");
});

const piButton = document.getElementById('pi');
piButton.addEventListener('click', function () {
    insertAtCursor("π");
});

const factorial = document.getElementById('factorial');
factorial.addEventListener('click', function () {
    insertAtCursor("!");
});

// Function to open the settings modal
function openModal() {
    document.getElementById('myModal').style.display = 'flex';
}

// Function to close the settings modal
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
    onUpdateSetting();
}

const settingBtn = document.getElementById('settingBtn');
settingBtn.addEventListener('click', function () {
    openModal();
});

const toggles = document.querySelectorAll('.toggle');

// Event listeners for toggling settings and updating localStorage
toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');

        if (toggle.classList.contains('active')) {
            if (toggle.getAttribute('id') == "buttons-visible-toggle") {
                localStorage.setItem('allBtns', "true");
            } else if (toggle.getAttribute('id') == "radian-toggle") {
                localStorage.setItem('angleType', "rad");
            } else {
                localStorage.setItem('trigoType', "inverse");
            }
        } else {
            if (toggle.getAttribute('id') == "buttons-visible-toggle") {
                localStorage.setItem('allBtns', "false");
            } else if (toggle.getAttribute('id') == "radian-toggle") {
                localStorage.setItem('angleType', "deg");
            } else {
                localStorage.setItem('trigoType', "simple");
            }
        }
    });
});

const precisionValueElement = document.getElementById('precision-value');
const decreaseButton = document.getElementById('precision-decrease');
const increaseButton = document.getElementById('precision-increase');

decreaseButton.addEventListener('click', function() {
    let precisionValue = parseInt(precisionValueElement.textContent);
    if (precisionValue > 0) { 
        precisionValue--;
        precisionValueElement.textContent = precisionValue;
        localStorage.setItem('precision', precisionValue);
    }
});

increaseButton.addEventListener('click', function() {
    let precisionValue = parseInt(precisionValueElement.textContent);
    if (precisionValue < 15) { 
        precisionValue++;
        precisionValueElement.textContent = precisionValue;
        localStorage.setItem('precision', precisionValue);
    }
});

// Event listener to display the history of calculations
const history = document.getElementById('history');
let btns = document.getElementsByClassName('btns')[0];
let historyDiv = document.getElementById('historyDiv');
let allRows = document.getElementById('allRows');

history.addEventListener('click', function () {
    let rows = document.querySelectorAll('.row');
    rows.forEach(row => {
        row.style.display = 'none';
    });
    
    btns.classList.add('historyActive')
    historyDiv.style.display="block"

    let historyData = localStorage.getItem('ansHistory');

    if (historyData) {
        allRows.innerHTML = ''
        historyData = JSON.parse(historyData);
        
        // Reverse the array
        historyData.reverse();
    
        historyData.forEach(item => {
            const row = document.createElement('div');
            row.className = "rows";
            
            const expressionDiv = document.createElement('div');
            expressionDiv.className = 'expression';
            expressionDiv.textContent = item.expression;
            if (item.expression.length <= 30) {
                expressionDiv.style.fontSize = "1rem";
            } else if (item.expression.length > 30 && item.expression.length < 40) {
                expressionDiv.style.fontSize = "0.8rem";
            } else {
                expressionDiv.style.fontSize = "0.66rem";
            }
    
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer';
            answerDiv.textContent = item.answer;
            if (item.answer.length <= 16) {
                answerDiv.style.fontSize = "1.4rem";
            } else if (item.answer.length > 16 && item.answer.length < 24) {
                answerDiv.style.fontSize = "1rem";
            } else {
                answerDiv.style.fontSize = "0.7rem";
            }
    
            row.appendChild(expressionDiv);
            row.appendChild(answerDiv);
    
            allRows.appendChild(row);
        });
    } else {
        allRows.innerHTML = `<div class="rows">No history.</div>`;
    }
});

let back = document.getElementsByClassName('histBtns')[0]
let clearHistory = document.getElementsByClassName('histBtns')[1]

back.addEventListener('click', function () {
    let rows = document.querySelectorAll('.row');
    rows.forEach(row => {
        row.style.display = 'flex';
    });
    
    btns.classList.remove('historyActive')
    historyDiv.style.display="none"
});

clearHistory.addEventListener('click',()=>{
    localStorage.removeItem('ansHistory');
    allRows.innerHTML = `<div class="rows">No history.</div>`
})

// Event delegation for dynamically created .rows elements
allRows.addEventListener('click', function(event) {
    const row = event.target.closest('.rows');
    if (row && row.textContent.trim() !== 'No history.') {
        insertAtCursor(row.lastElementChild.innerHTML);
    }
});