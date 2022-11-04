import matplotlib.pyplot as plt
import networkx as nx

# Use seed when creating the graph for reproducibility
location_map = nx.soft_random_geometric_graph([f'loc_{i}' for i in range(15)], 0.5, seed=2)
# Position is stored as node attribute data for soft_random_geometric_graph
pos = nx.get_node_attributes(location_map, "pos")

# Show the graph
plt.figure(figsize=(8, 8))
nx.draw_networkx_edges(location_map, pos, alpha=0.4)
nx.draw_networkx_nodes(
    location_map,
    pos,
    node_size=1800
)
nx.draw_networkx_labels(location_map, pos)
plt.show()

# Saving initial and goal location names in python variables
INIT = 'loc_0'
DEST = 'loc_10'

from unified_planning.shortcuts import *

# First, we declare a "Location" type 
Location = UserType('Location')

# We create a new problem
problem = Problem('robot')

# Declare the fluents:
# - `robot_at` is a predicate modeling the robot position,
# - `connected` is a static fluent for modeling the graph connectivity relation
robot_at = Fluent('robot_at', BoolType(), position=Location)
connected = Fluent('connected', BoolType(), l_from=Location, l_to=Location)

# Add the fluents to the problem, a Fluent can be resused in many problems
# The default values are optional and can be any value (not forcing closed-world assumption) 
problem.add_fluent(robot_at, default_initial_value=False)
problem.add_fluent(connected, default_initial_value=False)

# Create a simple `move` action  
move = InstantaneousAction('move', l_from=Location, l_to=Location)
l_from = move.parameter('l_from')
l_to = move.parameter('l_to')
move.add_precondition(robot_at(l_from))
move.add_precondition(connected(l_from, l_to))
move.add_effect(robot_at(l_from), False)
move.add_effect(robot_at(l_to), True)
problem.add_action(move)

# Programmatically create a map from location name to a new `Object` of type `Location`
locations = {str(l) : Object(str(l), Location) for l in location_map.nodes}

# Add all the objects to the problem
problem.add_objects(locations.values())

# Setting the initial location
problem.set_initial_value(robot_at(locations[INIT]), True)

# Initializing the connectivity relations by iterating over the graph edges
for (f, t) in location_map.edges:
  problem.set_initial_value(connected(locations[str(f)], locations[str(t)]), True)
  problem.set_initial_value(connected(locations[str(t)], locations[str(f)]), True)

# Setting the goal
problem.add_goal(robot_at(locations[DEST]))

# Printing the problem data structure in human-readable form
# (We can also print in PDDL and ANML)
print(problem)

from unified_planning.solvers import PlanGenerationResultStatus

for planner_name in ['pyperplan', 'fast_downward']:
  with OneshotPlanner(name=planner_name) as planner:
    result = planner.solve(problem)
    if result.status == PlanGenerationResultStatus.SOLVED_SATISFICING:
      print(f'{planner_name} found a plan.\nThe plan is: {result.plan}')
    else:
      print("No plan found.")
      
      
import math
from fractions import Fraction

# A simple function that associates a battery cost to each edge
def battery_consumption(loc_from, loc_to):
  pos = nx.get_node_attributes(location_map, "pos")
  fx, fy = pos[loc_from]
  tx, ty = pos[loc_to]
  distance = math.sqrt((fx - tx)**2 + (fy - ty)**2)
  return int(5 + distance * 30 + 2)

# Adding more fluents:
# - `battery` to model the residual amount of battery
# - `consumption` to model the battery consumption on each edge 
battery = Fluent('battery', RealType(0, 100))
consumption = Fluent('consumption', RealType(), l_from=Location, l_to=Location)

# Adding the fluents to the problem
problem.add_fluent(battery)
problem.add_fluent(consumption, default_initial_value=-1)

# Extend the `move` action
move.add_precondition(GE(consumption(l_from, l_to), 0))
move.add_precondition(GE(battery, consumption(l_from, l_to)))
move.add_effect(battery, Minus(battery, consumption(l_from, l_to)))

# Setting the initial state of the new fluents
problem.set_initial_value(battery, 100)

for (f, t) in location_map.edges:
  problem.set_initial_value(consumption(locations[str(f)], locations[str(t)]), battery_consumption(f, t))
  problem.set_initial_value(consumption(locations[str(t)], locations[str(f)]), battery_consumption(t, f))

print(problem)

with OneshotPlanner(problem_kind=problem.kind) as planner:
  result = planner.solve(problem)
  if result.status == PlanGenerationResultStatus.SOLVED_SATISFICING:
    print(f'{planner.name} found a plan.\n The plan is: {result.plan}')
  else:
    print("No plan found.")
    
with OneshotPlanner(name='tamer') as planner:
  result = planner.solve(problem)
  if result.status == PlanGenerationResultStatus.SOLVED_SATISFICING:
    print(f'{planner.name} found a plan.\n The plan is: {result.plan}')
  else:
    print("No plan found.")
    
    
with OneshotPlanner(names=['tamer', 'tamer', 'enhsp'],
                    params=[{'heuristic': 'hadd'}, {'heuristic': 'hmax'}, {}]) as planner:
    plan = planner.solve(problem).plan
    print(f'{planner.name} returned: {plan}')
    
    
import numpy as np
import matplotlib.pyplot as plt

b = [100]
labels = ['<initial value>']
for ai in plan.actions:
  c = problem.initial_value(consumption(*ai.actual_parameters))
  b.append(b[-1] - c.constant_value())
  labels.append(str(ai))

x = list(range(len(plan.actions)+1))
plt.bar(x, b, width=1)

plt.xlabel('Plan')
plt.ylabel('Battery')
plt.xticks(x, labels, rotation='vertical')
plt.title('Battery Consumption')
plt.show()


plan = result.plan
with PlanValidator(problem_kind=problem.kind) as validator:
    if validator.validate(problem, plan):
        print('The plan is valid')
    else:
        print('The plan is invalid')
        


# The map_back_function can be used to "lift" a ground plan back to the level of the original problem
with Grounder(problem_kind=problem.kind) as grounder:
    ground_problem, map_back_function = grounder.ground(problem)
    print(ground_problem)

'''
# The map_back_function can be used to "lift" a ground plan back to the level of the original problem
with OneshotPlanner(problem_kind=ground_problem.kind) as planner:
    ground_plan = planner.solve(ground_problem).plan
    print('Ground plan: %s' % ground_plan)
    lifted_plan = map_back_function(ground_plan)
    print('Lifted plan: %s' % lifted_plan)
    with PlanValidator(problem_kind=problem.kind) as validator:
        assert validator.validate(ground_problem, ground_plan)
        assert validator.validate(problem, lifted_plan)
'''

