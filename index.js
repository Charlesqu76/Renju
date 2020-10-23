const xLen = 16;
const yLen = 16;

const allCell = xLen * yLen;

const board = new Array(allCell).fill(0)

let color = 2;
/**
 *  1 -> black
 *  2 -> white
 *
 */
let container = document.getElementById('root');
render()

function render() {
    container.innerHTML = '';
    for (let i = 0; i < allCell; i++) {
        if (i % xLen !== 0) {
            // x->横坐标 y->纵坐标
            let x = i % xLen;
            let y = Math.floor(i / xLen)
            const ele = document.createElement('div');
            ele.className = 'singleBorad';
            ele.addEventListener('click', function () {
                if (board[i] !== 0) {
                    alert('change other place');
                    return
                }
                board[i] = color;
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
        } else {
            container.appendChild(document.createElement('br'));
        }
    }

    function isWin(coordinate, color) {
        console.log(coordinate, color);
        let count = 0;
        let x = ox = coordinate[0];
        let y = oy = coordinate[1];
        let i = null;

        // 向左
        while (x >= 0) {
            i = x + y * xLen;
            if (board[x][y] === color) {
                x--;
                count++;
                if (count === 5) {
                    alert('win')
                }
            } else {
                count = 0;
                i = null
                x = ox;
                y = oy;
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
                    alert('win')
                }
            } else {
                count = 0;
                i = null;
                x = ox;
                y = oy;
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
                    alert('win')

                }
            } else {
                count = 0;
                i = null;
                x = ox;
                y = oy;
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
                    alert('win')
                }
            } else {
                count = 0;
                i = null;
                x = ox;
                y = oy;
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
                    alert('win')
                }
            } else {
                count = 0;
                i = null;
                x = ox;
                y = oy;
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
                    alert('win')
                }
            } else {
                count = 0;
                i = null;
                x = ox;
                y = oy;
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
                    alert('win')
                }
            } else {
                count = 0;
                i = null;
                x = ox;
                y = oy;
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
                    alert('win')
                }
            } else {
                count = 0;
                i = null;
                x = ox;
                y = oy;
                break
            }
        }
    }

}

let clearButton = document.getElementById('clearButton');

clearButton.addEventListener('click', function (e) {
    for (let i in board){
        board[i] = 0
    }
    render()
})