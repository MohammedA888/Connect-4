const PLAYER_1 = 1;
const PLAYER_2 = 2;
const WIDTH = 7;
const HEIGHT = 6;
const WIN_LENGTH = 4;
const colors = ['#ffff00', '#e9350e'];

let moves = [];
let win_discs = [];
let game_board = new Array(WIDTH * HEIGHT).fill(0);
let column_inputs = new Array(WIDTH).fill(0);
let columns = new Array(WIDTH).fill(-1);
let player_turn = 0;

const score = document.getElementById('score');

// get_index(n) returns the grid element index based on the index of game_board
function get_index(n) {
    let r1 = Math.floor(n / WIDTH);
    let c = n - WIDTH * r1;

    let r2 = HEIGHT - r1 - 1;
    return WIDTH * r2 + c;
}

// find_win(type_of_win) returns true if a win exists, given the type_of_win to look
//   for. Possible wins are 'v' = vertical, 'h' = horizontal, 'u' = upwards diagonal,
//   and 'd' = downwards diagonal
function find_win(type_of_win) {

    let count = 1;
    const target = game_board[(column_inputs[moves[player_turn]] - 1) * WIDTH + moves[player_turn]];

    if (type_of_win === 'v') {
        for (let i = 1; ((i < WIN_LENGTH) && 
            (column_inputs[moves[player_turn]] - i - 1 >= 0)); ++i) {
            if (game_board[(column_inputs[moves[player_turn]] - i - 1) * WIDTH 
                + moves[player_turn]] === target) {
                ++count;
                win_discs.push(get_index((column_inputs[moves[player_turn]] - i - 1) * WIDTH + moves[player_turn]));
            } else {
                break;
            }
        }
    } else if (type_of_win === 'h') {
        for (var i = 1; ((i < WIN_LENGTH) && (moves[player_turn] - i >= 0)); ++i) {

            if (game_board[(column_inputs[moves[player_turn]] - 1) * WIDTH 
                + moves[player_turn] - i] === target) {
                ++count;
                win_discs.push(get_index((column_inputs[moves[player_turn]] - 1) * WIDTH + moves[player_turn] - i));
            } else {
                break;
            }
        }
        
        for (var i = 1; ((i < WIN_LENGTH) && (moves[player_turn] + i < WIDTH)); ++i) {
            if (game_board[(column_inputs[moves[player_turn]] - 1) * WIDTH 
                + moves[player_turn] + i] === target) {
                ++count;
                win_discs.push(get_index((column_inputs[moves[player_turn]] - 1) * WIDTH + moves[player_turn] + i));
            } else {
                break;
            }
        }
    } else if (type_of_win === 'u') {
        for (var i = 1; ((i < WIN_LENGTH) &&
            (column_inputs[moves[player_turn]] - i - 1 >= 0) &&
            (moves[player_turn] - i >= 0)); ++i) {
            if (game_board[(column_inputs[moves[player_turn]] - i - 1) * WIDTH +
                moves[player_turn] - i] === target) {
                ++count;
                win_discs.push(get_index((column_inputs[moves[player_turn]] - i - 1) * WIDTH + moves[player_turn] - i));
            } else {
                break;
            }
        }

        for (var i = 1; ((i < WIN_LENGTH) &&
            (column_inputs[moves[player_turn]] + i - 1 < HEIGHT) &&
            (moves[player_turn] + i < WIDTH)); ++i) {
            if (game_board[(column_inputs[moves[player_turn]] + i - 1) * WIDTH +
                moves[player_turn] + i] === target) {
                ++count;
                win_discs.push(get_index((column_inputs[moves[player_turn]] + i - 1) * WIDTH + moves[player_turn] + i));
            } else {
                break;
            }
        }
    } else if (type_of_win === 'd') {
        for (var i = 1; ((i < WIN_LENGTH) &&
            (column_inputs[moves[player_turn]] - i - 1 >= 0) &&
            (moves[player_turn] + i < WIDTH)); ++i) {
            if (game_board[(column_inputs[moves[player_turn]] - i - 1) * WIDTH +
                moves[player_turn] + i] === target) {
                ++count;
                win_discs.push(get_index((column_inputs[moves[player_turn]] - i - 1) * WIDTH + moves[player_turn] + i));
            } else {
                break;
            }
        }

        for (var i = 1; ((i < WIN_LENGTH) &&
            (column_inputs[moves[player_turn]] + i - 1 < HEIGHT) &&
            (moves[player_turn] - i >= 0)); ++i) {
            if (game_board[(column_inputs[moves[player_turn]] + i - 1) * WIDTH +
                moves[player_turn] - i] === target) {
                ++count;
                win_discs.push(get_index((column_inputs[moves[player_turn]] + i - 1) * WIDTH + moves[player_turn] - i));
            } else {
                break;
            }
        }
    }

    if (count >= WIN_LENGTH) {
        return true;
    } else {
        win_discs = [];
        return false;
    }
}

// is_win() determines whether a win has occurred in the game so far, based on the
//   moves played on the game_board up till the given player turn
function is_win() {
    return (find_win('v') || find_win('h') || find_win('u') || find_win('d'));
}

// connect_analysis(ind) returns true if the board has a winning position, and false otherwise
function connect_analysis(ind) {     
    if (player_turn % 2 === 0) {
        game_board[column_inputs[moves[player_turn]] * WIDTH + moves[player_turn]] = PLAYER_1;
    } else {
        game_board[column_inputs[moves[player_turn]] * WIDTH + moves[player_turn]] = PLAYER_2;
    }

    ++column_inputs[moves[player_turn]];

    if (is_win()) {
        win_discs.unshift(ind);
        return true;
    }
    
    return false;
}


$(document).ready(function() {
    let prevColor = 'white';

    $('.board').on('click', 'div', function(n) {
        x = get_coords($(this).index());
        if (prevColor === 'white') {
            let drop_row = drop(x[1]);
            let index_of_drop = (HEIGHT - drop_row - 1) * WIDTH + x[1];
            if (drop_row === HEIGHT - x[0] - 1) {
                $(this).css('background-color', colors[player_turn % 2]);
                prevColor = 'done';
            } else {               
                $('.board').children().eq(index_of_drop).css('background-color', colors[player_turn % 2]);
                $(this).css('background-color', colors[(player_turn + 1) % 2]);
            }

            moves.push(x[1]);
            drop_sound(drop_row + 1);
            if (connect_analysis(index_of_drop)) {
                win();
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
                if (connect_analysis(index_of_drop)) {
                    win();
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

// drop(col) determines which row the disc will be dropped at. If the board is all
//   filled up, a tie alert is displayed.
function drop(col) {
    ++columns[col];
    if (columns.reduce((a, b) => a + b) === 35) {
        alert('Game Tied!');
        reset_board();
        return;
    }
    return columns[col];
}

// win() produces a win alert and updates the player scoreboard
function win() {
    alert(`Player ${player_turn % 2 + 1} Wins!`);
    for (var i = 0; i < win_discs.length; ++i) {
        $('.board').children().eq(win_discs[i]).css('border', '5px solid cyan');
    }

    let val = score.innerHTML.split(':');
    ++val[player_turn % 2];
    let result = val.join(':');
    score.innerHTML = result;
    reset_board();
}

// get_coords(n) returns the row and column representation of a given grid disc, given
//   by its index n
function get_coords(n) {
    const colCount = $('.board').css('grid-template-columns').split(' ').length;

    const rowPosition = Math.floor(n / colCount);
    const colPosition = n % colCount;
    
    return [rowPosition, colPosition];
}


let disc_drop = document.querySelector('#audio');

// drop_sound(n) plays audio for disc drop with playback rate n, determined
//    by the height of the drop
function drop_sound(n) {
    disc_drop.playbackRate=n;
    disc_drop.play();
}

// Resets the board and timer when the button is clicked
const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', reset_board);

// reset_board() resets all variables and the board state
function reset_board() {
    moves = [];
    win_discs = [];
    game_board = new Array(WIDTH * HEIGHT).fill(0);
    column_inputs = new Array(WIDTH).fill(0);
    columns = new Array(WIDTH).fill(-1);
    player_turn = 0;
    sec = 0;

    $('.board').children().each(function() {
        $(this).css('background-color', 'white');
        $(this).css('border', 'none');
    })
}

// Toggles between volume on and volume off, based on the button click
const volume = document.querySelector('.volume');
volume.addEventListener('click', function() {
    if (volume.id === 'volume-on') {
        volume.id = 'volume-off';
        disc_drop.muted = true;
    } else {
        volume.id = 'volume-on';
        disc_drop.muted = false;
    }
})


let sec = 0;

// pad(val) returns val if val > 9, and pads a 0 to number otherwise
function pad(val) {
    if (val > 9) {
        return val
    } else {
        return '0' + val;
    }
}

// Updates timer every second
setInterval(function() {
    $("#sec").html(pad(++sec % 60));
    $("#min").html(pad(parseInt(sec / 60,10)));
}, 1000);
