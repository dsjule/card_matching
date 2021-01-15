/**
 * This code adds event listeners to the DOM. It does everything inside
 * an anonymous funtion when the load event triggers. This is to make sure that
 * the DOM is fully build before we begin to add out listeres to it.
 * 
 * Author : David Jule.
 */
window.addEventListener("load", function(){

    /**
     * This code adds an event listener to the form. Once the form is submitied,
     * the information will be stored in variables and the form will be deleted, then
     * the instructions menu will be displayed.
     *  
     */        
    document.forms.player_information_form.addEventListener("submit", function(event){
        event.preventDefault();
        let userId= document.forms.player_information_form.userID.value;
        let userAge = document.forms.player_information_form.userAge.value;
        let favColor = document.forms.player_information_form.favColor.value;

        //delete previous form, insert the menu.
        deleteForm();

        //change the border colors based on the user preference.
        let innerContainer = document.getElementById("innerContainer");
        let outerContainer = document.getElementById("outerBackground");
        innerContainer.style.borderColor = favColor;
        outerContainer.style.borderColor = favColor;

        //Insert the instructions.
        insertInstructions(userId,userAge,favColor);
        /**
         * Delete the form once the user has sent their information.
         * @listens event:submit
         */
        function deleteForm(){
            let form = document.getElementById("player_information_form");
            let header = document.getElementById("formTitle");
            form.remove(form);
            header.remove(header);
        }          
    });

    /**
     * Generate the instructions menu that will explain the game to the player.
     * Add new nodes and assign ids to them. Also, change the style of some nodes.
     * Use the player's favorite color to change the color of the borders.
     * @param {number} userAge Integer representing the age of the user intered in the form.
     * @param {string} userId String representing the name of the user entered in the form.
     * @param {color} favColor RGB color code representing the favorite color of the user entered in the form.  
     */
    function insertInstructions(userId,userAge,favColor){
        //get all the nodes that will be added or edited. 
        let startGameButton = document.createElement("button"); 
        let mainTitle = document.getElementById("MainTitle");
        let innerContainer = document.getElementById("innerContainer");
        let instructionsTitle = document.createElement("h1");
        let instructionsParagraph = document.createElement("p");
        // add nodes and identify them.
        innerContainer.append(instructionsTitle, instructionsParagraph, startGameButton);
        instructionsTitle.id = "instructionsTitle";
        instructionsTitle.innerHTML = "Instructions:"
        instructionsParagraph.id = "Instructions"
        startGameButton.id = "startGameButton";
        startGameButton.type = "button";
        startGameButton.innerHTML = "START GAME";
        //change HTML values for desired nodes.
        mainTitle.innerHTML = ""; //Don't delete it as it will be used later when the game is displayed.
        instructionsParagraph.innerHTML =
         "Welcome to David's card matching game. When the game begins, 10 pairs of cards will be displayed.\
          You will have 10 seconds to look at the card's positions and memorize them. Once the time has passed,\
          the cards will be covered. Reveal a card by clicking on it. The card will stay selected and you will have\
          one try to find its match, if you fail to find it, both cards will be covered again. The positions will never change\
          so don't worry about losing a card that you have already selected. The purpose of the game is to find all the pairs\
          with as little tries as possible; Fewer tries means better scores. Now go on and have fun. GOOD LUCK!";


        //keep this event listener inside this function or it will be declared as null.
        //because it will load before the instructions are displayed and will not work as a result.
        let startGame = document.getElementById("startGameButton");
        startGame.addEventListener("click", function(){
            deleteInstructions();
            generateGame(userId,userAge,favColor);
        });

    }

    /**
     * Delete the instrunctions menu by removing the nodes from the DOM.
     */
    function deleteInstructions(){
        let startGameButton = document.getElementById("startGameButton");
        let instructionsParagraph = document.getElementById("Instructions");
        let instructionsTitle = document.getElementById("instructionsTitle");
        startGameButton.remove(startGameButton);
        instructionsParagraph.remove(instructionsParagraph);
        instructionsTitle.remove(instructionsTitle);
    }

    
   


    /**
     * Generate the card matching game by adding the table, table rows and images to each row.
     * Includes event listeners that will run during the game.
     * @param {number} userAge Integer representing the age of the user intered in the form.
     * @param {string} userId String representing the name of the user entered in the form.
     * @param {color} favColor RGB color code representing the favorite color of the user entered in the form. 
     */
    function generateGame(userId,userAge,favColor){
        let innerContainer = document.getElementById("innerContainer");
        let newTable = document.createElement("table");
        //Title at the top of the page. Name and Age will be added to it.
        let mainTitle = document.getElementById("MainTitle");
        let scoreTitle = document.createElement("h1");
        let numberOfTries = 0;
        innerContainer.append(scoreTitle,newTable);
        newTable.id = "tableGrid";

        //get shuffled array of cards that will be displayed.
        let cardImages = generateCardImagesArray();
        //Use this variable to track how many cards have been created,
        //and determine which image is next to be inserted in the table from the array of images.
        let cardsArrayIndexPosition = 0; //This variable is used in the generateCardsRows() Function.
        for (let i = 0 ; i < 4 ; i++){
            generateCardsRows(cardImages,cardsArrayIndexPosition);
            //Once a row has been completed, increace the starting position for the index of card images.
            //Since every row contains 5 cards. Every time a row is created increase 5 to the index.
            cardsArrayIndexPosition += 5;
        }

        //Insert player information at the top.
        mainTitle.innerHTML = "Name: " + userId + " | Age: " + userAge;

        //begin countdown of 10 seconds for user to see the cards and memorize them.
        //Then activate the game with all its funtionality.
        activateCardsGame(scoreTitle,favColor);

        /**
         * 10 seconds timer before the cards are all hidden. Gives time to the user to memorize the cards positions.
         * Then it hides the cards. Adds event listeners to the images and makes changes to the DOM accordingly.
         * @param {node} scoreTitle <h1> node selected from the DOM to change the title of the table.
         * @param {color} favColor RGB color code representing the favorite color of the user entered in the form. 
         */
        function activateCardsGame(scoreTitle,favColor){
            //cards passed down to the counter.
            scoreTitle.style.fontZise = "30px";
            let counter = 10;
            //Countdown timer before cards are hidden.
            let timer = setInterval(function(){
                scoreTitle.innerHTML = counter;
                counter--;
                if (counter < 0){
                    //Move the HTML list into and array or it will be hard to change the class name in a loop.
                    let cardsToHide = formatHtmlListToArray(document.getElementsByClassName("card"));
                    clearInterval(timer);
                    scoreTitle.innerHTML = "Number of tries: " + 0;
                    for (let i = 0; i < cardsToHide.length; i++){
                        cardsToHide[i].className = "hiddenCard";
                    }

                    //Hide or show cards when clicked. Also decide whether a pair has been found and increment the score.
                    let cards = formatHtmlListToArray(document.getElementsByClassName("hiddenCard"));
                    let selectedCards = [];
                    let selectedCardsSources = [];
                    let discoveredCards;
                    let numberOfTries = 0;
                    for (let i = 0; i < cards.length; i++){
                        //add an event listener to the hidden cards whenever they are clicked.
                        cards[i].addEventListener("click", function(){
                            //When a card is clicked, add it to the array to track the node.
                            selectedCards.push(cards[i]);
                            //when a card is clicked, add its image source to the array.
                            selectedCardsSources.push(cards[i].src);
                            //change the class to make it visible. or "selected"
                            cards[i].className = "card";

                            let smallPause = 0;
                            //once 2 cards have been selected, compare both of their addresses and add 1 try to the score.
                            if (selectedCards.length === 2){
                                let pause = setInterval(function(){
                                    //make a small pause after selecting the second card.
                                    smallPause++;
                                    if (smallPause === 1){clearInterval(pause);}
                                    numberOfTries++;
                                    scoreTitle.innerHTML = "Number of tries: " + numberOfTries;
                                    //if all cards are found show the final score.
                                    if (formatHtmlListToArray(document.getElementsByClassName("card")).length === 20){
                                        scoreTitle.innerHTML = "GAME OVER!: Total Number of tries: " + numberOfTries;
                                    }
                                    //determine if both addresses are the same. 
                                    //If not, returm them to their original state as hidden.
                                    if (selectedCardsSources[0] !== selectedCardsSources[1]){
                                        for (let i = 0 ; i < selectedCards.length ; i++){
                                            selectedCards[i].className = "hiddenCard";
                                        }
                                    }
                                    if (selectedCardsSources[0] === selectedCardsSources[1]){
                                        discoveredCards += 2;
                                    }
                                    //empty array
                                    selectedCards = [];
                                    selectedCardsSources = [];
                                }, 700);
                            }

                        });
                    }
                }
            }, 1000);            

        }

        /**
         * Move an HTML list to an array for easy formatting.
         * @param {HTMLList} HtmlList HTML list containing nodes from DOM.
         * @returns {array} Array of objects.
         */
        function formatHtmlListToArray(HtmlList){
            let array = [];
            for (let i = 0 ; i < HtmlList.length ; i++){
                array[i] = HtmlList[i];
            }
            return array;     
        }

        /**
         * Create a new row inside a table and assign an card image to that row.
         * @param {array} cardImages String array with the address of the card images.
         * @param {number} cardsArrayIndexPosition trace which image is next to be inserted in the table.
         */
        function generateCardsRows(cardImages, cardsArrayIndexPosition){

            //rows are inserted.
            let tableRow = document.createElement("tr");
            document.getElementById("tableGrid").append(tableRow);
            tableRow.className = "row";
            //Create a new table data and add a new image to it. 5 per row.
            for (let i = 0; i < 5 ; i++){
                insertTableData(tableRow, cardImages,cardsArrayIndexPosition);
                cardsArrayIndexPosition++;
            }

            /**
             * Get a row and add <td> tags to it and a card image.
             * @param {node} row The row we will be using to apply the changes.
             * @param {array} cardImages String array with the address of the card images.
             * @param {number} cardsArrayIndexPosition trace which image is next to be inserted in the table.
             */
            function insertTableData(row, cardImages, cardsArrayIndexPosition){
                //insert table data node into a variable and add it to the table, then add a class name to it.
                let tableData = document.createElement("td");
                row.append(tableData);
                tableData.className = "cardContainer";
                //insert image node into a variable and add it to the table, then add a class name to it.
                let card = document.createElement("img");
                tableData.append(card);
                //Add a source for the image tag.
                card.src = cardImages[cardsArrayIndexPosition];
                card.className = "card";
        
            }
        }

        /**
         * Create an array containing card images, each card will have a partner of the same type of card.
         * No duplicates will be created and 20 cards in total will be returned.
         * @returns {array} String array representing the names of card images.
         */
        function generateCardImagesArray(){
            let cardsImages = [
                "2C.jpg", "2D.jpg", "2H.jpg", "2S.jpg", "3C.jpg", "3D.jpg", "3H.jpg", "3S.jpg",
                "4C.jpg", "4D.jpg", "4H.jpg", "4S.jpg", "5C.jpg", "5D.jpg", "5H.jpg", "5S.jpg",
                "6C.jpg", "6D.jpg", "6H.jpg", "6S.jpg", "7C.jpg", "7D.jpg", "7H.jpg", "7S.jpg",
                "8C.jpg", "8D.jpg", "8H.jpg", "8S.jpg", "9C.jpg", "9D.jpg", "9H.jpg", "9S.jpg",
                "10C.jpg", "10D.jpg", "10H.jpg", "10S.jpg", "AC.jpg", "AD.jpg", "AH.jpg", "AS.jpg",
                "JC.jpg", "JD.jpg", "JH.jpg", "JS.jpg", "KC.jpg", "KD.jpg", "KH.jpg", "KS.jpg",
                "QC.jpg", "QD.jpg", "QH.jpg", "QS.jpg"];
            
            //Array of cards that will be created selecting cards from the cardsImages array.
            let cardsArray = [];
            //max of 10 cards will be selected.
            for (let i = 0 ; cardsArray.length < 20 ; i++){
                //generate a random index to look for a card in the array.
                let randomIndex = Math.floor(Math.random() * 52);
                //select a random image from the array.
                let card = cardsImages[randomIndex];
                let repeatedIndex = false;

                //Flag to avoid duplicated cards.
                for (let i = 0; i < cardsArray.length ; i++){
                    //if the new card is already inside the array of cards generated, skip it.
                    if (card === cardsArray[i]){
                        repeatedIndex = true;
                    }
                }
                //if no duplicates are found, add the pair to the of cards being generated.
                if (repeatedIndex === false){
                    for (let i = 0 ; i < 2 ; i++){
                        cardsArray.push(card);
                    } 
                }
            }
            //Shuffle the array of card images to prepare them to be displayed.
            let shuffledCardsArray = shuffle(cardsArray);

            let arrayOfFormattedImages = [];

            for (let i = 0 ; i < shuffledCardsArray.length ; i++){
                arrayOfFormattedImages.push("./images/" + shuffledCardsArray[i]);
            }
            return arrayOfFormattedImages;
        }


        /**
         * Knuth Shuffe > De-facto unbiased shuffle algorithm by Fisher-Yates.
         * More information at: https://github.com/coolaj86/knuth-shuffle
         * @param {array} array 
         */
        function shuffle(array) {
            let currentIndex = array.length, temporaryValue, randomIndex;
        
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
        
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
        
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            }
            return array;
        }   
    }
});