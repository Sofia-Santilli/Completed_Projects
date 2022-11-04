import gym
from gym import error, spaces, utils
from gym.utils import seeding

from typing import Dict, List, Optional, Tuple

import dataclasses
import numpy as np

@dataclasses.dataclass

class Transition:
        state: Tuple[int, int]
        action: str
        next_state: Tuple[int, int]
        reward: float
        termination: bool


class PacmanEnv(gym.Env):
    metadata = {'render.modes':['human']}
   
    _states: np.array
    _rewards: np.array
    _action_semantics: List[str]
    _actions: Dict[str, np.array]
    _init_state: Tuple[int, int]
    _current_state: Tuple[int, int]
    _goal: int                               #goal is the max number of coins that pacman can collect
    _pits: Optional[List[Tuple[int, int]]]
    _transition_probabilities: np.array
        
    _totalReward: float
    _numberDead: int
        
    _obstacles : Optional[List[Tuple[int, int]]]
    _rows : int
    _cols : int
        
    def __init__(self, 
                 rows: int, 
                 cols: int,
                 goal: int, 
                 pits: Optional[List[Tuple[int, int]]] = None,
                 obstacles: Optional[List[Tuple[int, int]]] = None) -> None: #->none significa che non ritorna nulla
        self._states = np.zeros((rows, cols)) #ritorna un array riempito di zeri
        
        obstacles = [] if obstacles is None else obstacles #se gli ostacoli passati sono nulli allora gli ostacoli sono vuoti,
        #altrimenti dentro ostacoli ci metto gli ostacoli che gli passo come argomento
        
        for r, c in obstacles:
            self._states[r, c] = 1 #lo setta a 1 per rappresentare gli ostacoli nella matrice che stampo, gli stati attraversabili sono 0
     
        #due for per settare come ostacoli tutti i muri laterali, ovvero i bordi della griglia
        for c in range(cols):  #ciclo sulle colonne, tenendo fissa una riga
            self._states[0, c] = 1  #il lato in alto della griglia
            self._states[rows-1, c] = 1  #il lato in basso della griglia
        
        for  r in range(rows):  #ciclo sulle righe, tenendo fissa la colonna
            self._states[r, 0] = 1
            self._states[r, cols-1] = 1
    
    
        self._rewards =  1*np.ones((rows, cols))    #-step_cost*np.ones((rows, cols))
        
        for r, c in pits:    #sono i reward se finisco dentro a un pozzo (i pozzi sono -1, gli ostacoli 1) 
            self._rewards[r, c] = -1
        
        self._action_semantics = ['up', 'left', 'down', 'right']
        self._actions = np.array([[-1, 0], [0, -1], [1, 0], [0, 1]])
        self._init_state = (rows-2, 1)          #lo stato iniziale è posto in basso a sinistra nella griglia
        self._current_state = self._init_state  #quando inizializzo lo stato corrente è lo stato iniziale
        
        #metto il reward delo stato iniziale già a zero, in quanto non vi è la monetina (di pacman)
        self._rewards[self._init_state[0], self._init_state[1]] = 0
        
        self._totalReward = 0
        self._numberDead = 0
        
        self._goal = goal
        self._pits = pits
        
        self._obstacles = obstacles
        self._cols = cols
        self._rows = rows
        
        # going right, straight, left wrt chosen action
        self._transition_probabilities = np.array([0, 1, 0]) #the action that pacman chooses is the action that he does
      
    #la -> mi dice il tipo di ritorno
    
    @property
    def actions(self) -> List[str]:
        return self._action_semantics
    
    @property
    def current_state(self) -> Tuple[int, int]:
        return self._current_state
    
    @property
    def reward(self) -> float:
        r, c = self._current_state
        return self._rewards[r, c]
    
    @property
    def termination(self) -> bool:     #termination is a boolean which tells if pacman has or not collected all the coins
        return self._totalReward == self._goal
    
    def render(self) -> None:
        grid = np.array(self._states, dtype=str)
        r, c = self._current_state
        grid[r, c] = 'PAC' 
        
        for r, c in self._obstacles :
            grid[r, c] = 'XXX'
        

        for c in range(self._cols):  #ciclo sulle colonne, tenendo fissa una riga
            grid[0, c] = 'XXX'  #il lato in alto della griglia
            grid[self._rows-1, c] = 'XXX'  #il lato in basso della griglia
        
        for  r in range(self._rows):  #ciclo sulle righe, tenendo fissa la colonna
            grid[r, 0] = 'XXX'
            grid[r, self._cols-1] = 'XXX'

        
        
        
        for r, c in self._pits:
            grid[r, c] = 'GHO'   #indicates the pits(here ghoasts) 

        print(grid)
        
    def _transition(self, state: Tuple[int, int], a: np.array) -> Tuple[int, int]:  #con np.array creo un array
        n_actions = len(self._actions)  #numero dell' azione compiuta
        a = self._actions[a + n_actions if a < 0 else a % n_actions]
        new_r = max(0, min(self._states.shape[0] - 1, state[0] + a[0]))
        new_c = max(0, min(self._states.shape[1] - 1, state[1] + a[1]))
        return (new_r, new_c) if self._states[new_r, new_c] == 0. else state  #ritorno il nuovo stato solo se non è un pozzo o un ostacolo
        
    def step(self, action: str) -> Transition:
        a_idx = self._action_semantics.index(action)
        
        rnd = np.random.rand()
        chosen_action = a_idx + np.random.choice([1, 0, -1], p=self._transition_probabilities)
        prev_state = self._current_state  #come previous_state salvo lo stato dove stavo prima di questo step
        self._current_state = self._transition(self._current_state, chosen_action)  #definisco un nuovo stato corr. se non è pozzo o ostacolo
        
        prevState=prev_state
        act=action
        currentState=self._current_state
        rew=self.reward #OK
        
        if self.reward != -1 :  #in the case I'm on a ghost, I don't sum the reward -1 of the ghost to the total reward
            self._totalReward = self._totalReward + self.reward
            
    
        #if the state is a ghost (with reward -1) it has to remain a ghost, else I remove the coin
        if self.reward != -1 :  
            newrew=self.updateReward(0.0, self._current_state[0], self._current_state[1]) #OK
            
        
        #I count haw many time, from the restarting of the game, pacman has met a ghost (when 3 we'll going to restart the game)
        if self.reward == -1 :
            self._numberDead += 1
        
        
        #when pacman goes on a ghost, pacman dies, so I have to reset the env. If it is the third death,
        #I have to restart the entire game.
        if self.reward == -1 :
            if self._numberDead < 3:
                self.reset()
            else:
                print('Third Death')
                            
        
        return Transition(state=prevState,
                          action=act,
                          next_state=currentState,
                          reward=rew, #OK
                          termination=self.termination)

    
    def reset(self) -> None:
        self._current_state = self._init_state
    
    
    #the 'restart' in pacman has to put the environment exactly as it was at the beginning,
    #so 'restart' has to put the rewards at 1 (because pacman in the previous game could
    #have eaten them in some states).
    #NB the pits put as the argument in 'reset' ha to be the same put in 'GridEnv'
    def restart(self,
              rows: int, 
              cols: int,
              pits: Optional[List[Tuple[int, int]]]=None) -> None:
        self._current_state = self._init_state
        
        self._totalReward = 0
        self._numberDead = 0
        
        self._rewards =  1*np.ones((rows, cols))
        self._rewards[self._init_state[0], self._init_state[1]] = 0
        for r, c in pits:    #sono i reward se finisco dentro a un pozzo (i pozzi sono -1, gli ostacoli 1) 
            self._rewards[r, c] = -1
          
    def state_space_size(self) -> Tuple[int, int]:
        return self._states.shape
    
    def action_space_size(self) -> int:
        return len(self._actions)
    
    #when called, it changes the reward from 1 to 0 (because the coin has been eaten by pacman)
    def updateReward(self, new: int, riga: int, col: int) -> float:
        self._rewards[riga,col] = new
        return self._rewards[riga,col]
    
    @property
    def totReward(self) -> float:
        return self._totalReward
    
    @property
    def numDeath(self) -> int:
        return self._numberDead
    