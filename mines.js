/*
* Kardo 2017
*/

function Minesweeper() {
	this.colCount = 8;
	this.rowCount = 8;
	this.mineCount = 10;
	this.cellCount;
	this.minePositions = [];
	this.cells = [];
	this.cellMine = -1;
	this.cellEmpty = 0;
	
	this.init = function() {
		this.setCellCount();
		this.generateMinePositions();
		this.fillCells();
	};
	
	this.setCellCount = function() {
		this.cellCount = this.colCount * this.rowCount;		
	};
	
	this.generateMinePositions = function() {
		if (this.mineCount > this.cellCount) this.mineCount = this.cellCount;
		
		this.minePositions = [];
		
		var pos;
		// This can get super slow if the grid is big and there are many mines
		for (var i = 0; i < this.mineCount; i++) {
			do {
				pos = Math.floor(Math.random() * this.cellCount);
			} while (this.minePositions.indexOf(pos) != -1);
			this.minePositions.push(pos);
		}
	};
	
	this.fillCells = function() {
		this.cells = [];
		for (var cellNo = 0; cellNo < this.cellCount; cellNo++) {
			if (this.minePositions.indexOf(cellNo) != -1) {
				this.cells[cellNo] = this.cellMine;
			} else {
				this.cells[cellNo] = this.getPerimeterMineCount(cellNo);
			}
		}
	};
	
	this.getPerimeterMineCount = function(cellNo) {
		var perimeterMineCount = 0;
		var perimeter = this.getPerimeter(cellNo);

		for (var i = 0; i < perimeter.length; i++) {
			if (this.cellContainsAMine(perimeter[i])) perimeterMineCount++;
		}
		
		return perimeterMineCount;
	};
	
	this.getPerimeter = function(cellNo) {
		var perimeter = [];
		var top = cellNo - this.colCount;
		var bottom = cellNo + this.colCount;
		var wrappedPerimeter = [
			top - 1,
			top,
			top + 1,
			cellNo - 1,
			cellNo + 1,
			bottom - 1,
			bottom,
			bottom + 1
		];

		for (var i = 0; i < wrappedPerimeter.length; i++) {
			var position = wrappedPerimeter[i];
			if (this.cellsAreTouching(position, cellNo)) {
				perimeter.push(position);
			}
		}
		
		return perimeter;
	};
	
	this.cellContainsAMine = function(cellNo) {
		if (this.minePositions.indexOf(cellNo) != -1) {
			return true;
		}
		return false;
	};
	
	this.cellsAreTouching = function(cellNo1, cellNo2) {
		var row1 = this.getRowIndex(cellNo1);
		var col1 = this.getColIndex(cellNo1);
		
		var row2 = this.getRowIndex(cellNo2);
		var col2 = this.getColIndex(cellNo2);
		
		if (row1 < 0 || row2 < 0 || col1 < 0 || col2 < 0) return false;		
		if (row1 >= this.rowCount || row2 >= this.rowCount ||
			col1 >= this.colCount || col2 >= this.colCount) {
			return false;
		}		
		
		var rowDiff = Math.abs(row1 - row2);
		var colDiff = Math.abs(col1 - col2);
		
		return rowDiff <= 1 && colDiff <= 1;
	};
	
	this.getColIndex = function(cellNo) {
		return cellNo % this.colCount;
	};
	
	this.getRowIndex = function(cellNo) {
		return Math.floor(cellNo / this.colCount);
	};
	
	this.getCell = function(cellNo) {
		return this.cells[cellNo];
	};
	
	this.cellIsEmpty = function(cellData) {
		return this.cellEmpty == cellData;
	};
	
	this.cellIsMine = function(cellData) {
		return this.cellMine == cellData;
	};
	
	this.getEmptyCluster = function(cellNo) {
		var emptyCluster = [cellNo];
		this.gatherCellPerimeterEmptyCellNosTo(emptyCluster, cellNo);
		return emptyCluster;
	};
	
	this.gatherCellPerimeterEmptyCellNosTo = function(arr, cellNo) {
		var perimeter = this.getPerimeter(cellNo);
		for (var i = 0; i < perimeter.length; i++) {
			var perimeterCellNo = perimeter[i];
			if (this.cells[perimeterCellNo] != this.cellMine && arr.indexOf(perimeterCellNo) == -1) {
				arr.push(perimeterCellNo);
				if (this.cellEmpty) {
					this.gatherCellPerimeterEmptyCellNosTo(arr, perimeterCellNo);
				}
			}
		}
	};
	
	this.getCellCount = function() {
		return this.cellCount;
	};
	
	this.getColCount = function() {
		return this.colCount;
	};
	
	this.getMineCount = function() {
		return this.mineCount;
	};
	
	this.getAllCellNos = function() {
		var cellNos = [];
		for (var cellNo = 0; cellNo < this.cellCount; cellNo++) {
			cellNos.push(cellNo);
		}
		return cellNos;
	};
	
	this.init();
}