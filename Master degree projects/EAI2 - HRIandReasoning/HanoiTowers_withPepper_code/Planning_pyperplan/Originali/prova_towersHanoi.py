import matplotlib.pyplot as plt
import networkx as nx
from unified_planning.shortcuts import *
from unified_planning.solvers import PlanGenerationResultStatus
import math
from fractions import Fraction
import numpy as np
import matplotlib.pyplot as plt
import networkx as nx


# Saving initial and goal location names in python variables
INIT = 'loc_1'  #loc_2  loc_3
DEST = 'loc_3'

# disk_3 is the biggest
num_disks = 3

Items_list = ['loc_1', 'loc_2', 'loc_3']
for i in range(num_disks):
  Items_list.append(f'disk_{i+1}')
print(Items_list)


# First, we declare a "Location" type 
#Location = UserType('Location')
Item = UserType('Item')

# We create a new problem
problem = Problem('towersHanoi')

# Declare the fluents:
# - `robot_at` is a predicate modeling the robot position,
# - `connected` is a static fluent for modeling the graph connectivity relation
is_disk = Fluent('is_disk', BoolType(), disk_i=Item)
clear = Fluent('clear', BoolType(), disk_i=Item)
on = Fluent('on', BoolType(), disk_i=Item, disk_pos=Item)
smaller = Fluent('smaller', BoolType(), disk_i=Item, disk_j=Item)
#robot_at = Fluent('robot_at', BoolType(), position=Location)
#connected = Fluent('connected', BoolType(), l_from=Location, l_to=Location)

# Add the fluents to the problem, a Fluent can be resused in many problems
# The default values are optional and can be any value (not forcing closed-world assumption) 
#problem.add_fluent(robot_at, default_initial_value=False)
#problem.add_fluent(connected, default_initial_value=False)
problem.add_fluent(is_disk, default_initial_value=False)
problem.add_fluent(clear, default_initial_value=False)
problem.add_fluent(on, default_initial_value=False)
problem.add_fluent(smaller, default_initial_value=False)

# Create a simple `move` action  
move = InstantaneousAction('move', disk=Item, l_from=Item, l_to=Item)
disk = move.parameter('disk')
l_from = move.parameter('l_from')
l_to = move.parameter('l_to')
move.add_precondition(is_disk(disk))
move.add_precondition(smaller(disk, l_to))
move.add_precondition(on(disk, l_from))
move.add_precondition(clear(disk))
move.add_precondition(clear(l_to))
move.add_effect(clear(l_from), True)
move.add_effect(on(disk, l_to), True)
move.add_effect(on(disk, l_from), False)
move.add_effect(clear(l_to), False)
problem.add_action(move)

# Programmatically create a map from location name to a new `Object` of type `Location`
items = {str(i) : Object(str(i), Item) for i in Items_list}
#locations = {str(l) : Object(str(l), Location) for l in location_map.nodes}

# Add all the objects to the problem
problem.add_objects(items.values())

# Setting the initial location
#problem.set_initial_value(robot_at(locations[INIT]), True)
for i in range(num_disks):
  problem.set_initial_value(is_disk(items[f'disk_{i+1}']), True)
  if i==0: #disk 1
    problem.set_initial_value(on(items[f'disk_{i+1}'], items['loc_2']), True)
  else:
    problem.set_initial_value(on(items[f'disk_{i+1}'], items['loc_1']), True)

  if i!=num_disks-1:
    if i!=0:
      problem.set_initial_value(on(items[f'disk_{i+1}'], items[f'disk_{i+2}']), True)
    for j in range(i+1, num_disks):
      problem.set_initial_value(smaller(items[f'disk_{i+1}'], items[f'disk_{j+1}']), True)

  for k in range(3): #3 is the num_locs
    problem.set_initial_value(smaller(items[f'disk_{i+1}'], items[f'loc_{k+1}']), True)

problem.set_initial_value(clear(items['disk_1']), True)
problem.set_initial_value(clear(items['disk_2']), True)
problem.set_initial_value(clear(items['loc_3']), True)



# Initializing the connectivity relations by iterating over the graph edges
#for (f, t) in location_map.edges:
#  problem.set_initial_value(connected(locations[str(f)], locations[str(t)]), True)
#  problem.set_initial_value(connected(locations[str(t)], locations[str(f)]), True)

# Setting the goal
for i in range(num_disks-1):
  problem.add_goal(on(items[f'disk_{i+1}'], items[f'disk_{i+2}']))
problem.add_goal(on(items[f'disk_{num_disks}'], items[DEST]))

# Printing the problem data structure in human-readable form
# (We can also print in PDDL and ANML)
print(problem)




for planner_name in ['pyperplan', 'fast_downward']:
  with OneshotPlanner(name=planner_name) as planner:
    result = planner.solve(problem)
    if result.status == PlanGenerationResultStatus.SOLVED_SATISFICING:
      print(f'{planner_name} found a plan.\nThe plan is: {result.plan}')
    else:
      print("No plan found.")
      
      



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
        
with Grounder(problem_kind=problem.kind) as grounder:
    ground_problem, map_back_function = grounder.ground(problem)
    print(ground_problem)

    # The map_back_function can be used to "lift" a ground plan back to the level of the original problem
    with OneshotPlanner(problem_kind=ground_problem.kind) as planner:
        ground_plan = planner.solve(ground_problem).plan
        print('Ground plan: %s' % ground_plan)
        lifted_plan = map_back_function(ground_plan)
        print('Lifted plan: %s' % lifted_plan)
        with PlanValidator(problem_kind=problem.kind) as validator:
            assert validator.validate(ground_problem, ground_plan)
            assert validator.validate(problem, lifted_plan)
