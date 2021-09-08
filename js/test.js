let disc_drop = document.querySelector('#audio');

const NOTHING = 1;
const PLAYER_1 = 1;
const PLAYER_2 = 2;
const WIDTH = 7;
const HEIGHT = 6;
const WIN_LENGTH = 4;

let game_board = new Array(WIDTH * HEIGHT).fill(0);
let column_inputs = new Array(WIDTH).fill(0);
let columns = new Array(WIDTH).fill(-1);
let player_turn = 0;
let colors = ['#ffff00', '#e9350e'];


// find_win(moves, column_inputs, game_board, pos, type_of_win) finds the win,
//   if it exists, given the moves, the current game_board and pos[ition],
//   width and height of the board, the required length of pieces in a row, 
//   the type_of_win, and the win_pos[ition]
// Requires: moves, column_inputs, and game_board must all be valid arrays
//           moves, column_inputs, and game_board is an array of length 
//              (width * height) [not asserted]
//           0 <= pos < MAX_BOARD_SIZE
//           2 < width, height
//           2 < length <= max(width, height)
//           type_of_win must be one of 'v' (vertical), 'h' (horizontal),
function find_win(moves, pos, type_of_win) {

    let count = 1;
    const target = game_board[(column_inputs[moves[pos]] - 1) * WIDTH + moves[pos]];

    if (type_of_win === 'v') {
        for (let i = 1; ((i < WIN_LENGTH) && 
            (column_inputs[moves[pos]] - i - 1 >= 0)); ++i) {
            if (game_board[(column_inputs[moves[pos]] - i - 1) * WIDTH 
                + moves[pos]] === target) {
                ++count;
            } else {
                break;
            }
        }
    } else if (type_of_win === 'h') {
        for (var i = 1; ((i < WIN_LENGTH) && (moves[pos] - i >= 0)); ++i) {

            if (game_board[(column_inputs[moves[pos]] - 1) * WIDTH 
                + moves[pos] - i] === target) {
                ++count;
            } else {
                break;
            }
        }

        for (var i = 1; ((i < WIN_LENGTH) && (moves[pos] + i < WIDTH)); ++i) {
            if (game_board[(column_inputs[moves[pos]] - 1) * WIDTH 
                + moves[pos] + i] === target) {
                ++count;
            } else {
                break;
            }
        }
    } else if (type_of_win === 'u') {
        for (var i = 1; ((i < WIN_LENGTH) &&
            (column_inputs[moves[pos]] - i - 1 >= 0) &&
            (moves[pos] - i >= 0)); ++i) {
            if (game_board[(column_inputs[moves[pos]] - i - 1) * WIDTH +
                moves[pos] - i] === target) {
                ++count;
            } else {
                break;
            }
        }

        for (var i = 1; ((i < WIN_LENGTH) &&
            (column_inputs[moves[pos]] + i - 1 < HEIGHT) &&
            (moves[pos] + i < WIDTH)); ++i) {
            if (game_board[(column_inputs[moves[pos]] + i - 1) * WIDTH +
                moves[pos] + i] === target) {
                ++count;
            } else {
                break;
            }
        }
    } else if (type_of_win === 'd') {
        for (var i = 1; ((i < WIN_LENGTH) &&
            (column_inputs[moves[pos]] - i - 1 >= 0) &&
            (moves[pos] + i < WIDTH)); ++i) {
            if (game_board[(column_inputs[moves[pos]] - i - 1) * WIDTH +
                moves[pos] + i] === target) {
                ++count;
            } else {
                break;
            }
        }

        for (var i = 1; ((i < WIN_LENGTH) &&
            (column_inputs[moves[pos]] + i - 1 < HEIGHT) &&
            (moves[pos] - i >= 0)); ++i) {
            if (game_board[(column_inputs[moves[pos]] + i - 1) * WIDTH +
                moves[pos] - i] === target) {
                ++count;
            } else {
                break;
            }
        }
    }

    if (count >= WIN_LENGTH) {
        return true;
    } else {
        return false;
    }
}

// is_win(moves, game_board, column_inputs, pos, width, height, length)
//   determines whether a win has occurred in the game so far, based on the
//   moves played on the game_board up till the given pos[ition], the width and 
//   height of the board, and the required length of pieces in a row
// Requires: moves, column_inputs, and game_board must all be valid arrays
//           moves, column_inputs, and game_board is an array of length 
//              (width * height) [not asserted]
//           0 <= pos < MAX_BOARD_SIZE
//           2 < width, height
//           2 < length <= max(width, height)
function is_win(moves, pos) {
    return (find_win(moves, pos, 'v') || find_win(moves, pos, 'h') ||
            find_win(moves, pos, 'u') || find_win(moves, pos, 'd'));
}

function connect_analysis(moves, turn) {      
    if (player_turn % 2 === 0) {
        game_board[column_inputs[moves[turn]] * WIDTH + moves[turn]] = PLAYER_1;
    } else {
        game_board[column_inputs[moves[turn]] * WIDTH + moves[turn]] = PLAYER_2;
    }

    ++column_inputs[moves[turn]];

    if (is_win(moves, turn)) {
        return turn;
    }
    
    return NOTHING;
}


$(document).ready(function() {
    let prevColor = 'white';

    $('.board').on('click', 'div', function(n) {
        x = GetGridElementsPosition($(this).index());
        if (prevColor === 'white') {
            let drop_row = drop(x[1]);
            if (drop_row === HEIGHT - x[0] - 1) {
                $(this).css('background-color', colors[player_turn % 2]);
                prevColor = 'done';
            } else {
                let index_of_drop = (HEIGHT - drop_row - 1) * WIDTH + x[1];                
                $('.board').children().eq(index_of_drop).css('background-color', colors[player_turn % 2]);
                $(this).css('background-color', colors[(player_turn + 1) % 2]);
            }

            moves.push(x[1]);
            drop_sound(drop_row + 1);
            if (connect_analysis(moves, player_turn) > 1) {
                alert(`Player ${player_turn % 2 + 1} Wins!`);
                win(player_turn);
            }
            ++player_turn;

        } else {
            if (columns[x[1]] < 5) {
                let drop_row = drop(x[1]);
                let index_of_drop = (HEIGHT - drop_row - 1) * WIDTH + x[1];
                $('.board').children().eq(index_of_drop).css('background-color', colors[player_turn % 2]);
                prevColor = 'done';
                
                moves.push(x[1]);
                drop_sound(drop_row + 1);
                if (connect_analysis(moves, player_turn) > 1) {
                    alert(`Player ${player_turn % 2 + 1} Wins!`);
                    win(player_turn);
                }
                ++player_turn;
            } else {
                alert(`Column ${x[1] + 1} is full!`);
            }
        }
    });
    
    $('div.disc').hover(function() {
        if ($(this).css('background-color') !== 'rgb(233, 53, 14)' &&
            $(this).css('background-color') !== 'rgb(255, 255, 0)') {
            prevColor = $(this).css('background-color');
            $(this).css('background-color', colors[player_turn % 2]);
            prevColor = 'white';
        } else {
            prevColor = 'done';
        }
    }, function() {
        if (prevColor !== 'done') {
            if (prevColor !== 'white') {
                prevColor = $(this).css('background-color');
            }
            $(this).css('background-color', prevColor);
        }
    })
    
});

function drop(col) {
    ++columns[col];
    if (columns.reduce((a, b) => a + b) === 35) {
        alert('Game Tied!\nWould you like to start again?'); // CHANGE TIED ALERT
    }
    return columns[col];
}

function win(n) { //////////////////////////////////
    console.log(n);
}

function GetGridElementsPosition(n) {
    const colCount = $('.board').css('grid-template-columns').split(' ').length;

    const rowPosition = Math.floor(n / colCount);
    const colPosition = n % colCount;
    
    return [rowPosition, colPosition];
}

function drop_sound(n) {
    disc_drop.playbackRate=n;
    disc_drop.play();
}

const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', function() {
    game_board = new Array(WIDTH * HEIGHT).fill(0);
    column_inputs = new Array(WIDTH).fill(0);
    columns = new Array(WIDTH).fill(-1);
    player_turn = 0;

    $('.board').children().each(function() {
        $(this).css('background-color', 'white');
    })
})
