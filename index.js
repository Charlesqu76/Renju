const xLen = 16;
const yLen = 16;
const allCell = xLen * yLen;
/** 
 * 棋盘
 */
let board = new Array(allCell).fill(0)

/**
 * 棋盘状态
 * 0 -> 准备开始 
 * 1 -> 开始 
 * 2-> white win  
 * 3 -> black win
 */
let boardState = 0

/**
 * 棋子颜色
 *  1 -> black
 *  2 -> white
 *
 */
let color = 2;

/**
 * 记录最后一步棋子位置
 */
let lastBlackCoordinate = null;
let lastWhiteCoordinate = null;

/**
 * 棋盘初始化
 */
function init() {
    board = new Array(allCell).fill(0)
    color = 2;
    boardState = 1
    lastBlackCoordinate = null;
    lastWhiteCoordinate = null;
    pieceActive();
}

/**
 *  悔棋功能
 *  悔棋按钮添加css样式 disabled
 *  color == 1 黑色悔棋按钮 disabled
 *  color == 2 白色悔棋按钮 disabled
 *  为悔棋按钮添加事件
 */
let blackUndo = document.getElementById('blackUndo');
let whiteUndo = document.getElementById('whiteUndo');

function changeUndoBottomDisabled() {
    if (!lastWhiteCoordinate || color === 2) {
        whiteUndo.disabled = 'true'
    } else {
        whiteUndo.disabled = ''
    }
    if (!lastBlackCoordinate || color === 1) {
        blackUndo.disabled = 'true'
    } else {
        blackUndo.disabled = ''
    }
}
blackUndo.addEventListener('click', function () {
    let x = lastBlackCoordinate[0];
    let y = lastBlackCoordinate[1];
    let location = x + y * xLen;
    for (let i = 0; i < allCell; i++) {
        if (i === location) {
            board[i] = 0
        }
    }
    color = 1
    pieceActive(2)
    render()
    lastBlackCoordinate = null
    changeUndoBottomDisabled()

})
whiteUndo.addEventListener('click', function () {
    let x = lastWhiteCoordinate[0];
    let y = lastWhiteCoordinate[1];
    let location = x + y * xLen;
    for (let i = 0; i < allCell; i++) {
        if (i === location) {
            board[i] = 0
        }
    }
    color = 2
    pieceActive(1)
    render()
    lastWhiteCoordinate = null
    changeUndoBottomDisabled()
})


/** 
 *  投降按钮
 */
let whiteQuit = document.getElementById('whiteQuit');
let blackQuit = document.getElementById('blackQuit');
whiteQuit.addEventListener('click', function () {
    boardState = 3
    render()
});
blackQuit.addEventListener('click', function () {
    boardState = 2
    render()
})

/**
 *  修改出棋提示css
 *  color == 1 黑棋active
 *  color == 2 白棋active
 */
function pieceActive() {
    if (color === 2) {
        document.getElementsByClassName('whiteSide')[0].className = 'whiteSide active'
        document.getElementsByClassName('blackSide')[0].className = 'blackSide'
    } else if (color === 1) {
        document.getElementsByClassName('whiteSide')[0].className = 'whiteSide'
        document.getElementsByClassName('blackSide')[0].className = 'blackSide active'
    }
    if (boardState !== 1) {
        document.getElementsByClassName('whiteSide')[0].className = 'whiteSide'
        document.getElementsByClassName('blackSide')[0].className = 'blackSide'
    }
}

/**
 * 获取棋盘容器
 */
let container = document.getElementById('root');

/**
 * 渲染
 */
function render() {
    container.innerHTML = '';
    changeUndoBottomDisabled();
    pieceActive();
    if (boardState === 1) {
        playing()
    } else {
        ready()
    }

}
/**
 * 游戏准备阶段
 */
function ready() {
    // 白板
    let subScreen = document.createElement('div');
    subScreen.id = 'subScreen';
    container.appendChild(subScreen);

    let ele = document.createElement('div');
    ele.className = 'subScreenContainer';

    let eleWord = document.createElement('div');
    if (boardState === 2) {
        eleWord.innerText = 'white win';
    } else if (boardState === 3) {
        eleWord.innerText = 'black win';
    }
    ele.appendChild(eleWord)

    let readyBotton = document.createElement('button');
    readyBotton.addEventListener('click', function () {
        init();
        render();
    })
    readyBotton.innerText = '开始'
    ele.appendChild(readyBotton)
    container.appendChild(ele);
    changeUndoBottomDisabled()
    playing()
}
/**
 * 游戏进行
 * 游戏规则
 */
function playing() {
    for (let i = 0; i < allCell; i++) {
        // x->横坐标 y->纵坐标
        let x = i % xLen;
        let y = Math.floor(i / xLen)
        const ele = document.createElement('div');
        ele.className = 'singleBorad';
        ele.addEventListener('click', function () {
            if (board[i] !== 0) {
                return
            }
            board[i] = color;
            if (color === 1) {
                lastBlackCoordinate = [x, y]
                pieceActive(color)
            } else if (color === 2) {
                lastWhiteCoordinate = [x, y]
                pieceActive(color)
            }
            changeUndoBottomDisabled()
            isWin([x, y], color);
            color = 3 - color;
            render();
        })
        container.appendChild(ele)
        if (board[i] === 1) {
            const piece = document.createElement('div');
            piece.className = 'piece blackPiece';
            ele.appendChild(piece)
        } else if (board[i] === 2) {
            const piece = document.createElement('div');
            piece.className = 'piece whitePiece';
            ele.appendChild(piece)
        }
    }
}

/**
 * 胜利条件
 * 八个方向五子相连
 */
function isWin(coordinate, color) {
    let count = 0;
    let x = ox = coordinate[0];
    let y = oy = coordinate[1];
    let i = null;
    let init = () => {
        count = 0;
        i = null
        x = ox;
        y = oy;
    }
    let win = () => {
        if (color === 1) {
            boardState = 3;
        } else if (color === 2) {
            boardState = 2;
        }
        pieceActive()
        lastBlackCoordinate = null;
        lastWhiteCoordinate = null;
        ready()
    }
    // 向左
    while (x >= 0) {
        i = x + y * xLen;
        if (board[i] === color) {
            x--;
            count++;
            if (count === 5) {
                win()
                return
            }
        } else {
            init()
            break
        }
    }


    // 向右
    while (x <= xLen) {
        i = x + y * xLen;
        if (board[i] === color) {
            x++;
            count++;
            if (count === 5) {
                win()
                return
            }
        } else {
            init()
            break
        }
    }

    // 向上
    while (y >= 0) {
        i = x + y * xLen;
        if (board[i] === color) {
            y--;
            count++;
            if (count === 5) {
                win()
                return
            }
        } else {
            init()
            break
        }
    }

    // 向下
    while (y <= yLen) {
        i = x + y * xLen;

        if (board[i] === color) {
            y++;
            count++;
            if (count === 5) {
                win()
                return
            }
        } else {
            init()
            break
        }
    }

    // 向左上
    while (y >= 0 && x >= 0) {
        i = x + y * xLen;
        if (board[i] === color) {
            x--
            y--;
            count++;
            if (count === 5) {
                win()
                return
            }
        } else {
            init()
            break
        }
    }

    // 向左下
    while (x >= 0 && y <= yLen) {
        i = x + y * xLen;
        if (board[i] === color) {
            x--
            y++;
            count++;
            if (count === 5) {
                win()
                return
            }
        } else {
            init()
            break
        }
    }

    // 向右上
    while (x <= xLen && y >= 0) {
        i = x + y * xLen;
        if (board[i] === color) {
            x++
            y--;
            count++;
            if (count === 5) {
                win()
                return
            }
        } else {
            init()
            break
        }
    }

    // 向右下
    while (x <= xLen && y <= yLen) {
        i = x + y * xLen;
        if (board[i] === color) {
            x++
            y++;
            count++;
            if (count === 5) {
                win()
                return
            }
        } else {
            init()
            break
        }
    }
}

render()






