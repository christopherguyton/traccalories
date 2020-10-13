//Storage Controller
const StorageCtrl = (function () {
    //public methods
    return {
        storeItem: function (item) {
            let items;
            //Check if any items in local
            if (localStorage.getItem('items') === null) {
                items = [];
                //push new item
                items.push(item);
                //Set Local Storage
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                //push new item
                items.push(item);
                //reset LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
      
            items.forEach(function(item, index){
              if(updatedItem.id === item.id){
                items.splice(index, 1, updatedItem);
              }
            });
            localStorage.setItem('items', JSON.stringify(items));
          },
          deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));
      
            items.forEach(function(item, index){
              if(id === item.id){
                items.splice(index, 1);
              }
            });
            localStorage.setItem('items', JSON.stringify(items));
          },
          clearItemsFromStorage: function() {
              localStorage.removeItem('items');
          }
    }
})();

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
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories:400},
        //     // {id: 2, name: 'Eggs', calories: 300},
        // ],
        items: StorageCtrl.getItemsFromStorage(),
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
            //Calories to number
            calories = parseInt(calories);

            //create new item
            newItem = new Item(ID, name, calories);
            //Add to items array
            data.items.push(newItem)
            return newItem;
        },
        getItemById: function (id) {
            let found = null;
            //loop through items
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found
        },
        updateItem: function (name, calories) {
            //Calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function (id) {
            //get Ids
            ids = data.items.map(function (item) {
                return item.id;
            });
            //get index
            const index = ids.indexOf(id);
            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem
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
        listItems: '#item-list li',
        clearBtn: '.clear-btn',
    }


    //Public Methods
    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `  <li class="collection-item" id="item-${item.id}">
                <strong>${item.name} </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
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
            li.innerHTML = `<strong>${item.name}</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        `;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn Node list Into Array
            listItems = Array.from(listItems);
            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                `;
                }
            })
        },
        deleteListItem: function (id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
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
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        deleteAllItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //Turn node list into array
            listItem = Array.from(listItems);
            listItems.forEach(function (item) {
                item.remove();
            });
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();


//App Controller

const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    //Load Event Listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        //Back event
        document.querySelector(UISelectors.backBtn).addEventListener('click', backToAddState);

        //Delete Event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteMeal);

        //Clean Items Event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearItemsEvent);

        //disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                return false;
            }
        })

        //edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //update item event 
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
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
            //store in local storage
            StorageCtrl.storeItem(newItem);
    
            //Clear fields
            UICtrl.clearInputs();
        }

        e.preventDefault();
    }


    //update item submit
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            //Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            //break into an array
            const listIdArr = listId.split('-');
            //get Id number
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit)
        }
        //Add Item to form
        UICtrl.addItemToForm();

        e.preventDefault();
    }

    //Item update submit
    const itemUpdateSubmit = function (e) {
        //Get Item Input
        const input = UICtrl.getItemInput();

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update Local Storage
    StorageCtrl.updateItemStorage(updatedItem);
        //update ui
        UICtrl.updateListItem(updatedItem)

        e.preventDefault();

    }

    //Delete Single Item

    const deleteMeal = function (e) {
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //Delete from Structure
        ItemCtrl.deleteItem(currentItem.id);
        //delete from UI
        UICtrl.deleteListItem(currentItem.id);
        const totalCalories = ItemCtrl.getTotalCalories();
        //subtract to ui
        UICtrl.showTotalCalories(totalCalories);

        //delete from Local Storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        //Clear State
        UICtrl.clearEditState();
        e.preventDefault();
    }

    //back button function
    const backToAddState = function (e) {
        UICtrl.clearEditState();
        e.preventDefault();
    }

    //Delete All Items
    const clearItemsEvent = function (e) {
        //Delete All Items
        ItemCtrl.clearAllItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        //subtract from
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.deleteAllItems();
        UICtrl.hideList();
///Clear From Storage
        StorageCtrl.clearItemsFromStorage();
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


})(ItemCtrl, StorageCtrl, UICtrl);

App.init();