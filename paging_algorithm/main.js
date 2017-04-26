'use strict';

/**
 * DISPLAY SIZE MUST BE AN ODD NUMBER. IF IT'S NOT, IT WILL BE FORCED INTO THE NEXT ODD NUMBER UPWARDS.
 */
function pager(elements, currentPage, elementsPerPage, displaySize) {

  elementsPerPage = (isNaN(elementsPerPage)) ? 10 : elementsPerPage;
  displaySize = (isNaN(displaySize)) ? 9 : displaySize;

  if (!(displaySize % 2)) { // Check if NOT odd
    console.log('[INFO]: displaySize of ' + displaySize + ' forced into ' + (displaySize + 1));
    displaySize++;
  }

  var page = 0;
  var pages = [];

  for (let i = 0, l = Math.floor(elements / elementsPerPage); i < l; i++) {
    pages.push(++page);
  }

  if (elements % elementsPerPage !== 0) {
    pages.push(++page);
  }

  if (pages.length > displaySize) {
    var steppedPages = paginate(currentPage - 1, displaySize, pages);
    return steppedPages;
  } else {
    return pages;
  }
}

/**
 *  
 */
function paginate(currentIndex, displaySize, pages) {

  currentIndex = (currentIndex < 0) ? 0 : currentIndex;
  currentIndex = (currentIndex > (pages.length - 1)) ? (pages.length - 1) : currentIndex;

  var splitPages = {
    left: [],
    right: [],

    populate: function () {
      if (currentIndex > 0) {
        for (let i = (currentIndex - 1); i > 0; i--) {
          this.left.unshift(pages[i]);
        }
      }

      if (currentIndex < (pages.length - 1)) {
        for (let i = (currentIndex + 1); i < (pages.length - 1); i++) {
          this.right.push(pages[i]);
        }
      }
    }
  };

  var steppedPages = {
    left: [],
    right: [],
    leftStepping: 0,
    rightStepping: 0,

    //var rightStepping = Math.ceil(rightAllPages.length / leftRightBalance[1]);

    step: function (splitPages, balance) {
      if (balance.left > 0) {
        this.leftStepping = Math.floor(splitPages.left.length / balance.left);
        console.log('LeftStep: ' + this.leftStepping);

        for (let i = (splitPages.left[splitPages.left.length - 1] + 1) - this.leftStepping; this.left.length < balance.left; i = (i - this.leftStepping)) {
          this.left.unshift(i);
        }
      }

      if (balance.right > 0) {
        this.rightStepping = Math.floor(splitPages.right.length / balance.right);
        console.log('RightStep: ' + this.rightStepping);

        for (let i = (splitPages.right[0] - 1) + this.rightStepping; this.right.length < balance.right; i = (i + this.rightStepping)) {
          this.right.push(i);
        }
      }
    }
  };

  splitPages.populate();

  var balancePercents = percent(splitPages.left.length, splitPages.right.length);

  console.log('X% = ' + balancePercents.left);
  console.log('Y% = ' + balancePercents.right);

  var balances = balance((currentIndex + 1), displaySize, pages.length, balancePercents);

  console.log('X2 int = ' + balances.leftInt + ', flo = ' + balances.leftDec);
  console.log('Y2 int = ' + balances.rightInt + ', flo = ' + balances.rightDec);

  console.log('[[LEFT]] = ' + balances.left);
  console.log('[[RIGHT]] = ' + balances.right);

  steppedPages.step(splitPages, balances);

  console.log('[[Stepped]] Left: ' + steppedPages.left);
  console.log('[[Stepped]] Right: ' + steppedPages.right);

  return steppedPages;
}

/**
 * 
 * @param {*} currentPage 
 * @param {*} wantedPages 
 * @param {*} lastPage 
 * @param {*} percentages 
 */
function balance(currentPage, wantedPages, lastPage, percentages) {

  var percBalance = {
    leftInt: 0,
    leftDec: 0,

    rightInt: 0,
    rightDec: 0,

    left: 0,
    right: 0,

    resWantedPages: (currentPage === 1 || currentPage === lastPage) ? (wantedPages - 2) : (wantedPages - 3),

    calculate: function () {
      console.log('[INFO]: WP = ' + this.resWantedPages);
      this.leftInt = tearNumber(this.resWantedPages * (percentages.left / 100)).integerVal;
      this.leftDec = tearNumber(this.resWantedPages * (percentages.left / 100)).decimalVal;

      this.rightInt = tearNumber(this.resWantedPages * (percentages.right / 100)).integerVal;
      this.rightDec = tearNumber(this.resWantedPages * (percentages.right / 100)).decimalVal;

      this.left = this.leftInt;
      this.right = this.rightInt;

      if ((this.left + this.right) !== this.resWantedPages) {
        if (this.leftDec === this.rightDec) {
          if (this.leftInt > this.rightInt) {
            this.left = this.leftInt + 1;
            this.right = this.rightInt;
          } else {
            this.left = this.leftInt;
            this.right = this.rightInt + 1;
          }
        } else {
          if (this.leftDec > this.rightDec) {
            this.left = this.leftInt + 1;
            this.right = this.rightInt;
          } else {
            this.left = this.leftInt;
            this.right = this.rightInt + 1;
          }
        }
      } else {
        this.left = this.leftInt;
        this.right = this.rightInt;
      }
    }
  };

  percBalance.calculate();

  return percBalance;
}

/**
 * 
 * @param {*} leftLength 
 * @param {*} rightLength 
 */
function percent(leftLength, rightLength) {

  var percentages = {
    left: 0,
    right: 0,

    ruleOfThree: function (length) {
      return (100 * length) / (leftLength + rightLength);
    },

    define: function () {
      this.left = percentages.ruleOfThree(leftLength);
      this.right = percentages.ruleOfThree(rightLength);
    }
  };

  percentages.define();

  return percentages;
}

function tearNumber(inputNumber) {

  var number = {
    integerVal: 0,
    decimalVal: 0,

    tear: function () {
      this.integerVal = Math.floor(inputNumber);
      this.decimalVal = (inputNumber % 1);
    }
  };

  number.tear();

  return number;
}

// var bal = balance();

// function balance() {

// }

// /**
//  * Separates list of pages into two arrays, one starting from <currentPage - 1> on to the left,
//  * another one starting from <currentPage + 1> on to the right. Then calls the stepping functions and finally
//  * concatenates their results into the outputPagesList array.
//  * 
//  * @param {Number} currentPage - Zero-based index number of the current page the user is at.
//  * @param {Number} desiredDisplaySize - Desired amount of pages to be displayed after stepping.
//  */
// function fixedPager(currentPage, desiredDisplaySize) {

//     var leftAllPages = [];
//     var rightAllPages = [];

//     var leftShownPages = [];
//     var rightShownPages = [];

//     currentPage = (currentPage < 0) ? 0 : currentPage;
//     currentPage = (currentPage > (totalPages.length - 1)) ? (totalPages.length - 1) : currentPage;

//     for (let i = (currentPage - 1); i >= 0; i--) {

//         leftAllPages.unshift(totalPages[i]);
//     }

//     for (let i = (currentPage + 1); i < totalPages.length; i++) {
//         rightAllPages.push(totalPages[i]);
//     }

//     var chosenPages = displayPages(percentDisp(desiredDisplaySize - 2, leftAllPages.length), leftAllPages, rightAllPages);

//     leftShownPages = chosenPages[0];
//     leftShownPages.push(totalPages[currentPage]);
//     rightShownPages = chosenPages[1];

//     outputPagesList = leftShownPages.concat(rightShownPages);

//     if (outputPagesList.length > desiredDisplaySize) {
//         outputPagesList.splice(1, 1);
//     }

// }

// /**
//  * Steps through each array of pages following the left/right balance determined by the percentage of
//  * pages regarding the total. Returns two arrays containing each a selection of left and right
//  * pages to display.
//  * 
//  * @param {Array} leftRightBalance - Array of 2. [0] represents left balance, [1] represents right balance.
//  * @param {Array} leftAllPages - All pages to the left of the current one.
//  * @param {Array} rightAllPages - All pages to the right of the current one.
//  */
// function displayPages(leftRightBalance, leftAllPages, rightAllPages) {

//     var leftStepping = Math.ceil(leftAllPages.length / leftRightBalance[0]);
//     var rightStepping = Math.ceil(rightAllPages.length / leftRightBalance[1]);
//     var leftChosenPages = [];
//     var rightChosenPages = [];

//     for (let i = 0; i < leftAllPages.length; i += leftStepping) {
//         leftChosenPages.push(leftAllPages[i]);
//     }

//     if (rightAllPages.length === 1) {
//         rightChosenPages.push(rightAllPages[0]);
//     } else {
//         for (let i = rightAllPages.length - 1; i > 0; i -= rightStepping) {
//             rightChosenPages.unshift(rightAllPages[i]);
//         }
//     }

//     return [leftChosenPages, rightChosenPages];
// }

// /**
//  * Determines the balance of how many pages must be shown each to the left and the right sides in regard
//  * of the desired total amount of pages to display. Returns an array of 2 where [0] represents how many
//  * pages to the right and [1] to the left.
//  * 
//  * @param {Number} displaySize - Desired amount of pages to be displayed after stepping.
//  * @param {Number} leftPagesLength - Total amount of pages to the left of the current one before stepping.
//  */
// function percentDisp(displaySize, leftPagesLength) {
//     var percentages = percent(leftPagesLength, totalPages.length);
//     var leftBalance = Math.ceil((displaySize * percentages[0]) / 100);
//     var rightBalance = Math.abs(displaySize - leftBalance);

//     if (percentages[1] >= 5) {
//         return [leftBalance + 1, rightBalance];
//     } else {
//         return [leftBalance, rightBalance + 1];
//     }
// }

// /**
//  * 
//  *
//  * @param {*} value 
//  * @param {*} total 
//  */
// function percent(value, total) {
//     var integerPercentage = Math.floor((100 * value) / total);
//     var decimalPercentage = Number(String(((100 * value) / total) % 1).charAt(2));
//     return [integerPercentage, decimalPercentage];
// }

// function setPercent(perc, tot) {
//     var integerValue = Math.floor((perc * tot) / 100);
//     var decimalValue = Number(String(((perc * tot) / 100) % 1).charAt(2));
//     return [integerValue, decimalValue];
// }

function getArg(idx) {
  return parseInt(process.argv[idx]);
}

console.log(pager(getArg(2), getArg(3), getArg(4), getArg(5)));