import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-standard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standard.component.html',
  styleUrl: './standard.component.css',
})
export class StandardComponent {
  currentTime: Date;
  lhs = 0;
  operand: any;
  rhs = 0;
  operandActivate = false;
  resultStatus = false;
  resultValue: any = 0;
  expression: any = '';
  lhsFlag = false;
  rhsFlag = false;
  decimalFlag = false;
  temp ="";
  lhsDecimalCount = 0;
  rhsDecimalCount = 0;
  displayValue: string = '';
  makeLhsNegative = false;
  makeRhsNegative = false;
  history = [];
  showHistory = false;

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    const keyPressed = event.key;

    // Check if the key pressed corresponds to a button on your calculator
    if (/[0-9]/.test(keyPressed)) {
      this.handleNumberClick(keyPressed);
    } else if (/[+\-*/=]/.test(keyPressed)) {
      this.feedOperand(keyPressed);
    } else if (keyPressed === 'Enter') {
      this.getResult();
    } else if (keyPressed.toLowerCase() === 'c') {
      this.clear();
    } else if (keyPressed.toLowerCase() === 'h') {
      this.toggleHistory();
    }
  }
  handleNumberClick(value: string): void {
    // Handle the button click logic
    // Update the displayValue, perform calculations, etc.
    this.displayValue += value;
    //console.log('button pressed', value);
    let floatValue = parseFloat(value);
    this.feedNumber(floatValue);
  }

  clear() {
    this.lhs = 0;
    this.operand = 0;
    this.rhs = 0;
    this.operandActivate = false;
    this.resultStatus = false;
    this.resultValue = 0;
    this.expression = '';
    this.lhsFlag = false;
    this.rhsFlag = false;
    this.temp = '';
    this.lhsDecimalCount = 0;
    this.rhsDecimalCount = 0;
    this.decimalFlag = false;
    this.makeLhsNegative = false;
    this.makeRhsNegative = false;
    
  }

  getResult() {
    if (this.lhsDecimalCount !== 0) {
      let divisor = Math.pow(10, this.lhsDecimalCount);
      console.log('Divisor:', divisor);
      this.lhs = this.lhs / divisor;
      this.lhsDecimalCount = 0;
    }
    if (this.rhsDecimalCount !== 0) {
      let divisor = Math.pow(10, this.rhsDecimalCount);
      console.log('Divisor:', divisor);
      this.rhs = this.rhs / divisor;
      this.rhsDecimalCount = 0;
    }
    if (this.makeLhsNegative == true) {
      this.lhs = -1 * this.lhs;
      this.makeLhsNegative = false;
    }
    if (this.makeRhsNegative == true) {
      this.rhs = -1 * this.rhs;
      this.makeRhsNegative = false;
    }
    if (this.operand == '/') {
      console.log('Division');

      this.resultValue = this.lhs / this.rhs;
    } else if (this.operand == '+') {
      console.log('Addition');
      this.resultValue = this.lhs + this.rhs;
    } else if (this.operand == '-') {
      console.log('subtraction');

      this.resultValue = this.lhs - this.rhs;
    } else if (this.operand == 'x' || this.operand == '*') {
      console.log('Multiplication');

      this.resultValue = this.lhs * this.rhs;
    } else {
      this.resultValue = 'Unprocessable';
    }
    this.temp += this.expression;
    this.temp += '=';
    this.temp += this.resultValue;
    this.temp+="   ";
    this.history.push(this.temp);
    console.log('result value ', this.resultValue);
    //console.log("History ",this.history);
  }

  ngOnInit() {
    this.getCurrentTime();
  }

  getCurrentTime() {
    this.currentTime = new Date();
  }

  feedNumber(value) {
    if (this.operandActivate == false) {
      if (this.decimalFlag == true) {
        this.lhsDecimalCount++;
      }
      if (this.lhsFlag == false) {
        this.lhs = value;
        this.lhsFlag = true;
      } else {
        this.lhs = this.lhs * 10 + value;
      }

      const lhsString = value.toString();
      this.expression += lhsString;
    } else {
      if (this.decimalFlag == true) {
        this.rhsDecimalCount++;
      }
      if (this.rhsFlag == false) {
        this.rhs = value;
        this.rhsFlag = true;
      } else {
        this.rhs = this.rhs * 10 + value;
      }

      const rhsString = value.toString();
      this.expression += rhsString;
    }
    console.log(
      `buttonValue: ${value} lhsFlag: ${this.lhsFlag} rhsFlag: ${this.rhsFlag} lhsValue: ${this.lhs} rhsValue: ${this.rhs} operandFlag: ${this.operandActivate} operandValue: ${this.operand}`
    );
  }

  feedOperand(value) {
    if (this.rhsFlag == true && this.operandActivate == true) {
      // this is for chained reaction
      console.log('Chained reaction');
      this.getResult();
      this.lhs = this.resultValue;
      this.rhsFlag = false;
    }
    if (
      //this is for negative lhs value
      this.lhsFlag == false &&
      value == '-' &&
      this.operandActivate == false
    ) {
      this.makeLhsNegative = true;
      console.log('LHS negated');
    }
    if (
      //this for negative rhs value
      (this.rhsFlag = false && value == '-' && this.operandActivate == true)
    ) {
      this.makeRhsNegative = true;
      console.log('Rhs negated');
    } else {
      //this for normal operand business
      this.operand = value;
      this.operandActivate = true;
      this.expression += value;
      console.log('button pressed: ', value);
      this.decimalFlag = false;
    }
  }

  myDelayedFunction() {
    console.log(this.temp);
  }

  toggleDecimal() {
    if (this.decimalFlag == true) {
      setTimeout(this.myDelayedFunction, 10000);
    } else {
      this.decimalFlag = true;
      this.expression += '.';
    }
  }
}
