# Completed_Projects

## Table of contents

* [**Bachelor degree projects**](https://github.com/Sofia-Santilli/Completed_Projects/tree/main/Bachelor's%20degree%20projects)
* [**Master degree projects**](https://github.com/Sofia-Santilli/Completed_Projects/tree/main/Master's%20degree%20projects)
***

## Bachelor degree projects

***

## Master degree projects

1. **Machine Learning**: two homeworks in which we needed to solve two different classification tasks:
* Homework 1, whose goal is to classify binary functions (each composed of a set of assembly instructions of no predefined lenght) into 4 different classes, using traditional ML approaches (SVM, decision trees) 
* Homework 2, whose goal is to classify a series of images belonging to 8 different classes. Neural networks (AlexNet and TransferNet) were employed.

2. **Reinforcement Learning**: two reinforcement learning projects:
* implementation of a very simplified version of Pacman
* project based on a neural network that applies the off-policy _Deep Deterministic Policy Gradient_ algorithm, 
in order to let the Mujoco’s [_HalfCheetah-v2_](https://gym.openai.com/envs/HalfCheetah-v2/) learn how 
to trot in the MuJoCo Advanced physics simulation of OpenAI Gym.

3. **Fundamentals of Computer Graphics**: three homeworks about modeling and rendering three-dimensional scenes, using the library YoctoGL. Everything has been done using Visual Studio Code with C/C++.
* Homework 1: implementation of a _Ray tracer_
* Homework 2: implementation of a _Path tracer_
* Homework 3: implementation of a _Volumetric Path tracer_

4. **Interactive Graphics**: two homeworks and a project.
* homeworks consisting in the implementation of basic tasks in computer graphics, such as rendering a scene, 
shadowing, variable lighting and animations with WebGL,
* a final project realized in group with other colleagues, which consists in the 
implementation of a web version of the mobile game "Crossy road", using WebGL and the advanced library ThreeJS. 
It is possible to play the game at [this link](https://lucpol98.github.io/university_projects/Master%20Degree/Interactive%20Graphics/Project/main.html).

5. **Natural Language Processing**: homework on Word-in-Context Disambiguation (WiCD) using PyTorch.

6. **Vision and Perception**: two homeworks and a project were carried out.
* the two homework assignements were on [_Image Processing_](https://en.wikipedia.org/wiki/Digital_image_processing)
and [_Multiview Geometry Projective Geometry_](https://en.wikipedia.org/wiki/Projective_geometry)
* project consisting in the implementation and the extension of the paper
 "[_SinGAN: Learning a Generative Model from a Single Natural Image_](https://arxiv.org/pdf/1905.01164.pdf)". 
 SinGAN is a generative neural network, made up by a pyramid of generators that are trained on an image pyramid obtained by downsampling the single training image.
 In particular, our extension of the paper consists in the adaptation of the network to make it work 
 with medical images. The aim of the project, in fact, is to use SinGAN in order to increase the images of the datasets used in the medical field in a realistic way.

7. **Autonomous and Mobile Robots**: Implementation and comparison of Classic and Primitive-based versions of RRT*
The two versions of RRT* have been developed in an Ubuntu 18.04 environment using C++ and performing simulations in CoppeliaSim 4.0 EDU, on a unicycle, here treated as a Dubins' vehicle.

8. [**Neural Networks**](https://github.com/Sofia-Santilli/Completed_Projects/tree/main/Master%20degree%20projects/Neural%20Networks): Reimplementation of the approach proposed by the paper "[_Learning strides in convolutional neural networks_](https://arxiv.org/pdf/2202.01653.pdf)".
We reimplemented two different pooling layers, used instead of the strides in the convolutional layers and that work in the frequency domain (Fixed spectral pooling and Learnable spectral pooling).
We also substituted the classical Conv2d layers in the network with [_Parametrized Hypercomplex Convolutional layers_](https://arxiv.org/pdf/2110.04176.pdf), which allow to reduce the overall number of parameters by a factor of N.

9. [**Deep Learning**](https://github.com/Sofia-Santilli/Completed_Projects/tree/main/Master%20degree%20projects/Deep%20Learning): development of architectures that address the Visual Question Answering task. It is a semantic task that aims to answer questions based on an image.
These questions require an understanding of vision, language and commonsense knowledge to answer. The VQA v2.0 dataset, containing open-ended questions about images, has been employed.

10. **Elective in AI - part1** - In this pproject we proposed and developed a Conditional Generative Adversarial Network (CGAN) for brain MRI denoising in the k-space. 
It is a novel approach. In fact previously denoising of brain MRI in the k-space has been done only through simpler DnCNN, that we used as baseline for our comparisons.

11. **Elective in AI - Human-Robot Interaction and Reasoning**: The project consists in making a Pepper robot, named
Hanoi, able to perform the reasoning needed to solve the Tower of Hanoi game and to do this by taking
turns with a human user. 
* The reasoning part was implemented through the AIplan4UE framework, that allowed the robot to plan the most suitable actions to performe in the game.
* Regarding the human-robot interaction part we provided different modalities to make the user interact with the robot,
specifically verbally and through its tablet. Moreover, given the importance of interpersonal distances in
social interactions, we make sure that the robot starts an interaction only when a person gets close to it. 
At the same time, the robot stays still and does not get closer itself,
otherwise it would risk invading the user’s intimate zone. 
Finally, we make the robot collect information about the user to build a simplified user’s profile that allows 
to successfully interact with people of different ages and to suggest to the person the most appropriate level of the game.

12. **Planning and Reasoning**:
* for the Planning part, I wrote an essay with an overview of the  methods applied in the last decades in order to solve path
planning problems, explaining in details why RRTs gained the attention of many researchers. Then different versions of the 
Rapidly-exploring Random Tree algorithms are presented and their functioning is explained also through pseudocode. 
Their properties are highlighted and comparisons between them are done.
* for the Reasoning part, three answers to reasoning problems.


***