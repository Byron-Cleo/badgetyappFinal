//PROJECT NOTES
//QUESTIONS TO TAKE CARE WHEN BUILDING AN APPLICATION
//a. HOW and WHY to pass one module to another AND how to avoid conflicts in our data structures(BASICALLY FUNCTIONS)
//b. in the CONTROLLER module we had the event delegation defined SO THAT NOT MANY EVENT TARGETS ARE CREATED MANUALLY FOR EVERY ELEMENT when 
//the user intends to do some operations hence EVENT BUBBLING takes place where an event is transmitted all over to the elements
// children and an itended action is triggered

//IN this project we learn how to break our project code into small bits called modules THAT MAKE IT EASY TO ORGANIZE OUR CODE AND CREATE NEATLY 
//RELATED FUNCTIONALITY INTO ONE STRUCTURE and TO AVOID EXTERNAL INTERFERANCE i.e outside scope interferance FROM OTHER CODE (this is what 
//encapsulation is)..

//ultimately the use of CLOSURES and IIFEs ARE VERY IMPORTANT TO BUILD A ROBUST APP
//APP is build by tTHINKING LIKE A PROGRAMMER where you know how to define variables, create complex functions and CREATE objects 
//and how function relate to each other and also how functions realate to properties.

//1. this is an IIFE in practice to create UI modeule for our project
//2. VERY IMPORTANT then, this IIFE SHOULD RETURN AN OBJECT CONTAINING ALL THE FUNCTIONS WE WANT TO BE PUBLIC (this is the main secret of using IIFE),
// the outside scope will have access to these functions which are PROVIDED BY THE OBJECT IIFE RETURNS
//3. AGAIN, THE POWER OF CLOSURE comes handy within this iife as the returned object(FUNCTION) is called even after the IIFE has 
//returned its execution.

//4. ABOUT DATA MANIPULATION:
//data from code can either be INPUT or OUTPUT which are usually junk. practic to use ARRAYS & OBJECTS to STORE these data TOGETHER

//5. Array functions used in the project
//indexOf(), forEach(), map(), split(), slice()

//6. remember every element in the DOM is stored in a NODE. hence when transversing it in JS we move THROUGH NODES
//hence the parentNODE, and alist of elements are just NODELIST like the one querySelectorAll returns










//BUDGET CONTROLER
var budgetController = (function () {

	//object that will enable many expenses objects that are derived from it
	var Expense = function(id, description, value) {
		//#IMPORTANT# methods can be defined for each of this FUNCTON CONSTRUCTOR but it is better to be put in the prototype property so hat all the 
		//objects that are derived from this constructor CAN AUTOMATICALLY INHERIT THE METHODS EASILY, this the best way.
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1; //meaning by default there is no percentage when there is no expenditure
	};
	//#IMPORTANT#like any other class where we can define setters(that set expected values to a variable) and getters(that are functions that return processed expected output), WE DO
	//THE SAME FOR THE JAVASCRIPT FUNCTION CONSTRUCTORS WHICH DO ACT LIKE CLASSES IN JS
	//therefore this is a SETTER FUNCTION WITHIN THE CLASS (hahaha, in ;laymans way) 

	//LEMME CALL IT   setPercentage
	Expense.prototype.calcPercentage = function(totalIncome) {//prototype property is used to enable AUTOMATIC INHERITANCE OF this function by OBJECTS THAT WILL BE DERIVED FROM THIS FUNCTION CONSTRUCTOR
		
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};
	//NOW this is a getter to EVENTUALLY return the value of the percentage property
	Expense.prototype.getPercentage = function() {
			return this.percentage;
	};

	//object that will enable many income objects that are derived from it
	var Income = function(id, description, value) {
		//#IMPORTANT# methods can be defined for each of this FUNCTON CONSTRUCTOR but it is better to be put in the prototype property so hat all the 
		//objects that are derived from this constructor CAN AUTOMATICALLY INHERIT THE METHODS EASILY, this the best way.
		this.id = id;
		this.description = description;
		this.value = value;
	};

	//A PRIVATE SETTER FUNCTION that calculates both inc and expenses 
	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {//#IMPORTANT# cur is an instance OBJECT(either inc or exp) WITH different data inside it, both description and value(money)
			sum += cur.value; //sum + cur.value; //jst taking the value ONLY from the big object
		});
		data.totals[type] = sum;//DONT  UNDERSTAND THIS PARRT
	};

	//this the PRIVATE VARIABLE OBJECT where all the user data is collected and stored
	var data = {
		allItems: {//an object within object storing data from the app using arrays too
			exp: [],
			inc: []//inside both inc and exp instances fromt the new Expense and new Income
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	return {//THE RETURN LOCK CONTAINS ALL THE PUBLIC METHODS/ METHODS BEING EXPOSED

		//HERE IN THE RETURN BLOCK FOR MAKING THIS ADDITEM METHOD EXPOSED OUT OF IIFE when it invokes itself
		addItem: function(type, des, val) {//Exposing addItem method
			var newItem, ID;

			//here id is from the item type ATTRIBUTE. sice ids in dome arecaptured 
			//LAST ELEMENT index position = [data.allItems[type].length-1] also know as the index of that element
			//data.allItems[type][data.allItems[type].length-1] ETURNS AN OBJJECT WHICH WAS the new user item
			if(data.allItems[type].length > 0){//if the is an OBJECT IN THE EMPTY ARRAY? THEN.....
				ID = data.allItems[type][data.allItems[type].length-1].id+1; //basically ID is LAST ID INDEXPOSITION ADD 1 to get the NEXT ID (incrementing)
			} else {
				ID = 0;//so this is the same as the ID of the first Added item by default
			}

			//create a new OBJECT item (user data) based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if(type ==='inc') {
				newItem = new Income(ID, des, val);
			}

			//the new item is pushed or ADDED TO THE data STRUCTURE aBOVE(the private variable holding all user input information)
			data.allItems[type].push(newItem);

			//return the new element (THE USER INPUT INFORMATION IS OUTPUT NOW)
			return newItem;

		},//#END# OBJECT 1 OR PUBLIC METHOD endpoint

		//here we are deleting the ITEMS from the data structure, that was defined to stored all the USER INPUT DATA
		deleteItem: function(type, id) {
			var ids, index;

			//1 part a. COLLECTING ALL THE the IDs placing them together alone

			//EXAMPLE:
			//id = 6: is to be removed from the structure
			//data.allItems[type][id]; IS NOT THE BEST APPROACH TO REMOVE THE ID
			//ids = [1,2,4,6,8]
			//now id 6 is of index = 3 hence we remove the id using the its index number position in the array

			//REMEBER 'data.allItems[type]' returns an ARRAY WHICH IS having [{id1, description1}(index 0), {id2, description2}(index 1), {id3, description3}(index 2), ...]
			//hence using map we ONLY collect the ID ELEMENTS ALONE from the LEAVING THE DESCRIPTION ELEMENTS THERE. and loops over every id elements as defined below to
			//return a new array of SELECTED IDS ALONE 
			ids = data.allItems[type].map(function(current) {
				return current.id;//ids = [1,2,4,6,8]:##NOW ONLY THE IDs ARE SELECTED FROM THE VAST ARRAY OF OBJECTS HAVING ids, descriptions and values##
			});

			//1 part b. finding THAT PARTICULAR ID using the its index position
			index = ids.indexOf(id);

			//2. removing the ID from the structure
			if (index !== -1) {//means the index is present hence there is an ID FOUND IN THE ids ARRAY
				data.allItems[type].splice(index, 1);//here index = actual id value in the 
			}


		},//#END# OBJECT 2 OR PUBLIC METHOD endpoint


		//THIS A SETTER FUNCTION as it calculates the budget/EXPENDITURE of the user with percentage too
		calculateBudget: function() {

			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			//calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			//claculate the percentage of the spent income()/i.e percentage of your expenditure
			//we are calculating the TOTAL Expenditure IN percentage
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}		

		},//#END# OBJECT 3 OR PUBLIC METHOD endpoint

		//HERE WE ARE calculating the percentage of each expenditure from the TOTAL INCOME the user has
		//i.e how much did you spent on vacation in percentage???(JUST AN EXAMPLE)
		calculatePercentages: function() {
			
			/*example of expences
			if income = 220 and
			vacation=30/= 	: % is now=(30/220)*100
			rent=50/= 		: % is now=(50/220)*100
			food=34/= 		: % is now=(34/220)*100
			% = (Expence/Total Income)*100
			*/

			data.allItems.exp.forEach(function(current){
				current.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(current){
				return current.getPercentage();
			});
			return allPerc;//returns [20%,12%,56%,8%] something like this
		},


		//THIS IS A GETTER FUNCTION/OBJECT OF THE object EXPOSED 2 AS IT FINALLY RETURNS THE CALCULATED BUDGET & PERCENTAGE 
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}

		},//#END# OBJECT 4 OR PUBLIC METHOD endpoint




		testing: function() {
			console.log(data);
		}
	};


})();


























//UI CONTROLLER this is the USER INTERFACE CONTROLLER WHICH DEALS WITH THE USER INTERACTING WITH THE APP ELEMENTS DIRECTLY
var UIController = (function () {
	
	//is a PRIVATE DEFINED OBJECT  hence can only be used within this IIFE  controller
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn',
		incomeContainer: '.income__list', 
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container', //DOM element is icluded here for Event Dlegation purposes to target all its children i.e all the expenses and incomes 
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	}; 

	//POINT OF EXPOSING ALL THE PRIVATELY DEFINED FUNCTIONS AND PROPERTIES
	//this is where THE INTERNAL DEFINITIONS(privately defined properties and methods) OF THIS IIFE FUNCTION IS EXPOSED TO THE PUBLIC
	//IT IS AN ANONYMOUS OBJECT WITH VARIOUS FUNCTIONS AS OBJECTS since functions are first objects in javascript TOO WITHIN IT
	


		var formatNumber = function(num,type) {
			var numsplit, int, dec, type;
			/*the rules of formating the numbers
			+ or _ before number
			exactly 2 decimal points
			comma seperating the thousands

			i.e 2310.4567 -> 2,310.46 exactly 2 decimal points OR
				2000     -> 2,000.00
			*/

			//1. we want to work with a NATURAL whole number i.e ABSOLUTE NUMBER
			num = Math.abs(num);

			//2. toFixed exactly rounds up a number decimal points to exactly 2dcs event if its a whole without decimals AND ITS A PROTOTYPE METHOD OF THE NUMBER OBJECT
			//the num object is NOW INHERITING THE TOFIXED() INBUILT INTEGER OBJECT METHOD
			num = num.toFixed(2);//RETURNS A string now from a number HENCE ENABLIN TO USE STRING METHODS ON THIS STRINGRD NUMBER

			//3. the stringed integer is now split			
			numSplit = num.split('.');//returns an arry of different parts of array items

			//4. Getting the stringed number elements so as TO ADD COMMA IN THE THOUSANDS PART OF THE WHOLE INTEGER
			int = numSplit[0];//the whole number part
			if (int.length > 3) {
				//substr means start at 0 the go that number of digits
				int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3); //i.e input23319 output 23,319
			}

			dec = numSplit[1];//decimal part 

			//5.now putting sign if either exp or inc value
			//type = 'exp' ? sign = '-' : sign = '+'; //JUST FOR REFERENCE

			//6. finally return the formated string
			return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

		};


		var nodeListForEach = function(list, callback){
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i);
				}
			};




	return {

		getInput: function() {//OBJECT 1
			return{
				 type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
				 description: document.querySelector(DOMstrings.inputDescription).value,
				 value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // the float method is important for converting STRING TO FLOAT NUMBER
			};
		},//#END# OBJECT 1 endpoint





		//this where a new of boject of eithet type inc or exp is being added into the UI list 
		//to show all  the particular expenses or income a user is having
		addListItem: function(obj, type) {//OBJECT 2 ## the obj is the NEW object(instance of the function constructor)
			var html, newHtml;
			
			//Create HTML string with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;//we r selecting the inc side the new html input data is to be placed

				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if ( type === 'exp') {
				element = DOMstrings.expensesContainer;//we r selecting the exp side the new html input data is to be placed

				html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			}

			//Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			//inser the new HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},//#END# OBJECT 2 endpoint	




		//LESSON: REMOVING AN ITEM FROM THE DOM USING JAVASCRIPT
		//in JS we can NEVER ROMOVE an ELEMENT BUT ONLY THE CHILD of an element
		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);

			el.parentNode.removeChild(el);
		},





		clearFields: function() {//OBJECT 3 
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);//#IMPORTANT# by default a list is returned here by the querySelectorAll() JS method.

			//LECTURE75 CLEARING OUR INPUT FIELDS
			//the call function creates a copy of fields list then CONVERTED TO AN ARRAY by the slice method
			//there4 fieldArr = [DOMstrings.inputDescription, DOMstrings.inputValue] FROM JST A MERE LIST which doest have nice methods to manupulate data in an array
			fieldsArr = Array.prototype.slice.call(fields);

			//then we loop the fields which are in an array called fieldsArr above
			//we loop the array using an inbuild array method called forEach which has default parameters that you jst defined for processing
			//the current: is the ACTUALL ELEMENTS in the array, index: is the indexposition of the element(i.e ARRAYLENGTH - 1) and finally the arrayName ITSELF
			fieldsArr.forEach(function(current, index, array) {//the forEach callback function always have the OBJECT AS THE PARAMETER 
				current.value = "";
			});

			fieldsArr[0].focus();//we now set focuson the descripti on element which INPUT IS SUBMITTED 
		},//#END# OBJECT 3 endpoint




		displayBudget: function(obj) {
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
			
		},


		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);//returns a nodeList

			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		},


		displayMonth: function() {
			var now, month, year;

			now = new Date();
			months = ['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov','Dec.'];
			month = now.getMonth();
			year = now.getFullYear();//a  prortotype function of Date object

			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
		},


		//basically we are using the power of JS to do style manipulations in our UI
		//hence when the type is chanded from either + or -, js will detect it make necessary STYLE changes in the APP INTERFACE
		changeType: function() {
			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue);

			nodeListForEach(fields, function(current) {
				current.classList.toggle('red-focus');//#IMPORTANT#the classList Property is the array which the querySelectorAll returns
			});
			//changing the input Button when exp chenge event is triggered
			document.querySelector(DOMstrings.inputButton).classList.toggle('red');

		},


		getDOMstrings: function() {//OBJECT 4 ::here we are exposing the the DOMStrings OBJECT to the public
			return DOMstrings;
		}//#END# OBJECT 4 endpoint		
	};



})();

//THis IS THE LINKING MODULE where both the OBJECTS RUTNED FROM THE UI & BUDGET CONTROLLERS ARE BINDED TOGETHER TO FORM THE FUNCTIONALITY OF THE APP
//it accepsts the two modules as arguments and ITSELF RETURNING A SINGLE OBJECT OF COMBINED 2 OBJECTS(the two above)
















//GLOBAL APP CONTROLLER
						//budgetController, UIController
var controller = (function (budgetCtrl, UICtrl) {

	//A PRIVATE FUNCTION
	var setupEventListerns = function () {
		var DOM = UICtrl.getDOMstrings();//the method from UIContrller is now accessible after glabally being EXPOSED

		//this is a click event which is triggered to COLLECT USER INPUT DATA FROM THE UI
		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
		//normally any key board key event is targeted to the document object where it is then determined which key was pressed.
		//NB: NOT ON A ELEMENT LIKE OTHER CLICK....ETC
		document.addEventListener('keypress', function(event) {//An event listener callback function always have access to the EVENT OBJECT hence can always use it whenever it wishes
			if (event.keycode === 13 || event.which === 13) {
				ctrlAddItem();//this is the method which collects user data & other functionalities
			}
		});

		//this where the event delegation is being defined/ OR WHERE THE EVENT LISTENER IS ATTACHED, then scales down the DOM to reach the ID ITSELF
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);

	};


	//A PRIVATE FUNCTION
	var updateBudget = function() {

		//1. Calculate the budget
		budgetCtrl.calculateBudget();//EXPOSED:returned SETTER object from the budgetController
		
		//2. Return the budget
		var budget = budgetCtrl.getBudget();//EXPOSED: returned GETTER object from the budgetControler

		//3. Display the budget on the UI
		UICtrl.displayBudget(budget); 
	};//#END# end of this function


	var updatePercentages = function () {

		//1. Calculate percentages
		budgetCtrl.calculatePercentages();
		//2. Read the percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();
		//3. Update the UI with the new percentages
		console.log(percentages);
		UICtrl.displayPercentages(percentages);
	};


	//A PRIVATE FUNCTION
	//FUNCTION CALLED ONLY WHEN EVENT IS TRIGGERED
	//this is the method which collects the final user INPUT DATA
	var ctrlAddItem = function() {
		var input, newItem;
		//1. Get the field input data(DOM manipulation)
		input = UICtrl.getInput();//REMEBER THIS AN OBJECT RETURNED WITH type, description and value FROM THE UI when keying the INPUT DATA

		//Validation of USer Input before final Submisstion
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			//2. add the new item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//3. add the items to the UI
			UICtrl.addListItem(newItem, input.type);

			//4. Clear the fields
			UICtrl.clearFields();

			//5. Calculate and update Total User Budget
			updateBudget();

			//6. Calculate and update Total User User Percentages
			updatePercentages();
		}		
	};//#END# end of this function

	//A PRIVATE FUNCTION FOR DELETING ITEMS ON THE UI
	//EVENT DELEGATION IN ACTION: Event Targeting and Event Bubbling(Transversing the DOM) 
	var ctrlDeleteItem = function(event) {//event object is ALWAYS AVAILABLE FOR USE whenever we want by jst defining it for events 
		var itemID;
		//THE TARGET PROPERTY OF THE EVENT OBJECT IS USEFULL TO CONFIRM WHERE THE EVENT WAS FIRST TRIGERRED, then the event will BUBBLE UP TO ITS PARENT ELEMENT FROM THE TARGET OF ACTUAl event was fired
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		//now we ONLY WANT a response or action triggered when AN ID is available because the EVENT BUUBLES UP to collect an ID, but then the ID is NOT  everywhere in the DOM.
		//so we atarget to get the ID then we use the ID to do more functionalities
		if (itemID) {

			//itemID foemat is like: inc-1 or exp-2 which is a string!!!
			//there4, string will be automatically be converted to an OBJECT by jst using one of its FUNCTIONS, HERE split() function whic returns an ARRAY!
			splitID = itemID.split('-'); //returns ['inc/exp', '1(which is the id itself)'] 
			type = splitID[0]; //this is either inc/exp
			ID = parseInt(splitID[1]); //this is the interger id now 1,2,.....

			//1. delete the item from the data structure(LIKE WE REOMOVE THE OBJECT THAT WAS CREATED EARLIER usin the FUNCTION CONSTRUCTOR i.e new Expense/Income)
			budgetCtrl.deleteItem(type, ID);

			//2. Delete the item from the UI
			UICtrl.deleteListItem(itemID);

			//3. Update and show the NEW BUDGET to reflect the NEW CHANGES
			updateBudget();

			//4. Calculate and update Total User User Percentages
			updatePercentages();
		}
	};

	return {
		init: function() {//this a PUBLIC INITIALIZATION PUBLIC which EXPOSES all the workings of an application AT ONCE. APPLICATION IS NOW LAUNCHED
				console.log('Application  has started');
				UICtrl.displayMonth();
				UICtrl.displayBudget({
					budget: 0,
					totalInc: 0,
					totalExp: 0,
					percentage: -1
				});
				setupEventListerns();
		}
	}
	
	

})(budgetController, UIController);

controller.init();