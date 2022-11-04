On the grid: pacman is represented as PAC, the ghoasts as GHO, the walls/obstacles as XXX and the free cells as 0.0 .
My pacman's initial position is the cell at the bottom left.
The ghoast's reward is -1.0, the free cells's reward is 1.0 (this reward is the coin). In the current game, when pacman ends on a free cell, he gains the coin (so increases the total reward/final score) and the reward of the free cell becomes 0.0 (and it will remain zero until the end of the current game).

The goal is reached when pacman has collected all the coins in the grid.

When pacman ends on a ghost, pacman doesn't lose points, but dies and returns in his initial position. The reward of the free cells that have become 0 remain 0 after the first and the second death.
The game ends when pacman has died 3 times. Pacman returns in his initial position, all the grid is reinitialised (all the free spaces's reward return at 1.0) and the total reward returns to be zero.

When pacman dies (for the first or second time) the 'my_env.render()' returns us a grid in which pacman is returned in the initial position established for the game (the cell at the bottom on the left).


When you run the 'pacmanMain' a new game start. It generater a certain number of random actions, tha pacman will follow. It can stop for 3 reasons: pacman wins, pacman dies for 3 times, it is finished the number of random moves.

In 'pac_foo/envs/pac_env.py' there is the code of the environment.
In the same directory of the README there is 'pacmanMain' which is the main you have to run.