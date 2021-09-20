// Slider ==============================

let slideIndex = 0;
let slider = document.querySelector('.slider-line');
let button = document.querySelectorAll('.transition');
let items = document.querySelectorAll('.calculator');
let itemSize = document.querySelector('.slider-window').offsetWidth;

function changeSlide(n) {
    slider.style.left = n + 'px';
}

function next() {
    if (!isRightEndOfSlider()) {
        button[0].style.color = '#fff';
        changeSlide(slideIndex -= itemSize);
    }
    isRightEndOfSlider();
}

function prev() {
    if (!isLeftEndOfSlider()) {
        button[1].style.color = '#fff';
        changeSlide(slideIndex += itemSize);
    }  
    isLeftEndOfSlider()
}

function isLeftEndOfSlider() {
    if (slideIndex == 0) {
        button[0].style.color = '#696969';
        return true;
    }
    else {
        return false;
    }
}

function isRightEndOfSlider() {
    if (slideIndex == -(items.length-1)*500) {
        button[1].style.color = '#696969';
        return true;
    }
    else {
        return false;
    }
}

isRightEndOfSlider();
isLeftEndOfSlider();


// Calculator ==========================
let exp = document.querySelectorAll('.expression');
let isLastButtonPressed = 0;

function getIndex() {
    return Math.abs(slideIndex/itemSize);
}

function add(symbol) {
    if(exp[getIndex()].value == '0' || isLastButtonPressed == 1) {
        isLastButtonPressed = 0;
        exp[getIndex()].value = '';
    }
    exp[getIndex()].value += symbol;
}

function clean() {
    exp[getIndex()].value = "";
}

function decrement() {
    exp[getIndex()].value = 
    exp[getIndex()].value.substring(0, exp[getIndex()].value.length-1);
}

function calc() {
    exp[getIndex()].value = evaluate(exp[getIndex()].value);
}

function evaluate(string) {
    isLastButtonPressed = 1;

    let numbers = [];
    let operations = [];
    let tokens = string.match(/(\d+(\.?\d+)?)|[!()*/+-^]|(pi)|(e)|(sqrt)|(sin)|(cos)|(tan)|(ln)|(log)/g);

    tokens.forEach(function (element, index){
        let num = element.match(/\d+(\.?\d+)?/g);
        let op = element.match(/[!*/+-^]|(sqrt)|(sin)|(cos)|(tan)|(ln)|(log)/g);

        if(element == 'pi') {
            numbers.push(Math.PI);
        }
        if(element == 'e') {
            numbers.push(Math.E);
        }
        if(element == '-') {
            if ((index == 0) || (tokens[index-1] == '(') || (/[*/+-]/.test(tokens[index-1]))) {
                operations.push('M');//unary minus
                return;
            }
        }
        if (element == '(') {
            operations.push(element);
            return;
        }
        if (element == ')') {
            while (operations[operations.length-1] != '(') {
                numbers.push(Compute(numbers, operations.pop()));
            }
            operations.pop();
            return;
        }
        if (element == num) {
            numbers.push(element);
            return;
        }
        if (element == op) { 
            if ((operations.length != 0) && (Priority(element) <= Priority(operations[operations.length-1]))) {
                numbers.push(Compute(numbers, operations.pop()));
            }
            operations.push(element);
            return;
        }
    });

    while (operations.length != 0) {
        numbers.push(Compute(numbers, operations.pop()));
    }

    return numbers.pop();
}

function Priority(operation) {
    switch (operation) {
        case '(':
            return 0;
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        case '^':
            return 3;
        case 'sin':
        case 'cos':
        case 'tan':
        case 'ln':
        case 'log':
        case 'sqrt':
            return 4;
        case '!':
        case 'M':
            return 5;
        default:
            return 0;                  
    }
}

function Compute(numbers, operation) {
    let a = parseFloat(numbers.pop());
    let b;
    switch (operation) {
        case '+':
            b = parseFloat(numbers.pop());
            return b + a;
        case '-':
            b = parseFloat(numbers.pop());
            return b - a;
        case '*':
            b = parseFloat(numbers.pop());
            return b * a;
        case '/':
            b = parseFloat(numbers.pop());
            return b / a;
        case '^':
            b = parseFloat(numbers.pop());
            return Math.pow(b, a);
        case 'sin':
            return Math.sin(a);
        case 'cos':
            return Math.cos(a);
        case 'tan':
            return Math.tan(a);
        case 'ln':
            return Math.log(a);
        case 'log':
            return Math.log10(a);
        case 'sqrt':
            return Math.sqrt(a);
        case '!':
            return factorial(a);
        case 'M':
            return -a;
        default:
            return 0;
    }
}

function factorial(n){
    var result = 1;
    while(n){
        result *= n--;
    }
    return result;
}

