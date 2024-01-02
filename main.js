let del = document.getElementById('del')
let moreBtns = document.getElementById('moreBtns')
let ansDisplay = document.getElementById('ansDisplay')

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
ansDisplay.addEventListener('click', () => {
    if (ansDisplay.selectionStart == 0 && ansDisplay.value.length > 0) {
        isStarting = true
    }
})

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

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

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

function byDefaultDeg() {
    if (isDegActive) {
        document.getElementById('deg').style.color = "red"
        document.getElementById('rad').style.color = "black"
    }
}
byDefaultDeg()

function solveTrigo(val) {
    let trigoRegex = /(sin|cos|tan|sin⁻¹|cos⁻¹|tan⁻¹)\((\d+(\.\d+)?)\)/g;
    val = val.replace(trigoRegex, function (match, func, angle) {
        var angleValue;
        if (isDegActive) {
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
                tempResult = isDegActive ? toDegrees(Math.asin(angle)) : Math.asin(angle);
                break;
            case "cos⁻¹":
                tempResult = isDegActive ? toDegrees(Math.acos(angle)) : Math.acos(angle);
                break;
            case "tan⁻¹":
                tempResult = isDegActive ? toDegrees(Math.atan(angle)) : Math.atan(angle);
                break;
            default:
                tempResult = match;
        }
        return tempResult;
    });

    return val;
}

function isValidInput(input) {
    let pattern = /^[\d.]+$/;
    return pattern.test(input);
}

function decimalToFraction(decimal) {
    if (!isValidInput(decimal)) {
        return -1;
    }
    let numerator = decimal;
    let denominator = 1;

    while (numerator % 1 !== 0) {
        numerator *= 10;
        denominator *= 10;
    }

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(numerator, denominator);

    return `${numerator / divisor}/${denominator / divisor}`;
}

let allbtns = document.querySelectorAll('button')
let invCodeExecuted = true;

Array.from(allbtns).forEach(element => {
    element.addEventListener('click', (e) => {
        if (e.target.innerText == "=") {
            try {
                let expr = ansDisplay.value.replace(/x/g, '*').replace(/\^/g, '**')
                expr = expr.replace(/\e/g, `${Math.E.toFixed(7)}`).replace(/\π/g, `${Math.PI.toFixed(7)}`)
                if (ansDisplay.value.includes("√")) {
                    let squareRootRegex = /√(\d+)/g;
                    expr = expr.replace(squareRootRegex, function (match, digits) {
                        return Math.sqrt(parseInt(digits, 10));
                    });
                    expr = eval(expr)
                } else if (ansDisplay.value.includes("!")) {
                    let pattern = /^-\d+!(.+)?$/g
                    if (pattern.test(ansDisplay.value)) {
                        expr = eval(expr);
                    } else {
                        let factRegex = /(\d+)!/g
                        expr = expr.replace(factRegex, function (match, digits) {
                            return calculateFactorial(parseInt(digits, 10));
                        });
                        expr = eval(expr);
                    }
                } else if (ansDisplay.value.includes("P")) {
                    let permuRegex = /(\d+)P(\d+)/g
                    expr = expr.replace(permuRegex, function (match, n, r) {
                        return permutation(n, r);
                    });
                    expr = eval(expr);
                } else if (ansDisplay.value.includes("C")) {
                    let permuRegex = /(\d+)C(\d+)/g
                    expr = expr.replace(permuRegex, function (match, n, r) {
                        return combination(n, r);
                    });
                    expr = eval(expr);
                } else if (ansDisplay.value.includes("ln")) {
                    let lnRegex = /ln\((\d+)\)/g
                    expr = expr.replace(lnRegex, function (match, n) {
                        return Math.log(n);
                    });
                    expr = eval(expr);
                } else if (ansDisplay.value.includes("log")) {
                    let lnRegex = /log\((\d+),(\d+)\)/g
                    expr = expr.replace(lnRegex, function (match, x, base) {
                        return Math.log(x) / Math.log(base);;
                    });
                    expr = eval(expr);
                } else if (ansDisplay.value.includes("sin") || ansDisplay.value.includes("sin⁻¹") ||
                    ansDisplay.value.includes("cos") || ansDisplay.value.includes("cos⁻¹") ||
                    ansDisplay.value.includes("tan") || ansDisplay.value.includes("tan⁻¹")) {
                    expr = solveTrigo(ansDisplay.value)
                    expr = eval(expr)
                } else {
                    expr = eval(expr);
                }
                if (typeof expr === "undefined" || isNaN(expr)) {
                    ansDisplay.value = "";
                    ansDisplay.focus()
                    lastCursor = 0
                } else {
                    if (Number.isInteger(expr)) {
                        ansDisplay.value = expr;
                        ansDisplay.focus()
                        checkOverflow()
                        lastCursor = ansDisplay.value.length
                    } else {
                        const formattedExpr = expr.toFixed(5).replace(/\.?0+$/, '');
                        ansDisplay.value = formattedExpr
                        ansDisplay.focus()
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
        } else if (e.target.innerText == "x/y") {
            let temp = decimalToFraction(ansDisplay.value)
            ansDisplay.value = ""
            if (temp != -1) {
                insertAtCursor(temp)
            } else {
                ansDisplayError()
            }
        } else if (e.target.innerText == "deg") {
            isDegActive = true
            ansDisplay.value = ""
            ansDisplay.focus()
            lastCursor = 0
        } else if (e.target.innerText == "rad") {
            isDegActive = false
            ansDisplay.value = ""
            ansDisplay.focus()
            lastCursor = 0
        } else if (e.target.innerText == "ln") {
            insertAtCursor("ln()")
        } else if (e.target.innerText == "log") {
            ansDisplay.value = 'log(number,base)';
            setTimeout(() => {
                ansDisplay.value = ''
                insertAtCursor("log(,)");
            }, 1200)
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

function openModal() {
    document.getElementById('myModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}
const info = document.getElementById('info');
info.addEventListener('click', function () {
    openModal();
});
