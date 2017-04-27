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

    step: function (splitPages, balance) {
      if (balance.left > 0) {
        this.leftStepping = Math.floor(splitPages.left.length / balance.left);
        for (let i = (splitPages.left[splitPages.left.length - 1] + 1) - this.leftStepping; this.left.length < balance.left; i = (i - this.leftStepping)) {
          this.left.unshift(i);
        }
      }

      if (balance.right > 0) {
        this.rightStepping = Math.floor(splitPages.right.length / balance.right);
        for (let i = (splitPages.right[0] - 1) + this.rightStepping; this.right.length < balance.right; i = (i + this.rightStepping)) {
          this.right.push(i);
        }
      }
    }
  };

  splitPages.populate();

  var balancePercents = percent(splitPages.left.length, splitPages.right.length);

  var balances = balance((currentIndex + 1), displaySize, pages.length, balancePercents);

  steppedPages.step(splitPages, balances);

  steppedPages.left.unshift(pages[0]);
  steppedPages.right.push(pages[pages.length - 1]);  

  if (currentIndex > 0 && currentIndex < pages[pages.length]) {    
    steppedPages.left.push(pages[currentIndex]);
  }

  return steppedPages.left.concat(steppedPages.right);
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
      this.leftInt = tearNumber(this.resWantedPages * (percentages.left / 100)).integerVal;
      this.leftDec = tearNumber(this.resWantedPages * (percentages.left / 100)).decimalVal;

      this.rightInt = tearNumber(this.resWantedPages * (percentages.right / 100)).integerVal;
      this.rightDec = tearNumber(this.resWantedPages * (percentages.right / 100)).decimalVal;

      var results = {
        left: this.leftInt,
        right: this.rightInt
      };

      if ((results.left + results.right) !== this.resWantedPages) {
        if (this.leftDec === this.rightDec) {
          if (results.left > results.right) {
            results.left++;
          } else {
            results.right++;
          }
        } else {
          if (this.leftDec > this.rightDec) {
            results.left++;            
          } else {
            results.right++;
          }
        }
      }

      return results;
    }
  };

  return percBalance.calculate();
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
      this.left = this.ruleOfThree(leftLength);
      this.right = this.ruleOfThree(rightLength);
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

function getArg(idx) {
  return parseInt(process.argv[idx]);
}

console.log(pager(getArg(2), getArg(3), getArg(4), getArg(5)));