import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calculator button');
    let currentInput = '';
    let operator = '';
    let firstOperand = null;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            handleInput(value);
        });
    });

    async function handleInput(value) {
        if (value >= '0' && value <= '9' || value === '.') {
            currentInput += value;
            display.value = currentInput;
        } else if (['+', '-', '*', '/'].includes(value)) {
            if (firstOperand === null) {
                firstOperand = parseFloat(currentInput);
                operator = value;
                currentInput = '';
            } else {
                await performCalculation();
                operator = value;
            }
        } else if (value === '=') {
            await performCalculation();
        } else if (value === 'C') {
            clear();
        }
    }

    async function performCalculation() {
        if (firstOperand !== null && currentInput !== '') {
            const secondOperand = parseFloat(currentInput);
            try {
                const result = await backend.calculate(firstOperand, operator, secondOperand);
                display.value = result;
                firstOperand = result;
                currentInput = '';
            } catch (error) {
                display.value = 'Error';
                console.error('Calculation error:', error);
            }
        }
    }

    function clear() {
        currentInput = '';
        operator = '';
        firstOperand = null;
        display.value = '';
    }
});
