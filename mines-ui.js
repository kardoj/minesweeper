/*
* Kardo 2017
*/

window.onload = function() {
	new MinesUI(
		document.querySelector('#minesweeper'),
		new Minesweeper()
	);
};

function MinesUI(container, minesweeper) {
	this.container = container;
	this.minesweeper = minesweeper;
	this.cellMine = '*';
	this.cellEmpty = '';
	this.cellFlag = '!';
	this.cellsOpenedCount = 0;
	
	this.init = function() {
		this.drawTheBoard();
		this.addTableListeners();
		this.addEndingListeners();
	};
	
	this.drawTheBoard = function() {
		var colCount = this.minesweeper.getColCount();
		var html = ['<table>'];
		for (var cellNo = 0; cellNo < this.minesweeper.getCellCount(); cellNo++) {
			if (cellNo % colCount == 0) {
				html.push('<tr>');
			}
			
			html.push('<td data-cell-no="' + cellNo + '"></td>');
			
			if (cellNo == colCount - 1) {
				html.push('</tr>');
			}
		}
		html.push('</table>');
		this.container.querySelector('#table_container').innerHTML = html.join('');
	};
	
	this.addTableListeners = function() {
		var ui = this;
		var table = this.container.querySelector('table');
		table.addEventListener('click', function(e) {
			if (e.target.tagName != 'TD') return;
			
			var clickedCell = e.target;
			if (ui.cellIsFlagged(clickedCell)) return;
			
			var cellNo = parseInt(clickedCell.getAttribute('data-cell-no'));
			var cellContent = ui.getCellContent(cellNo);
			
			if (cellContent == ui.cellMine) {
				ui.loss(clickedCell);
				return;
			}
			
			if (cellContent == ui.cellEmpty) {
				ui.openCellCluster(ui.minesweeper.getEmptyCluster(cellNo));
			} else {
				ui.openCell(clickedCell, cellContent);
			}
			
			if (ui.allCellsAreOpened()) {
				ui.win();
			}
		});
		
		table.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			if (e.target.tagName != 'TD') return;
			if (ui.cellIsOpened(e.target)) return;
			ui.toggleFlag(e.target);
		});
	};
	
	this.addEndingListeners = function() {
		var ui = this;
		this.container.querySelector('#reset_button').addEventListener('click', function() {
			ui.restart();
		});
	};
	
	this.toggleFlag = function(cell) {
		if (this.cellIsFlagged(cell)) {
			cell.innerHTML = '';
			cell.className = cell.className.replace(/ cell-flagged/, '');
		} else {
			cell.innerHTML = this.cellFlag;
			cell.className += ' cell-flagged';
		}
	};
	
	this.cellIsFlagged = function(cell) {
		return cell.className.indexOf('cell-flagged') != -1;
	};
	
	this.cellIsOpened = function(cell) {
		return cell.className.indexOf('cell-opened') != -1;
	};
	
	this.restart = function() {
		this.minesweeper.init();
		this.cellsOpenedCount = 0;
		this.drawTheBoard();
		this.addTableListeners();
		this.container.querySelector('#ending').style.display = 'none';
	};
	
	this.allCellsAreOpened = function() {
		return this.minesweeper.getMineCount() + this.cellsOpenedCount == this.minesweeper.getCellCount();
	};
	
	this.loss = function(clickedCell) {
		this.openCellCluster(this.minesweeper.getAllCellNos(), { openFlagged: true });
		clickedCell.className += ' cell-exploded';
		this.end('You lost :(')
	};
	
	this.win = function() {
		this.openCellCluster(this.minesweeper.getAllCellNos());
		this.end('You won :)');
	};
	
	this.end = function(message) {
		var ending = this.container.querySelector('#ending');
		var msgContainer = ending.querySelector('#msg_container');
		msgContainer.innerHTML = message;
		ending.style.display = 'initial';
	};
	
	this.openCellCluster = function(clusterOfCellNos, options = { openFlagged: false }) {
		for (var i = 0; i < clusterOfCellNos.length; i++) {
			var cellNo = clusterOfCellNos[i];
			var cell = this.container.querySelector('[data-cell-no="' + cellNo + '"]');
			if (this.cellIsOpened(cell)) continue;
			if (this.cellIsFlagged(cell) && !options.openFlagged) continue;
			this.openCell(cell, this.getCellContent(cellNo));
		}
	};
	
	this.openCell = function(cell, content) {
		cell.className += ' cell-opened';
		cell.innerHTML = content;
		this.cellsOpenedCount++;
		
		var contentNr = parseInt(content);
		if (contentNr === NaN) return;
		cell.className += ' cell-nr-' + contentNr;
	};
	
	this.getCellContent = function(cellNo) {
		var rawCell = this.minesweeper.getCell(cellNo);
		if (this.minesweeper.cellIsEmpty(rawCell)) {
			return this.cellEmpty;
		} else if (this.minesweeper.cellIsMine(rawCell)) {
			return this.cellMine;
		} else {
			return rawCell;
		}
	};
	
	this.init();
}