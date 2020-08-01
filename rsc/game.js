var scorevalue = 0;
			
			var gameElements = [];
			
			var elementsToDestroy = [];
			
			var savedPosition = {x: "none", y: "none"};			
			var newPosition = {x: 0, y: 0};
			
			let clickedStatus = false;		
			let relocation = false;
			
			let colors = ["pink","green","red","blue","gray"];
			
			var posX = 70;
			var posY = 70;
			
			var gamePosition = 460;
			
			let lines = 6;
			let members = 5;

			function startGame() {
				
				let x = 0;
				let y = 1;
				
				lines = Number(document.getElementById("layouttype").value[0]);
				members = Number(document.getElementById("layouttype").value[0]);
			
				for (r=1;r<=lines*members;r++){
					x++;
					if (x>members) { x = 1; y++; }
					gameElements.push(new component(30, 30, colors[Math.floor(Math.random() * colors.length)], posX*x, posY*y+gamePosition));
				}
				
				document.getElementById("layouttype").disabled = true;
				document.getElementById("gamestart").disabled = true;
				document.getElementById("areareassemble").disabled = false;
				
				myGameArea.start();
				
				setTimeout(function(){noActiveCombos();}, 100);
				
			}
			
			function reassembleArea(){
				
				if(!clickedStatus){
					let x = 0;
					let y = 1;
				
					let rePositions = [];
					for (np=1;np<=lines*members;np++){
						x++;
						if (x>members) { x = 1; y++; }
						rePositions.push({rx: posX*x, ry: posY*y+gamePosition});
					}
					
					let shuffledPos = rePositions.sort(() => 0.5 - Math.random());
					
					gameElements.forEach(function(item,index) {
							gameElements[index].Xdesr = rePositions[index].rx;
							gameElements[index].Ydesr = rePositions[index].ry;
					});
					checkCurrentPosition();
				}
			}
			
			function noActiveCombos(){
				comboOfEachElement("start");			
			}
			
			function reconstructElements(){
				if (elementsToDestroy.length > 0){
					elementsToDestroy = [];
					for (rc = 0; rc < gameElements.length; rc++){
						gameElements[rc].color = colors[Math.floor(Math.random() * colors.length)];				
					}
					//console.log("Reconstructed");
					noActiveCombos();				
				}
				else{
					gameElements.forEach(function(item,index) {
						gameElements[index].img.src = "./img/"+gameElements[index].color+".png";
					});
					
					updateGameArea();
				
				}
			
			}

			var myGameArea = {
				canvas : document.createElement("canvas"),
				start : function() {
					this.canvas.width = 480;
					this.canvas.height = 940;
					this.context = this.canvas.getContext("2d");
					document.getElementById("gameContainer").insertBefore(this.canvas, document.getElementById("gameContainer").childNodes[0]);
					updateGameArea();
					window.addEventListener('click', function (e) {
							myGameArea.x = e.pageX ;
							myGameArea.y = e.pageY;							
							clickOnArea();
					});
				}, 
				clear : function(){
					this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				}
			}

			function component(width, height, color, x, y) {
				this.x = x;
				this.y = y;
				
				this.Xdesr = x;
				this.Ydesr = y;
			
				this.color = color;
				this.img = new Image();
				this.img.src = "./img/"+this.color+".png";
			
				this.width = width;
				this.height = height;
				
				this.speedX = 0;
				this.speedY = 0;
				
				this.outline = "transparent";
				
				this.combXr1 = "";
				this.combXr2 = "";
				this.combXl1 = "";
				this.combXl2 = "";
				
				this.combYu1 = "";
				this.combYu2 = "";
				this.combYd1 = "";
				this.combYd2 = "";				
				
				this.comboClear = function() {			
					this.combXr1 = "";
					this.combXr2 = "";
					this.combXl1 = "";
					this.combXl2 = "";
					
					this.combYu1 = "";
					this.combYu2 = "";
					this.combYd1 = "";
					this.combYd2 = "";				
				}
				
				this.update = function() {
					ctx = myGameArea.context;
					ctx.fillStyle = "rgba(255,255,255,0)";
					ctx.fillRect(this.x, this.y, this.width, this.height);
					ctx.drawImage(this.img,
					this.x,
					this.y,
					this.width, this.height);
					ctx.strokeStyle = this.outline;
					ctx.strokeRect(this.x, this.y, this.width, this.height);
				}

				this.clicked = function() {
					var canvasXpos = document.getElementsByTagName("canvas")[0].getBoundingClientRect().x;
					var canvasYpos = document.getElementsByTagName("canvas")[0].getBoundingClientRect().y;
					
					var myleft = this.x + canvasXpos;
					var myright = this.x + canvasXpos + (this.width);
					var mytop = this.y + canvasYpos;
					var mybottom = this.y + canvasYpos + (this.height);
					var clicked = true;
					if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
						clicked = false;
					}
					
					return clicked;
				}
			}
			
			
			function checkCurrentPosition(){
			
				if (gameElements.find(gamelem => (gamelem.Xdesr != gamelem.x || gamelem.Ydesr != gamelem.y))){
					setTimeout(moveElements, 5);
				}
				else {
					if(relocation == true){
						noComboRelocation();
						relocation = false;
					}
					else setTimeout(comboOfEachElement,50);
				}
								
			}
			
			function moveElements(){
				movingElements();
				updateGameArea();
				checkCurrentPosition();
			}
			
			function noComboRelocation() {
				let fElem = gameElements.findIndex(fe => fe.x == newPosition.x && fe.y == newPosition.y);
				let sElem = gameElements.findIndex(se => se.x == savedPosition.x && se.y == savedPosition.y);
						
				gameElements[fElem].Xdesr = savedPosition.x;
				gameElements[fElem].Ydesr = savedPosition.y;
									
				gameElements[sElem].Xdesr = newPosition.x;
				gameElements[sElem].Ydesr = newPosition.y;				
				
				newPosition.x = 0;
				newPosition.y = 0;
				
				checkCurrentPosition();
			
			}
			
			function movingElements(){
				for (m = 0; m < gameElements.length; m += 1) {
					if (gameElements[m].x != gameElements[m].Xdesr){
						if (gameElements[m].Xdesr > gameElements[m].x) gameElements[m].x += 2;
						else gameElements[m].x-=2;						
					}
					if (gameElements[m].y != gameElements[m].Ydesr){
						if (gameElements[m].Ydesr > gameElements[m].y) gameElements[m].y+=2;
						else gameElements[m].y-=2;						
					}
				}				
			}
			
			function comboOfEachElement(phase){
				for (a = 0; a < gameElements.length; a++) {
					findAround(a);
				}
				
				if(phase == "start") reconstructElements();
				else setTimeout(relocateCombo,10);
				
			}
			
			function findAround(elem){		
				let origin = gameElements[elem];

				if (origin.y >= posY+gamePosition && !elementsToDestroy.includes(elem)){
					for (o = 0; o < gameElements.length; o++){					
						if (origin.color == gameElements[o].color){
							if(origin.x == gameElements[o].x){
								switch (gameElements[o].y) {
									case origin.y + posY: origin.combYu1 = o; break;
									case origin.y + posY*2: origin.combYu2 = o; break;
									case origin.y - posY: origin.combYd1 = o; break;
									case origin.y - posY*2: origin.combYd2 = o; break;
								}											
							}
						
							if(origin.y == gameElements[o].y){
								switch (gameElements[o].x) {
									case origin.x + posX: origin.combXr1 = o; break;
									case origin.x + posX*2: origin.combXr2 = o; break;
									case origin.x - posX: origin.combXl1 = o; break;
									case origin.x - posX*2: origin.combXl2 = o; break;
								}											
							}					
						}
					}	
				}
				
				checkCombos(elem);
				
			}

			function checkCombos(elm){
			
				let origin = gameElements[elm];
				
				if(origin.combYu1 !== "" && origin.combYu2 !== "") addRemovedElement(origin.combYu1, origin.combYu2);
				if(origin.combYd1 !== "" && origin.combYd2 !== "") addRemovedElement(origin.combYd1, origin.combYd2);
				
				if(origin.combYu1 !== "" && origin.combYd1 !== "") addRemovedElement(origin.combYu1, origin.combYd1);
				
				if(origin.combXr1 !== "" && origin.combXr2 !== "") addRemovedElement(origin.combXr1, origin.combXr2);
				if(origin.combXl1 !== "" && origin.combXl2 !== "") addRemovedElement(origin.combXl1, origin.combXl2);
				
				if(origin.combXl1 !== "" && origin.combXr1 !== "") addRemovedElement(origin.combXl1, origin.combXr1);
				
				
				if( (origin.combYu1 !== "" && origin.combYu2 !== "")||(origin.combYd1 !== "" && origin.combYd2 !== "") ||(origin.combYu1 !== "" && origin.combYd1 !== "")||
				
				(origin.combXr1 !== "" && origin.combXr2 !== "")|| (origin.combXl1 !== "" && origin.combXl2 !== "")|| (origin.combXl1 !== "" && origin.combXr1 !== "") ) {addRemovedElement(elm); }
				
				
				origin.comboClear();
			}
			
			
			function addRemovedElement(element1, element2){
			
				if (!elementsToDestroy.includes(element1)) {
					elementsToDestroy.push(element1); 
					//console.log("Include elem1 "+element1);
				}
				
				if (!elementsToDestroy.includes(element2) && element2 !== undefined) {
					elementsToDestroy.push(element2); 
					//console.log("Include elem2 "+element2);
				}	
			}
			
			function relocateCombo(){
				if(elementsToDestroy.length > 0){
					for (r = 0; r < elementsToDestroy.length; r++){
					
						gameElements[elementsToDestroy[r]].y = gameElements[elementsToDestroy[r]].y/-1;
						gameElements[elementsToDestroy[r]].Ydesr = gameElements[elementsToDestroy[r]].Ydesr/-1;
						//gameElements[elementsToDestroy[r]].brpercent = 100;
						
					}
					scorevalue += 100*elementsToDestroy.length;
					document.getElementById("score").innerHTML = scorevalue;
					
					document.getElementById("score").style.animationName = "scoreupdate1";
					setTimeout( ()=>{ document.getElementById("score").style.animationName = "scoreupdate";}, 10);
					updateGameArea();
					moveRest();
				}
				else {
					readdingRelocated();
				}
			}
						
			function moveRest(){
				elementsToDestroy = [];
				for (r = lines-1; r >= 1; r--){
						checkUnder(r);
				}	
				checkCurrentPosition();
			}
			
			function checkUnder(row){				
				for (u = 0; u < gameElements.length; u++){
					if(gameElements[u].Ydesr == posY*row+gamePosition){
						movingRowElement(u);
					}										
				}
			}

			function movingRowElement(rowelem){
				let relem = gameElements[rowelem];
				relem.Ydesr = relem.y;
				relocElem = "";
				let rowPosY = relem.y;
				let nRow = 0;
				
				for (rp = (rowPosY - gamePosition)/posY; rp <= members; rp++){

					nRow++;
					
					if (gameElements.find(uelem => uelem.x == relem.x && (uelem.Ydesr == relem.Ydesr+posY || uelem.y == relem.y+posY && uelem.Ydesr == relem.y+posY)))
						break;							

					if (gameElements.find(uelem => uelem.x == relem.x && uelem.y == rowPosY + posY*nRow && uelem.Ydesr != rowPosY + posY*nRow))
						relem.Ydesr += posY;
								
					if (gameElements.find(uelem => uelem.x == relem.x && uelem.y < posY+gamePosition && uelem.y *-1 == rowPosY + posY*nRow))
						relem.Ydesr += posY;

					if (gameElements.find(uelem => uelem.x == relem.x && uelem.y == rowPosY + posY*nRow && uelem.Ydesr == rowPosY + posY*nRow && uelem.Ydesr != relem.y))	
						relem.Ydesr -= posY;
					}				
				
				if(relem.Ydesr < relem.y) relem.Ydesr = relem.y;
				if(relem.Ydesr > posY*members+gamePosition) relem.Ydesr = posY*members+gamePosition;		
			}		
		
			function readdingRelocated(){
							
				let deletedElements = [];
				let Ypositions = [];
			
				for (p = 0; p < gameElements.length; p++) {			
					if (gameElements[p].y < posY + gamePosition){
						deletedElements.push(p);
					}
				}
				//console.log(deletedElements);
				
				if(deletedElements.length > 0){
					for(v = 0; v < deletedElements.length; v++){
						for(ny = 1; ny<=lines; ny++){	
								for (nx = 1; nx<=members; nx++){
									if(!gameElements.find(elem => elem.Xdesr == posX*nx && elem.Ydesr == posY*ny+gamePosition)){
										gameElements[deletedElements[v]].y = posY*ny+(gamePosition/10)/-1;
										gameElements[deletedElements[v]].Ydesr = posY*ny+gamePosition;
										gameElements[deletedElements[v]].Xdesr = posX*nx;
										gameElements[deletedElements[v]].x = posX*nx;
										
										let randcolor = colors[Math.floor(Math.random() * colors.length)];
										
										gameElements[deletedElements[v]].color = randcolor;
										gameElements[deletedElements[v]].img.src = "./img/"+randcolor+".png";							
									}	
								}	
						}
					}
					
					deletedElements.sort(function (a, b) {
					  if (a.Ydesr > b.Ydesr) {
						return 1;
					  }
					  if (a.Ydesr < b.Ydesr) {
						return -1;
					  }
					  return 0;
					});
					
					updateGameArea();
					checkCurrentPosition();
				}
				else {
					//console.log("Relocation finished");
					clickedStatus = false;
					savedPosition.x = "none";
					savedPosition.y = "none";
				}
			}
		
					
			function clickOnArea(){
				if (myGameArea.x && myGameArea.y && clickedStatus == false) {
						if (gameElements.find(celem => celem.clicked())) {
							
							let clickedElem = gameElements.find(celem => celem.clicked());
							//console.log("clicked on "+ clickedElem.x + " " + clickedElem.y + " " + clickedElem.color);													
							
							if (savedPosition.x == "none" || savedPosition.y == "none" ){
								savedPosition.x = clickedElem.x;
								savedPosition.y = clickedElem.y;
								clickedElem.outline = "black";
								updateGameArea();								
							}
							else {
								if (
									((clickedElem.x == savedPosition.x + posX||clickedElem.x == savedPosition.x - posX) && clickedElem.y == savedPosition.y)
									||
									((clickedElem.y == savedPosition.y + posY||clickedElem.y == savedPosition.y - posY) && clickedElem.x == savedPosition.x)
								)								
								{
									gameElements.find(outlelem => outlelem.outline != "transparent").outline = "transparent";
									updateGameArea();
									newPosition.x = clickedElem.x;
									newPosition.y = clickedElem.y;
									
									//console.log("New positions: " + newPosition.x + " " + newPosition.y);
									if (gameElements.find(felem => felem.x == savedPosition.x && felem.y == savedPosition.y)){
										let firstclickedElem = gameElements.find(felem => felem.x == savedPosition.x && felem.y == savedPosition.y);
										firstclickedElem.x = newPosition.x;
										firstclickedElem.y = newPosition.y;
									}
									
									clickedElem.x = savedPosition.x;
									clickedElem.y = savedPosition.y;

									//console.log(savedPosition);
									clickedStatus = true;
									
									firstElem = gameElements.findIndex(fe => fe.x == newPosition.x && fe.y == newPosition.y);
									secondElem = gameElements.findIndex(se => se.x == savedPosition.x && se.y == savedPosition.y)
									
									findAround(firstElem);
									findAround(secondElem);
									
									//elementsToDestroy = [];
									
									gameElements[firstElem].x = gameElements[firstElem].Xdesr;
									gameElements[firstElem].Xdesr = newPosition.x;
									gameElements[firstElem].y = gameElements[firstElem].Ydesr;
									gameElements[firstElem].Ydesr = newPosition.y;
									
									gameElements[secondElem].x = gameElements[secondElem].Xdesr;
									gameElements[secondElem].Xdesr = savedPosition.x;
									gameElements[secondElem].y = gameElements[secondElem].Ydesr;
									gameElements[secondElem].Ydesr = savedPosition.y;
									
									if (!(elementsToDestroy.includes(firstElem)||elementsToDestroy.includes(secondElem))){
										relocation = true;
									}
								}
								else { 
									//console.log("Bad spot");
									clickedStatus = false;
									gameElements.find(celem => celem.clicked()).outline = "transparent";
									updateGameArea();
								}
								
								checkCurrentPosition();	
							}
							
						} 
				}
			
			}
			
			function updateGameArea() {
				myGameArea.clear();			
				
				for (i = 0; i < gameElements.length; i++) {
					gameElements[i].update();
				}	
				
			}