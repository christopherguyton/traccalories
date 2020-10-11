//Storage Controller


//Item Controller
const ItemCtrl = (function () {
    //Item Constructor
    class Item {
        constructor(id, name, calories) {
            this.id = id;
            this.name = name;
            this.calories = calories;
        }
    }

    //Data Structure / State
    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories:400},
            // {id: 2, name: 'Eggs', calories: 300},
        ],
        currentItem: null,
        totalCalories: 0
    }


    //Public Methods

    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;
            //Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Calroies to number
            calories = parseInt(calories);

            //create new item
            newItem = new Item(ID, name, calories);
            //Add to items array
            data.items.push(newItem)
            return newItem;
        },
        getTotalCalories: function () {
            let total = 0;
            //Loop Through items and add cals
            data.items.forEach(function (item) {
                total += item.calories;
            });
            //Set total cal in data structure
            data.totalCalories = total;
            //return total
            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();


//UI Controller

const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
    }


    //Public Methods
    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `  <li class="collection-item" id="item-${item.id}">
                <strong>${item.name} <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </strong>
            </li>`;
            });
            //Insert List items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        addListItem: function (item) {
            //show list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //Add ID
            li.id = `item-${item.id}`;
            //Add html
            li.innerHTML = `<strong>${item.name} <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </strong>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearInputs: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function () {
            UICtrl.clearInputs();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();


//App Controller

const App = (function (ItemCtrl, UICtrl) {
    //Load Event Listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
    }

    //Add item submit
    const itemAddSubmit = function (e) {
        //get form input from UI Controller
        const input = UICtrl.getItemInput();
        //check for name and claorie input
        if (input.name !== "" && input.calories !== "") {
            //Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add Item to UI
            UICtrl.addListItem(newItem);

            //Get Total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add to ui
            UICtrl.showTotalCalories(totalCalories);

            //Clear fields
            UICtrl.clearInputs();
        }

        e.preventDefault();
    }

    //update item submit
    const itemUpdateSubmit = function (e) {
        if (e.target.classList.contains('edit-item')) {
            //Get list item id (item-0, item-1)
            const listId = e.target.parentElement.parentElement.id;
            console.log(listId)
        }
        e.preventDefault();
    }

    //Public Methods
    return {
        init: function () {

            //Set Initial State
            UICtrl.clearEditState();

            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //check if items 
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                UICtrl.populateItemList(items);
            }

            //populator list with items

            UICtrl.populateItemList(items);

            //Get Total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //add to ui
            UICtrl.showTotalCalories(totalCalories);


            //Load event listeners
            loadEventListeners();
        }
    }


})(ItemCtrl, UICtrl);

App.init();